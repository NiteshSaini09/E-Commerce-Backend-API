import { Router } from "express";
import * as userController from '../controllers/user.controller.js'
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";
import verifyJWT from "../middleware/auth.middleware.js";
import  verifyAdmin  from "../middleware/admin.middleware.js";
const router=Router()

router.route('/register').post(validate(registerSchema),userController.register)
router.route('/login').post(validate(loginSchema),userController.login)
router.route('/profile').get(verifyJWT,userController.profile)
router.route('/log-out').get(verifyJWT,userController.logOut)
router.route('/refresh-access-token').get(userController.refreshAccessToken)
router.route('/admin-pannel').get(verifyJWT,verifyAdmin,userController.adminPannel)
export default router