import  { Router } from "express";
import { registerUser, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";



const router = Router()
// factory pattern
router.route("/register").post(userRegistrationValidator(),validate,registerUser)
router.route("/verify/:token").get(verifyEmail)
export default router