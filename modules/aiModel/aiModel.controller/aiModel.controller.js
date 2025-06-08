import { parse } from "csv-parse/sync";
import { OpenAI } from "openai";
import { productModel } from "../../../DB/models/product.model.js";
import { goalsModel } from "../../../DB/models/goals.model.js";
import { memberModel } from "../../../DB/models/member.model.js";
import moment from "moment";
import { chatModel } from "../../../DB/models/chat.model.js";
import { incomeModel } from "../../../DB/models/income.model.js";
import { expenseModel } from '../../../DB/models/expense.model.js';

// Extract numbers from text (including Arabic text)
function extractNumber(text) {
  if (typeof text === "number") {
    return text;
  }

  if (typeof text === "string") {
    const match = text.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  return 0;
}
//function for process csv file
function processCsvData(fileContent) {
  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const result = records
      .filter((row) => row["اسم المنتج"] && row["السعر"])
      .map((row) => {
        const priceChangeRaw = row["التغير في السعر"] || "";
        let priceChangePercent = 0;

        if (priceChangeRaw.includes("%")) {
          const match = priceChangeRaw.match(/-?\d+(\.\d+)?/);
          if (match) {
            priceChangePercent = parseFloat(match[0]);
          }
        }

        return {
          product: row["اسم المنتج"],
          price: parseFloat(row["السعر"]),
          price_change: parseFloat(priceChangeRaw) || 0,
          price_change_percent: priceChangePercent,
        };
      });

    return result;
  } catch (error) {
    throw new Error(`Error processing CSV: ${error.message}`);
  }
}
// Get advice from DeepSeek AI
async function getDeepseekAdvice(messages, apiKey) {
  try {
    const client = new OpenAI({
      apiKey: process.env.API_KEY_AI,
      baseURL: "https://api.deepseek.com",
    });

    const response = await client.chat.completions.create({
      model: "deepseek-reasoner",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    if (response.choices[0].message.reasoning_content) {
      return {
        reasoning: response.choices[0].message.reasoning_content,
        advice: response.choices[0].message.content,
      };
    } else {
      return {
        reasoning: "No detailed reasoning provided.",
        advice: response.choices[0].message.content,
      };
    }
  } catch (error) {
    throw new Error(`Error connecting to DeepSeek API: ${error.message}`);
  }
}
//upload csv file for admin only
export const uploadCSVFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No file uploaded" });
    }

    const fileContent = req.file.buffer.toString("utf-8");
    // const fileContent = fs.readFileSync(req.file.path, "utf-8");
    const price_data = processCsvData(fileContent);
    await productModel.insertMany(price_data);
    res.status(201).json({
      price_data,
      status: "success",
      message: "CSV data processed successfully!",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
//Chat with advisor function
export const chatWithAdvisor = async (req, res) => {
  try {
    const userId = req.user._id;
    const api_key = process.env.API_KEY_AI;
    let { message } = req.body;
    //get icnomes data from database
    const getIncomes = await incomeModel.find({ userId });
    // Format incmoe lists as text
    const incomeList = getIncomes
      .map((income, i) => {
        return `${i + 1}. I get my income from ${income.incomeType} it is income type  - Its value ${income.incomeValue} EGP `;
      });
    //get expanses data from database
    const getExpenses = await expenseModel.find({ userId });
    // Format incmoe lists as text
    const expensesList = getExpenses
      .map((exp, i) => {
        return `${i + 1}. These are my expenses ${exp.expenseType} - Its value ${exp.expenseValue} EGP `;
      });
    //get goals for user from database
    const getGoals = await goalsModel.find({ userId });
    // Format goals lists as text
    const goalsList = getGoals
      .map((goal, i) => {
        return `${i + 1}. ${goal.name} - ${goal.amount} EGP to be saved in ${
          goal.timeline
        } months -my current saving ${
          goal.currentSavings
        }EGP - monthly i will save ${goal.monthlySavings}EGP`;
      })
      .join("\n");
    //get members for user from database
    const familyMembers = await memberModel.find({ userId });
    // Format goals lists as text
    const memberList =
      Array.isArray(familyMembers) && familyMembers.length > 0
        ? familyMembers
            .map((member, i) => {
              return `${i + 1}. ${member.memberName} - job: ${
                member.job
              }, Relation: ${member.roleInFamily}, his salary ${
                member.salary
              } EGP It is included in the total income`;
            })
            .join("\n")
        : "No family members registered.";
    // Get market products (limit to top 10 for performance)
    const products = await productModel.find().limit(10);
    // Format product prices as text
   const productPrices = products
      .map((prod, i) => {
        return `${i + 1}.  Product name: ${prod.product},Product price: ${prod.price} and price_change_percent: ${prod.price_change_percent}%`;
      })
      .join("\n");
      
    // Create financial context from the user data
    const financial_context = `
    Number of Incomes: ${getIncomes.length ?? 0} 
    Incomes: ${incomeList || "no incomes added"}
    Number of Expenses: ${getExpenses.length ?? 0} 
    Expenses: ${expensesList || "no expenses added"}
    Number of Goals: ${getGoals.length ?? 0}
    Goals:${goalsList || "No goals set"}
    Family Members: ${familyMembers.length ?? 0}
    Family Members:${memberList || "no members in this family, it is user only"}
    Market Prices:${productPrices || "you give us product price"}
    `;
    // Create messages list for the conversation
    const messages = [
      {
        role: "system",
        content: `You are a financial advisor who specializes in Egyptian family finances. Use this financial context: ${financial_context}`,
      },
      {
        role: "user",
        content: message,
      },
    ];
    // Get advice from DeepSeek
    const response = await getDeepseekAdvice(messages, api_key);
    await chatModel.create({
      userId,
      question: message,
      // response: response.advice,
      reasoning: response.reasoning,
    });
    // Return the response
    return res.status(200).json({
      status: "success",
      content: message,
      // response: response.advice,
      reasoning: response.reasoning,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
//delete chat
export const deleteChatWithAdvisor = async(req,res)=>{
 try {
    let { id } = req.params;
    const foundChat = await chatModel.findById(id);
    if (foundChat) {
      //delete chat by id
      await chatModel.findByIdAndDelete(foundChat._id);
      return res.status(200).json({ status:"success", message: "Your chat deleted successfully" });
    } else {
      return res.status(404).json({ status:"fail", message: "This expense not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

