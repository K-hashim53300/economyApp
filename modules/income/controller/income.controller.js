import {incomeModel} from '../../../DB/models/income.model.js';

//add income function
export const addIncome = async(req,res)=>{
  try {
    let {incomeType,incomeValue} = req.body;
    const userId = req.user._id; //get user._id from authMiddleware
    if (!incomeType || !incomeValue) {
        res.status(404).json({ status:"error",message:"Income type and value are required"});
    } else {
        const newIncome = new incomeModel({userId,incomeType,incomeValue});//save in model
        const savedIncome = await newIncome.save(); //save in  database
        res.status(201).json({ status:"success",message:"Your income added successfully",savedIncome});
    }
  } catch (error) {
    res.status(500).json({error:error.message})
  }

}; 
//update income function
export const updateIncome = async (req,res) => {
    try {
        let{id}=req.params;
        //found income
        const foundIncome = await incomeModel.findById(id); 
        if (foundIncome) {
            //update income by id
            const updatedIncome = await incomeModel.findByIdAndUpdate(foundIncome._id,{$set:req.body},{new:true});
            res.status(200).json({ status:"success",message:"Income updated successfully",updatedIncome});
        } else {
            res.status(404).json({ status:"error",message:"This income not found"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};
//delete income function
export const deleteIncome = async (req,res) => {
    try {
        let{id}=req.params;
        const foundIncome = await incomeModel.findById(id);
        if (foundIncome) {
            //delete income by id
            await incomeModel.findByIdAndDelete(foundIncome._id);
            res.status(200).json({ status:"success",message:"Income deleted successfully"});
        } else {
            res.status(404).json({ status:"error",message:"This income not found"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};
//get all incomes based on userId
export const getAllIncomes = async (req,res) => {
    try {
        const userId = req.user._id;
        if (userId) {
            //get all incomes
            const incomes = await incomeModel.find({userId});
            if (!incomes.length) {
                res.status(404).json({ status:"error",message:"This user doesn't have any incomes "})
            } else {
                res.status(200).json({ status:"success",message:"Done",incomes});
            }
        } else {
            res.status(403).json({ status:"error",message:"invalid userId"})
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}