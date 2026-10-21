import { Router } from "express";
import { AvailabelUserRoles, UserRolesEnum } from "../utils/constant.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
import { createNote, deletedNote, getNoteById, getNotes, updateNote } from "../controllers/note.controllers.js";
const router = Router();
router
  .route("/:projectId")
  .get(validateProjectPermission(AvailabelUserRoles), getNotes)
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), createNote);

router
.route("/:projectId/n/:noteId")
.get(validateProjectPermission(AvailabelUserRoles),getNoteById)
.put(AvailabelUserRoles([UserRolesEnum.ADMIN]),updateNote)
.delete(AvailabelUserRoles([UserRolesEnum.ADMIN]),deletedNote)

export default router;
