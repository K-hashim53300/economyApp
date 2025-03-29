import joi from "joi";
// signup validation schema
export const signUpSchema = {
  body: joi
    .object()
    .required()
    .keys({
      fullName: joi.string().min(4).max(40).required().messages({
        "string.base": "fullName must be string",
        "string.empty": "fullName can't be empty",
        "string.min": "fullName must be at least 4 characters ",
        "any.required": "fullName is required",
      }),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "string.base": "email must be string",
          "string.empty": "email can't be empty",
          "any.required": "email is required",
        }),
      password: joi
        .string()
        .min(8)
        .pattern(new RegExp("[A-Z]"))
        .pattern(new RegExp("[a-z]"))
        .pattern(new RegExp("[0-9]"))
        .pattern(new RegExp("[!@#$%&*]"))
        .required()
        .messages({
          "string.base": "password must be string",
          "string.empty": "password can't be empty",
          "string.min": "The password must be at least 8 characters ",
          "string.pattern.base":
            "The password must contain an uppercase letter, a lowercase letter, a number, and a special symbol(!@#$%&*)",
          "any.required": "password is required",
        }),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      address: joi.string().min(4).max(100).messages({
        "string.base": "The address must be string",
        "string.empty": "The address can't be empty",
        "string.min": "The address must be at least 4 characters ",
      }),
    }),
};
// login validation schema
export const logInSchema = {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required()
          .messages({
            "string.base": "email must be string",
            "string.empty": "email can't be empty",
            "any.required": "email is required",
          }),
        password: joi
          .string()
          .min(8)
          .pattern(new RegExp("[A-Z]"))
          .pattern(new RegExp("[a-z]"))
          .pattern(new RegExp("[0-9]"))
          .pattern(new RegExp("[!@#$%&*]"))
          .required()
          .messages({
            "string.base": "password must be string",
            "string.empty": "password can't be empty",
            "string.min": "The password must be at least 8 characters ",
            "string.pattern.base":
              "The password must contain an uppercase letter, a lowercase letter, a number, and a special symbol(!@#$%&*)",
            "any.required": "password is required",
          }),
      }),
  };
// send code validation schema
export const sendCodeSchema = {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required()
          .messages({
            "string.base": "email must be string",
            "string.empty": "email can't be empty",
            "any.required": "email is required",
          }),
      }),
  };
// forget Password validation schema
export const forgetPasswordSchema = {
    body: joi
      .object()
      .required()
      .keys({
        code:joi.string().length(6).pattern(/^\d{6}$/).required().messages({
            "string.empty":"The code is required",
            "string.length":"The code must be 6 digit only",
            "string.pattern.base":"The code must contain numbers only",
            "any.required":"The code is required"
        }),
        email: joi
          .string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required()
          .messages({
            "string.base": "email must be string",
            "string.empty": "email can't be empty",
            "any.required": "email is required",
          }),
        password: joi
          .string()
          .min(8)
          .pattern(new RegExp("[A-Z]"))
          .pattern(new RegExp("[a-z]"))
          .pattern(new RegExp("[0-9]"))
          .pattern(new RegExp("[!@#$%&*]"))
          .required()
          .messages({
            "string.base": "password must be string",
            "string.empty": "password can't be empty",
            "string.min": "The password must be at least 8 characters ",
            "string.pattern.base":
              "The password must contain an uppercase letter, a lowercase letter, a number, and a special symbol(!@#$%&*)",
            "any.required": "password is required",
          }),
      }),
  };
