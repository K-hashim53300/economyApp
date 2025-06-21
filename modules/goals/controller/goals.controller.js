import { goalsModel } from '../../../DB/models/goals.model.js';
import { statisticsModel } from '../../../DB/models/statistics.model.js';

//add goal function
export const addGoal = async(req,res)=>{
  try {
    let {name,amount,timeline} = req.body;
    const userId = req.user._id; //get user._id from authMiddleware
    // Fetch user statistics to get the balance
    const stats = await statisticsModel.findOne({ userId });
    const currentBalance = stats?.balance ?? 0;
    const monthlySavings = +((amount - currentBalance) / timeline).toFixed(2);
    if (!name || !amount || !timeline) {
        res.status(404).json({ status:"fail",message:"Goal name,amount and timeline are required"});
    } else {
     await goalsModel.create({
      userId,
      name,
      amount,
      timeline,
      currentSavings: currentBalance, // balance
      monthlySavings,
    });
        res.status(201).json({ status:"success",message:"Your goal added successfully"});
    }
  } catch (error) {
    res.status(500).json({error:error.message})
  }

}; 
// update goale function
export const updateGoal = async (req,res) => {
    try {
        let{id}=req.params;
        //found goal
        const foundGoal = await goalsModel.findById(id); 
        if (foundGoal) {
            //update Goal by id
            const updatedGoal = await goalsModel.findByIdAndUpdate(foundGoal._id,{$set:req.body},{new:true});
            res.status(200).json({ status:"success",message:"Your goal updated successfully",updatedGoal});
        } else {
            res.status(404).json({ status:"fail",message:"This goal not found"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};
//delete goal function
export const deleteGoal = async (req,res) => {
    try {
        let{id}=req.params;
        const foundGoal = await goalsModel.findById(id);
        if (foundGoal) {
            //delete goal by id
            await goalsModel.findByIdAndDelete(foundGoal._id);
            res.status(200).json({ status:"success",message:"Your goal deleted successfully"});
        } else {
            res.status(404).json({ status:"fail",message:"This goal not found"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};
//get all goals based on userId
export const getAllGoals = async (req,res) => {
    try {
        const userId = req.user._id;
        if (userId) {
            //get all goals
            const goals = await goalsModel.find({userId});
            if (!goals.length) {
                res.status(404).json({ status:"fail",message:"This user doesn't have any goals "})
            } else {
                res.status(200).json({ status:"success",message:"Done",goals});
            }
        } else {
            res.status(403).json({ status:"fail",message:"invalid userId"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}