import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import * as controller from "../controllers/order.controller.js";
import validate from "../middleware/validate.middleware.js";
import { shippingAddressSchema } from "../validators/order.validator.js";
const router =Router()

router.route('/').post(verifyJWT,validate(shippingAddressSchema),controller.makeOrder)



export default router