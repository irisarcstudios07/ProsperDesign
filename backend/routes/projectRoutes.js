const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');

// Multer Local Disk Storage configuration for temporary file staging
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails');
    } else {
      cb(null, 'uploads/videos');
    }
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/projects
// @desc    Create a project
router.post('/', protect, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, featured, visibility } = req.body;
    
    // Upload thumbnail to Cloudinary
    let thumbnail = '';
    if (req.files && req.files['thumbnail']) {
      const localPath = req.files['thumbnail'][0].path;
      const uploadRes = await uploadToCloudinary(localPath, 'prosper_design/projects/thumbnails');
      thumbnail = uploadRes ? uploadRes.secure_url : '';
    }
      
    // Upload video to Cloudinary
    let video = '';
    if (req.files && req.files['video']) {
      const localPath = req.files['video'][0].path;
      const uploadRes = await uploadToCloudinary(localPath, 'prosper_design/projects/videos');
      video = uploadRes ? uploadRes.secure_url : '';
    }

    const newProject = new Project({
      title,
      description,
      category,
      thumbnail,
      video,
      featured: featured === 'true',
      visibility: visibility !== 'false'
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
router.put('/:id', protect, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, category, featured, visibility } = req.body;
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.featured = featured !== undefined ? featured === 'true' : project.featured;
    project.visibility = visibility !== undefined ? visibility === 'true' : project.visibility;

    if (req.files && req.files['thumbnail']) {
      const localPath = req.files['thumbnail'][0].path;
      const uploadRes = await uploadToCloudinary(localPath, 'prosper_design/projects/thumbnails');
      if (uploadRes) {
        project.thumbnail = uploadRes.secure_url;
      }
    }
    
    if (req.files && req.files['video']) {
      const localPath = req.files['video'][0].path;
      const uploadRes = await uploadToCloudinary(localPath, 'prosper_design/projects/videos');
      if (uploadRes) {
        project.video = uploadRes.secure_url;
      }
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
