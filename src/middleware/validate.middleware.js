import Joi from "joi";
export const validate = (schema,target="body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    if(target=='query'){
      req.validQuery=value
    }else{
       req[target] = value;
    }
    next();
  };
};
export default validate;
