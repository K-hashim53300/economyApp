import joi from "joi";

//add expense validation schema
export const addExpenseSchema = {
    body:joi.object().required().keys({
        expenseType:joi.string().required().min(4).messages({
        "string.base":"The expense type must be string",
        "string.empty":"The expense type can't be empty",
        "string.min":"The expense type must be at least 4 characters",
        "any.required":"The expense type is required"
        }),
        expenseValue:joi.number().required().messages({
            "number.base":"The expense value must be number",
            "number.empty":"The expense value can't be empty",
            "any.required":"The expense value is required"
        }),
        description:joi.string().messages({
            "string.base":"The expense description must be string",
        })
    })
};