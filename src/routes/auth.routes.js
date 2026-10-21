import  { Router } from "express";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendVerificationEmail, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userLoginValidator, userRegistrationValidator } from "../validators/index.js";
import {isLoggedIn} from "../middlewares/auth.middleware.js";




const router = Router()
// factory pattern

router.route("/register").post(userRegistrationValidator(),validate,registerUser)
router.route("/verify/:token").get(verifyEmail)
router.route("/resend-verify-email").post(resendVerificationEmail)
router.route("/login").post(userLoginValidator(),validate,loginUser)
router.route("/logout").get(isLoggedIn,logoutUser)
router.route("/forgot-password").post(isLoggedIn,forgotPasswordRequest)
router.route("/reset-password/:token").post(userLoginValidator(),validate,changeCurrentPassword)
router.route("/refresh-token").get(refreshAccessToken)
router.route("/profile").get(isLoggedIn,getCurrentUser)
export default router