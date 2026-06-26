const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage } = require('../services/cloudinaryService');

// @desc    Get all services
// @route   GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Services fetched successfully', data: services });
});

// @desc    Create a service
// @route   POST /api/services
const createService = asyncHandler(async (req, res) => {
  const { title, description, category, urlImages } = req.body;
  
  // Combine URL list + uploaded files
  const urlList = urlImages ? JSON.parse(urlImages) : [];
  
  const uploadedImages = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const secureUrl = await uploadImage(file.path, 'prosper_design/services');
      if (secureUrl) {
        uploadedImages.push(secureUrl);
      }
    }
  }
  
  const multipleImages = [...urlList, ...uploadedImages];

  const newService = new Service({
    title,
    description,
    category,
    multipleImages
  });

  const savedService = await newService.save();
  res.status(201).json({ success: true, message: 'Service created successfully', data: savedService });
});

// @desc    Update a service
// @route   PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  const { title, description, category } = req.body;
  
  service.title = title || service.title;
  service.description = description || service.description;
  service.category = category || service.category;

  if (req.files && req.files.length > 0) {
    const uploadedImages = [];
    for (const file of req.files) {
      const secureUrl = await uploadImage(file.path, 'prosper_design/services');
      if (secureUrl) {
        uploadedImages.push(secureUrl);
      }
    }
    service.multipleImages = [...service.multipleImages, ...uploadedImages];
  }

  const updatedService = await service.save();
  res.json({ success: true, message: 'Service updated successfully', data: updatedService });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  await service.deleteOne();
  res.json({ success: true, message: 'Service removed', data: null });
});

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
