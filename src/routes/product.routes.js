import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import * as productController from "../controllers/product.controller.js";
import validate from "../middleware/validate.middleware.js";
import { addProductSchema, updateProductSchema } from "../validators/product.validator.js";

const router=Router()
router.route("/").post(verifyJWT,verifyAdmin,validate(addProductSchema),productController.create)
router.route('/').get(productController.getAll)
router.route('/:id').get(productController.getProduct)
router.route('/:id').patch(verifyJWT,verifyAdmin,validate(updateProductSchema),productController.updateProduct)
router.route('/:id').delete(verifyJWT,verifyAdmin,productController.deleteProduct)

export default router