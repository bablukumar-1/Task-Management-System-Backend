

const getProjects = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});

const getProjectById = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});

const createProject = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});

const updateProject = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});
const deleteProject = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});
const addMemberToProjects = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});
const getProjectMembers = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});

const updateProjectMembers = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});

const deleteProjectMember = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});


const updateMemberRole = asyncHandler(async (req,res)=>{
   const{email,username,password,role} = req.body;
//    validation


});


export {getProjects,getProjectById,createProject,updateProject,deleteProject,addMemberToProjects,getProjectMembers,updateProjectMembers,deleteProjectMember,updateMemberRole}