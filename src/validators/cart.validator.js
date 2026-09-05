import Joi from "joi";
import mongoose from "mongoose";
export const addSchema=Joi.object({
    productId:Joi.string().required().trim().custom((value, helpers) => {
    if (!mongoose.isValidObjectId(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }).messages({
    "any.invalid": "Invalid Product ID",
  }),
  quantity:Joi.number().min(1).required()
})