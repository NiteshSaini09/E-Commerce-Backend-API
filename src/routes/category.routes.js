import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createCategorySchema } from "../validators/category.validator.js";
import * as controller from "../controllers/category.controller.js";
import  upload  from "../middleware/multer.middleware.js";
const router=Router()

router.route("/create").post(verifyJWT,verifyAdmin,upload.single('image'),validate(createCategorySchema),controller.createCategory)

export default router