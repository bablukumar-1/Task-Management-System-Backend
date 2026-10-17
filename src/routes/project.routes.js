import  { Router } from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import { project } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { addMemberToProjects, createProject, deleteAllProject, deleteProject, deleteProjectMember, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject, updateProjectMembers } from "../controllers/project.controllers.js";

const router = Router()
router.route("/create/project").post(isLoggedIn,project(),validate,createProject)
router.route("/all/project").get(isLoggedIn,getProjects)
router.route("/update/project/:id").put(isLoggedIn,project(),validate,updateProject)
router.route("/project/:projectId").get(isLoggedIn,getProjectById)
router.route("/delete/project/:projectId").get(isLoggedIn,deleteProject)
router.route("delete/all/project").delete(isLoggedIn,deleteAllProject)
router.route("/project/:projectId/members").post(isLoggedIn, addMemberToProjects)
router.route("/project/:projectId/members").get(isLoggedIn, getProjectMembers)
router.route("/project/:projectId/members")
  .get(isLoggedIn, getProjectMembers)
  .post(isLoggedIn, addMemberToProjects)
  .put(isLoggedIn, updateProjectMembers)

router
  .route("/project/:projectId/members")
  .get(isLoggedIn, getProjectMembers)
  .post(isLoggedIn, addMemberToProjects);

router
  .route("/project/:projectId/members/:userId")
  .put(isLoggedIn, updateMemberRole)
  .delete(isLoggedIn, deleteProjectMember);
export default router