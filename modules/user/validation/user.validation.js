import joi from "joi";

//update user validation schema 
export const updateUserSchema ={
    body:joi.object().required().keys({
          fullName: joi.string().min(4).max(40).messages({
                "string.base": "fullName must be string",
                "string.empty": "fullName can't be empty",
                "string.min": "fullName must be at least 4 characters ",
              }),
              email: joi
                .string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .messages({
                  "string.base": "email must be string",
                  "string.empty": "email can't be empty",
                }),
              address: joi.string().min(4).max(100).messages({
                "string.base": "The address must be string",
                "string.empty": "The address can't be empty",
                "string.min": "The address must be at least 4 characters ",
              }),
    })
}
//update user password validation schema
export const updatePasswordSchema = {
    body:joi.object().required().keys({
        currentPassword: joi
                .string()
                .min(8)
                .pattern(new RegExp("[A-Z]"))
                .pattern(new RegExp("[a-z]"))
                .pattern(new RegExp("[0-9]"))
                .pattern(new RegExp("[!@#$%&*]"))
                .required()
                .messages({
                  "string.base": "The current password must be string",
                  "string.empty": "The current password can't be empty",
                  "string.min": "The current password must be at least 8 characters ",
                  "string.pattern.base":
                    "The current password must contain an uppercase letter, a lowercase letter, a number, and a special symbol(!@#$%&*)",
                  "any.required": "The current password is required",
                }),
                newPassword: joi
                .string()
                .min(8)
                .pattern(new RegExp("[A-Z]"))
                .pattern(new RegExp("[a-z]"))
                .pattern(new RegExp("[0-9]"))
                .pattern(new RegExp("[!@#$%&*]"))
                .required()
                .messages({
                  "string.base": "The new password must be string",
                  "string.empty": "The new password can't be empty",
                  "string.min": "The new password must be at least 8 characters ",
                  "string.pattern.base":
                    "The new password must contain an uppercase letter, a lowercase letter, a number, and a special symbol(!@#$%&*)",
                  "any.required": "The new password is required",
                }),
                newCPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
}