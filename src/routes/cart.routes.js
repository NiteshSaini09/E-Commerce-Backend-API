import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import * as controller from "../controllers/cart.controller.js";
import validate from "../middleware/validate.middleware.js";
import { addSchema } from "../validators/cart.validator.js";

const router=Router()

router.route("/add").post(verifyJWT,validate(addSchema),controller.add)

export default router