import Joi from "joi";

export const shippingAddressSchema=Joi.object({
    fullname:Joi.string().trim().required(),
    phone:Joi.string().pattern(/^[6-9]\d{9}$/).message('Please enter a valid 10-digit Indian mobile number.'),
    address:Joi.string().required().trim(),
    city:Joi.string().required().trim(),
    state:Joi.string().required().trim(),
    postalcode:Joi.string()
    .length(6)
    .pattern(/^[1-9][0-9]{5}$/)
    .required()
    .messages({
      'string.length': 'PIN code must be exactly 6 digits long.',
      'string.pattern.base': 'Invalid PIN code. It cannot start with 0 and must only contain numbers.',
      'any.required': 'PIN code is a required field.'
    }),
    country:Joi.string().default("India")
})