import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import * as controller from "../controllers/order.controller.js";
import validate from "../middleware/validate.middleware.js";
import { shippingAddressSchema } from "../validators/order.validator.js";
const router =Router()

router.route('/').post(verifyJWT,validate(shippingAddressSchema),controller.makeOrder)
router.route('/my-orders').get(verifyJWT,controller.myOrders)
router.route('/my-orders/:orderId').get(verifyJWT,controller.myOrderById)
router.route('/my-orders/:orderId/cancle').patch(verifyJWT,controller.cancelOrder)


export default router