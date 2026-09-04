import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createCategorySchema,updateCategorySchema } from "../validators/category.validator.js";
import * as controller from "../controllers/category.controller.js";
import  upload  from "../middleware/multer.middleware.js";
const router=Router()

router.route("/create").post(verifyJWT,verifyAdmin,validate(createCategorySchema),upload.single('image'),controller.createCategory)
router.route("/").get(controller.getAllCategories)
router.route("/:id").get(controller.getCategoryById)
router.route("/:id").delete(verifyJWT,verifyAdmin,controller.deleteCategory)
router.route("/:id").patch(validate(updateCategorySchema),upload.single('image'),controller.updateCategory)

export default router