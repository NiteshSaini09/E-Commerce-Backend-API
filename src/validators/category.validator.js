import Joi from "joi";
export const createCategorySchema=Joi.object({
    name:Joi.string().trim().required().min(2).max(30),
    description:Joi.string().trim().max(500),
    image:Joi.string(),
    isActive:Joi.boolean()
})
export const updateCategorySchema=Joi.object({
    name:Joi.string().trim().min(2).max(30).pattern(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/),
    description:Joi.string().trim().max(500),
    image:Joi.string(),
    isActive:Joi.boolean()
})
