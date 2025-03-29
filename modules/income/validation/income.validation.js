import joi from "joi";

//add income validation schema
export const addIncomeSchema = {
    body:joi.object().required().keys({
        incomeType:joi.string().required().min(4).messages({
        "string.base":"The income type must be string",
        "string.empty":"The income type can't be empty",
        "string.min":"The income type must be at least 4 characters",
        "any.required":"The income type is required"
        }),
        incomeValue:joi.number().required().messages({
            "number.base":"The income value must be number",
            "number.empty":"The income value can't be empty",
            "any.required":"The income value is required"
        })
    })
};