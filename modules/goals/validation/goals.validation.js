import joi from "joi";

//add goal validation schema
export const addGoalSchema = {
    body:joi.object().required().keys({
        name:joi.string().required().min(4).messages({
            "string.base":"The goal name must be string",
            "string.empty":"The goal name can't be empty",
            "string.min":"The goal name must be at least 4 characters",
            "any.required":"The goal name is required"
            }),
        amount:joi.number().required().messages({
            "number.base":"The goal amount must be number",
            "number.empty":"The goal amount can't be empty",
            "any.required":"The goal amount is required"
        }),
        currentSavings:joi.number().messages({
            "number.base":"The current Savings must be number",
            "number.empty":"The current Savings can't be empty",
        }),
        monthlySavings:joi.number().required().messages({
            "number.base":"The monthly Savings must be number",
            "number.empty":"The monthly Savings can't be empty",
            "any.required":"The monthly Savings is required"
        }),
        timeline:joi.number().required().messages({
            "number.base":"The timeline for goal must be number",
            "number.empty":"The timeline for goal can't be empty",
            "any.required":"The timeline for goal is required"
        }),
    })
};