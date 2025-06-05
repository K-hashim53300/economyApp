import { chatModel } from "../../../DB/models/chat.model.js";
import { expenseModel } from "../../../DB/models/expense.model.js";
import { incomeModel } from "../../../DB/models/income.model.js";
import { memberModel } from "../../../DB/models/member.model.js";
import { statisticsModel } from "../../../DB/models/statistics.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import {goalsModel} from '../../../DB/models/goals.model.js';
import bcrypt from "bcryptjs";
import { budgetModel } from "../../../DB/models/budget.model.js";

//update user (fullName,email,address)
export const updateUser = async(req,res)=>{
 try {
  const {fullName,email,address} = req.body;
  const {id} = req.params;
  const foundUser = await userModel.findById(id);
  if (foundUser) {
    const updatedUser = await userModel.findByIdAndUpdate(foundUser._id,{
      fullName,
      email,
      address
    },{new:true});
    res.status(200).json({status:"success", message:"User updated successfully",updatedUser:{fullName,email,address}});
  } else {
    res.status(404).json({status:"error", message:"This user not found"});
  }
 } catch (error) {
  res.status(500).json({error:error.message});
 }
}
//delete user and all his data 
export const deleteUser = async (req,res) => {
  try {
    const id = req.user._id;
    const foundedUser = await userModel.findById(id);
    if (foundedUser) {
      await userModel.findByIdAndDelete(foundedUser._id);
      await incomeModel.deleteMany({userId:foundedUser._id});
      await expenseModel.deleteMany({userId:foundedUser._id});
      await memberModel.deleteMany({userId:foundedUser._id});
      await statisticsModel.deleteMany({userId:foundedUser._id});
      await goalsModel.deleteMany({userId:foundedUser._id});
      await budgetModel.deleteMany({userId:foundedUser._id});
      await chatModel.deleteMany({userId:foundedUser._id});
      return res.status(200).json({status:"success", message:"The user and his data have been deleted"})
    } else {
      return res.status(404).json({status:"error",message:"This user not found"});
    }
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}

//get user profile
export const profile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("fullName email address");//get all this without id
    if (user) {
      res.status(200).json({ status:"success", message: "Done", user });
    } else {
      res.status(404).json({ status:"error", message: "No account go to register frist" });
    }
  } catch (error) {
    res.status(500).json({error:error.message });
  }
};

// update Password
export const updatePassword = async (req,res) => {
  try {
    let{currentPassword,newPassword,newCPassword}= req.body;
    if (newPassword == newCPassword) {
        const user = await userModel.findById(req.user._id);
        const matched = await bcrypt.compare(currentPassword,user.password);
        if (matched) {
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
            const hashedPass = await bcrypt.hash(newPassword,salt);
            const updated = await userModel.findByIdAndUpdate(user._id,{password:hashedPass},{new:true});
            res.status(200).json({status:"success",message:"Your password updated successfully",updated});
        } else {
            res.status(401).json({status:"error",message:"your current password in-correct"});
        }
    } else {
        res.status(401).json({ status:"error",message:"newPassword must match with newCPassword"});
    }
  } catch (error) {
    res.status(500).json({status:"error", error:error.message});
  }
}
// Get chat user with financial advisor
export const getUserChat = async(req,res) =>{
  try {
    const userId = req.user._id;
    const chat = await chatModel.find({userId});
    if (!chat) {
      return res.status(404).json({status:"fail" , message:"There are no conversations at all. Go ask for advice."})
    } else {
      return res.status(200).json({status:"success" ,message:"Data fetched Successfully" , chat});
    }
  } catch (error) {
    return res.status(500).json({status:"error", error:error.message});
  }
}