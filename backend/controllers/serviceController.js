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
  const { title, coverImageUrl, children } = req.body;
  
  let coverImage = coverImageUrl || '';
  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/services');
    if (secureUrl) {
      coverImage = secureUrl;
    }
  }

  // children is passed as JSON stringified array or as array directly
  let parsedChildren = [];
  if (children) {
    parsedChildren = typeof children === 'string' ? JSON.parse(children) : children;
  }

  const newService = new Service({
    title,
    coverImage,
    children: parsedChildren
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

  const { title, coverImageUrl, children } = req.body;
  
  service.title = title !== undefined ? title : service.title;
  
  if (coverImageUrl !== undefined) {
    service.coverImage = coverImageUrl;
  }
  
  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/services');
    if (secureUrl) {
      service.coverImage = secureUrl;
    }
  }

  if (children !== undefined) {
    service.children = typeof children === 'string' ? JSON.parse(children) : children;
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
