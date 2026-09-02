import Joi from "joi";
export const addProductSchema = Joi.object({
  name: Joi.string().required().min(2).trim(),
  description: Joi.string().trim(),
  brand: Joi.string().required().min(2),
  price: Joi.number().required().min(0),
  discount: Joi.number().min(0).max(100).default(0),
  stock: Joi.number().default(0).min(0),
  category: Joi.string()
    .valid(
      "cloth",
      "item",
      "shoes",
      "mobile",
      "laptop",
      "electronics",
      "beauty",
      "furniture",
    )
    .default("item"),
  // productImages: Joi.array().items(Joi.string().trim()).min(1).max(5),
  status: Joi.string().valid("active", "inactive").default("active"),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).trim().optional(),
  description: Joi.string().trim().optional(),
  brand: Joi.string().min(2).optional(),
  price: Joi.number().min(1).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  stock: Joi.number().optional(),
  category: Joi.string()
    .valid(
      "cloth",
      "item",
      "shoes",
      "mobile",
      "laptop",
      "electronics",
      "beauty",
      "furniture",
    ).default("item").optional(),
  productimages: Joi.array().items(Joi.string().trim()).min(1).max(5),
  status: Joi.string().valid("active", "inactive").default("active")
}).min(1);
