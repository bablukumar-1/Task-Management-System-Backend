import  { Router } from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { project } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProject } from "../controllers/project.controllers.js";

const router = Router()
router.route("/create-project").post(isLoggedIn,project(),validate,createProject)

export default router