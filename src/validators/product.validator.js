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

export const querySchema=Joi.object({
  search:Joi.string().trim(),
  minPrice:Joi.number().min(0),
  maxPrice:Joi.number().min(0),
  limit:Joi.number().min(1).max(20).default(5),
  page:Joi.number().min(1).default(1),
  // sortBy:Joi.string().valid("price").default("price"),
  order:Joi.string().valid("price_asc","price_desc","newest","oldest"),
   category: Joi.string().custom((value, helpers) => {
    if (!mongoose.isValidObjectId(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }).messages({
    "any.invalid": "Invalid category ID",
  }),
})