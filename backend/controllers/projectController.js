const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage, uploadVideo } = require('../services/cloudinaryService');

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const rawProjects = await Project.find().sort({ createdAt: -1 });
  const projects = rawProjects.map((p) => {
    const obj = p.toObject();
    const cover = obj.coverImage || obj.thumbnail || '';
    const gallery = (obj.galleryImages && obj.galleryImages.length > 0) ? obj.galleryImages : (obj.images || []);
    return {
      ...obj,
      coverImage: cover,
      thumbnail: cover,
      galleryImages: gallery,
      images: gallery
    };
  });
  res.json({ success: true, message: 'Projects fetched successfully', data: projects });
});

// @desc    Create a project
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, category, featured, visibility, urlImages, location, area, completion, materials } = req.body;
  
  let coverImage = '';
  if (req.files && (req.files['coverImage'] || req.files['thumbnail'])) {
    const fileObj = (req.files['coverImage'] && req.files['coverImage'][0]) || (req.files['thumbnail'] && req.files['thumbnail'][0]);
    coverImage = await uploadImage(fileObj.path, 'prosper_design/projects/thumbnails');
  }
    
  let video = '';
  if (req.files && req.files['video']) {
    const localPath = req.files['video'][0].path;
    video = await uploadVideo(localPath, 'prosper_design/projects/videos');
  }
  
  let galleryImages = urlImages ? JSON.parse(urlImages) : [];
  if (req.files && (req.files['galleryImages'] || req.files['images'])) {
    const uploadedFiles = [...(req.files['galleryImages'] || []), ...(req.files['images'] || [])];
    for (const file of uploadedFiles) {
      const url = await uploadImage(file.path, 'prosper_design/projects/gallery');
      if (url) galleryImages.push(url);
    }
  }

  const newProject = new Project({
    title,
    description,
    category,
    thumbnail: coverImage,
    coverImage,
    video,
    images: galleryImages,
    galleryImages,
    location: location || '',
    area: area || '',
    completion: completion || '',
    materials: materials || '',
    featured: featured === 'true' || featured === true,
    visibility: visibility !== 'false' && visibility !== false
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

  const { title, description, category, featured, visibility, urlImages, galleryImagesJson, location, area, completion, materials } = req.body;
  
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (category !== undefined) project.category = category;
  if (location !== undefined) project.location = location;
  if (area !== undefined) project.area = area;
  if (completion !== undefined) project.completion = completion;
  if (materials !== undefined) project.materials = materials;

  project.featured = featured !== undefined ? (featured === 'true' || featured === true) : project.featured;
  project.visibility = visibility !== undefined ? (visibility === 'true' || visibility === true) : project.visibility;
  
  let currentGallery = project.galleryImages && project.galleryImages.length > 0 ? [...project.galleryImages] : [...(project.images || [])];

  if (galleryImagesJson) {
    currentGallery = JSON.parse(galleryImagesJson);
  } else if (urlImages) {
    currentGallery = JSON.parse(urlImages);
  }

  if (req.files && (req.files['coverImage'] || req.files['thumbnail'])) {
    const fileObj = (req.files['coverImage'] && req.files['coverImage'][0]) || (req.files['thumbnail'] && req.files['thumbnail'][0]);
    const secureUrl = await uploadImage(fileObj.path, 'prosper_design/projects/thumbnails');
    if (secureUrl) {
      project.coverImage = secureUrl;
      project.thumbnail = secureUrl;
    }
  }
  
  if (req.files && req.files['video']) {
    const localPath = req.files['video'][0].path;
    const secureUrl = await uploadVideo(localPath, 'prosper_design/projects/videos');
    if (secureUrl) project.video = secureUrl;
  }

  if (req.files && (req.files['galleryImages'] || req.files['images'])) {
    const uploadedFiles = [...(req.files['galleryImages'] || []), ...(req.files['images'] || [])];
    for (const file of uploadedFiles) {
      const url = await uploadImage(file.path, 'prosper_design/projects/gallery');
      if (url) currentGallery.push(url);
    }
  }

  project.galleryImages = currentGallery;
  project.images = currentGallery;

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

