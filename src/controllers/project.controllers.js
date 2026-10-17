import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AvailabelUserRoles } from "../utils/constant.js";
import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  let aboutProject;
  try {
    aboutProject = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Project with this name already exists", error);
    }
    throw error;
  }

  return res.status(201).json(new ApiResponse(201, aboutProject, "Project created successfuly"));
});

const getProjects = asyncHandler(async (req, res) => {
  const allProject = await Project.find({ createdBy: req.user.id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allProject,
        allProject.length ? "All project fetched" : "No project exist",
      ),
    );
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Valid project id is required in params");
  }

  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(new ApiResponse(200, project, "Fetched successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  let aboutProject;
  try {
    aboutProject = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { name, description },
      { returnDocument: "after", runValidators: true },
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Project with this name already exists", error);
    }
    throw error;
  }

  if (!aboutProject) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(new ApiResponse(200, aboutProject, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Valid project id is required in params");
  }

  const deletedProject = await Project.findOneAndDelete({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!deletedProject) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(new ApiResponse(200, deletedProject, "Project deleted successfully"));
});

const deleteAllProject = asyncHandler(async (req, res) => {
  const result = await Project.deleteMany({ createdBy: req.user._id });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No projects found to delete");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        "All projects deleted successfully",
      ),
    );
});

const addMemberToProjects = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Valid project id is required in params");
  }
  if (!email) {
    throw new ApiError(400, "Member email is required");
  }

  if (role && !AvailabelUserRoles.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${AvailabelUserRoles.join(", ")}`);
  }

  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }
  const alreadyMember = await ProjectMember.findOne({
    user: user._id,
    project: projectId,
  });
  if (alreadyMember) {
    throw new ApiError(409, "User is already a member of this project");
  }
  let member;
  try {
    member = await ProjectMember.create({
      user: user._id,
      project: projectId,
      role: role || UserRolesEnum.MEMBER,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "User is already a member of this project");
    }
    throw error;
  }
  return res.status(201).json(new ApiResponse(201, member, "Member added to project successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Valid project id is required in params");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only the owner or an existing member can see the member list
  const isOwner = project.createdBy.toString() === req.user._id.toString();
  const isMember = await ProjectMember.exists({
    project: projectId,
    user: req.user._id,
  });

  if (!isOwner && !isMember) {
    throw new ApiError(403, "You do not have access to this project");
  }

  const members = await ProjectMember.find({ project: projectId }).populate(
    "user",
    "username fullname email avatar",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalMembers: members.length,
        members,
      },
      members.length ? "Project members fetched successfully" : "No members in this project",
    ),
  );
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Valid project id is required in params");
  }

  if (!email || !role) {
    throw new ApiError(400, "Member email and role are required");
  }

  const assignableRoles = [UserRolesEnum.PROJECT_ADMIN, UserRolesEnum.MEMBER];
  if (!assignableRoles.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${assignableRoles.join(", ")}`);
  }

  // Only the project owner can change member roles
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  const updatedMember = await ProjectMember.findOneAndUpdate(
    { project: projectId, user: user._id },
    { role },
    { returnDocument: "after", runValidators: true },
  ).populate("user", "username fullname email avatar");

  if (!updatedMember) {
    throw new ApiError(404, "This user is not a member of the project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMember, "Member role updated successfully"));
});

const deleteProjectMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Valid project id and user id are required in params");
  }

  // Only the project owner can remove members
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const removedMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: userId,
  });
  if (!removedMember) {
    throw new ApiError(404, "This user is not a member of the project");
  }

  return res.status(200).json(new ApiResponse(200, removedMember, "Member removed successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Valid project id and user id are required in params");
  }

  const assignableRoles = [UserRolesEnum.PROJECT_ADMIN, UserRolesEnum.MEMBER];
  if (!role || !assignableRoles.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${assignableRoles.join(", ")}`);
  }

  // Only the project owner can change member roles
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const updatedMember = await ProjectMember.findOneAndUpdate(
    { project: projectId, user: userId },
    { role },
    { returnDocument: "after", runValidators: true },
  ).populate("user", "username fullname email avatar");

  if (!updatedMember) {
    throw new ApiError(404, "This user is not a member of the project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMember, "Member role updated successfully"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProject,
  addMemberToProjects,
  getProjectMembers,
  updateProjectMembers,
  deleteProjectMember,
  updateMemberRole,
};
