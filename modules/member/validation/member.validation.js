import joi from "joi";

export const addMemberSchema = joi.object({
    memberName:joi.string().min(4).required().messages({
        "string.base":"memberName must be string",
        "string.empty":"memberName can't be empty",
        "string.min":"membrName must be at least 4 characters",
        "any.required":"memberName is required"
    }),
    roleInFamily:joi.string().min(3).required().messages({
        "string.base":"roleInFamily must be string",
        "string.empty":"roleInFamily can't be empty",
        "string.min":"roleInFamily must be at least 3 characters",
        "any.required":"roleInFamily is required"
    }),
    gender:joi.string().valid("male","female").default("male").messages({
        "string.base":"Gender must be string",
        "string.empty":"Gender can't be empty",
        "any.only":"Gender must be male or female only"
    }),
    birthday:joi.date().less("now").messages({
        "date.base":"Birthday must be a valid date",
        "date.less":"Birthday must be in the past"
    }),
    image:joi.string().uri({scheme:["http","https"]}).messages({
        "string.base":"Image link must be string",
    }),
    job:joi.string().messages({
        "string.base":"Job must be string",
        "string.empty":"Job can't be empty",
    }),
    salary:joi.number().min(0).messages({
        "number.base":"Salary must be a number",
        "number.min":"Salary cannot be a negative number"
    })
});