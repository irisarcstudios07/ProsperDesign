const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage, uploadVideo } = require('../services/cloudinaryService');

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Projects fetched successfully', data: projects });
});

// @desc    Create a project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, category, featured, visibility, urlImages } = req.body;
  
  let thumbnail = '';
  if (req.files && req.files['thumbnail']) {
    const localPath = req.files['thumbnail'][0].path;
    thumbnail = await uploadImage(localPath, 'prosper_design/projects/thumbnails');
  }
    
  let video = '';
  if (req.files && req.files['video']) {
    const localPath = req.files['video'][0].path;
    video = await uploadVideo(localPath, 'prosper_design/projects/videos');
  }
  
  const images = urlImages ? JSON.parse(urlImages) : [];

  const newProject = new Project({
    title,
    description,
    category,
    thumbnail,
    video,
    images,
    featured: featured === 'true',
    visibility: visibility !== 'false'
  });

  const savedProject = await newProject.save();
  res.status(201).json({ success: true, message: 'Project created successfully', data: savedProject });
});

// @desc    Update a project
// @route   PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const { title, description, category, featured, visibility, urlImages } = req.body;
  
  project.title = title || project.title;
  project.description = description || project.description;
  project.category = category || project.category;
  project.featured = featured !== undefined ? featured === 'true' : project.featured;
  project.visibility = visibility !== undefined ? visibility === 'true' : project.visibility;
  
  if (urlImages) {
    project.images = JSON.parse(urlImages);
  }

  if (req.files && req.files['thumbnail']) {
    const localPath = req.files['thumbnail'][0].path;
    const secureUrl = await uploadImage(localPath, 'prosper_design/projects/thumbnails');
    if (secureUrl) project.thumbnail = secureUrl;
  }
  
  if (req.files && req.files['video']) {
    const localPath = req.files['video'][0].path;
    const secureUrl = await uploadVideo(localPath, 'prosper_design/projects/videos');
    if (secureUrl) project.video = secureUrl;
  }

  const updatedProject = await project.save();
  res.json({ success: true, message: 'Project updated successfully', data: updatedProject });
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  await project.deleteOne();
  res.json({ success: true, message: 'Project removed', data: null });
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
