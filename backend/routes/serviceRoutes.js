const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/services
// @desc    Create a service
router.post('/', protect, upload.array('multipleImages', 10), async (req, res) => {
  try {
    const { title, description, category, urlImages } = req.body;
    
    // Combine URL list + uploaded files
    const urlList = urlImages ? JSON.parse(urlImages) : [];
    const uploadedImages = req.files ? req.files.map(file => file.path) : [];
    const multipleImages = [...urlList, ...uploadedImages];

    const newService = new Service({
      title,
      description,
      category,
      multipleImages
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
router.put('/:id', protect, upload.array('multipleImages', 10), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const { title, description, category } = req.body;
    
    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;

    if (req.files && req.files.length > 0) {
      service.multipleImages = [...service.multipleImages, ...req.files.map(file => file.path)];
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
