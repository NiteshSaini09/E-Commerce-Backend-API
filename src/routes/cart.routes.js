import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import * as controller from "../controllers/cart.controller.js";
import validate from "../middleware/validate.middleware.js";
import { addSchema } from "../validators/cart.validator.js";

const router=Router()

router.route("/").post(verifyJWT,validate(addSchema),controller.add)
router.route("/").get(verifyJWT,controller.getCart)
router.route("/update-uantity").post(verifyJWT,controller.updateQantity)
router.route("/remove").delete(verifyJWT,controller.removeProduct)
router.route("/clear").delete(verifyJWT,controller.clearCart)

export default router