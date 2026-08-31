import Joi from "joi";
export const registerSchema=Joi.object({
    name:Joi.string().required().min(2).max(30),
    email:Joi.string().email().required(),
    password:Joi.string().required().min(6)
})
export const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})