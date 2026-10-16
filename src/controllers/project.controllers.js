import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

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

const getProjects = asyncHandler(async (req, res) => {});

const getProjectById = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const updateProject = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});
const deleteProject = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});
const addMemberToProjects = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});
const getProjectMembers = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const deleteProjectMember = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMemberToProjects,
  getProjectMembers,
  updateProjectMembers,
  deleteProjectMember,
  updateMemberRole,
};
