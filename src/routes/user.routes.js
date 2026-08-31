import { Router } from "express";
import * as userController from '../controllers/user.controller.js'
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";
const router=Router()

router.route('/register').post(validate(registerSchema),userController.register)
router.route('/login').post(validate(loginSchema),userController.login)
export default router