import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import * as controller from "../controllers/admin.controller.js";
const router=Router()

router.route("/orders").get(verifyJWT,verifyAdmin,controller.getOrders)
router.route("/orders/:orderId/state").patch(verifyJWT,verifyAdmin,controller.updateOrderStatus)
router.route("/reviews").get(verifyJWT,verifyAdmin,controller.getReviews)
router.route("/reviews/:id").delete(verifyJWT,verifyAdmin,controller.deleteReview)

export default router