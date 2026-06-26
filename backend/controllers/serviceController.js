const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage } = require('../services/cloudinaryService');

// @desc    Get all services
// @route   GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Services fetched successfully', data: services });
});

// @desc    Create a service (parent)
// @route   POST /api/services
const createService = asyncHandler(async (req, res) => {
  const { title, coverImageUrl, children } = req.body;
  let coverImage = coverImageUrl || '';
  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/services');
    if (secureUrl) coverImage = secureUrl;
  }
  let parsedChildren = [];
  if (children) parsedChildren = typeof children === 'string' ? JSON.parse(children) : children;
  const newService = new Service({ title, coverImage, children: parsedChildren });
  const savedService = await newService.save();
  res.status(201).json({ success: true, message: 'Service created successfully', data: savedService });
});

// @desc    Update a service (parent)
// @route   PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const { title, coverImageUrl, children } = req.body;
  if (title !== undefined) service.title = title;
  if (coverImageUrl !== undefined) service.coverImage = coverImageUrl;
  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/services');
    if (secureUrl) service.coverImage = secureUrl;
  }
  if (children !== undefined) service.children = typeof children === 'string' ? JSON.parse(children) : children;
  const updated = await service.save();
  res.json({ success: true, message: 'Service updated successfully', data: updated });
});

// @desc    Delete a service (parent)
// @route   DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  await service.deleteOne();
  res.json({ success: true, message: 'Service removed', data: null });
});

// @desc    Update child service metadata
// @route   PUT /api/services/:id/children/:childIdx
const updateChildService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const idx = parseInt(req.params.childIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= service.children.length)
    return res.status(400).json({ success: false, message: 'Invalid child index' });
  const child = service.children[idx];
  const { title, description, features, coverImageUrl } = req.body;
  if (title !== undefined) child.title = title;
  if (description !== undefined) child.description = description;
  if (features !== undefined) child.features = typeof features === 'string' ? JSON.parse(features) : features;
  if (coverImageUrl !== undefined) child.coverImage = coverImageUrl;
  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/services/children');
    if (secureUrl) child.coverImage = secureUrl;
  }

  // Cover fallback logic
  if (!child.coverImage && child.gallery && child.gallery.length > 0) {
    child.coverImage = child.gallery[0].url;
  }

  service.children[idx] = child;

  // Parent cover fallback logic
  if (!service.coverImage && service.children && service.children.length > 0) {
    service.coverImage = service.children[0].coverImage;
  }

  service.markModified('children');
  const saved = await service.save();
  res.json({ success: true, message: 'Child updated', data: saved });
});

// @desc    Add gallery images to a child
// @route   POST /api/services/:id/children/:childIdx/gallery
const addGalleryImages = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const idx = parseInt(req.params.childIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= service.children.length)
    return res.status(400).json({ success: false, message: 'Invalid child index' });
  const child = service.children[idx];
  const files = req.files || (req.file ? [req.file] : []);
  const uploaded = [];
  for (const file of files) {
    const url = await uploadImage(file.path, 'prosper_design/services/gallery');
    if (url) uploaded.push({ url, caption: file.originalname.replace(/\.[^.]+$/, ''), description: '' });
  }
  child.gallery = [...(child.gallery || []), ...uploaded];

  // Cover fallback logic
  if (!child.coverImage && child.gallery.length > 0) {
    child.coverImage = child.gallery[0].url;
  }

  service.children[idx] = child;

  // Parent cover fallback logic
  if (!service.coverImage && service.children && service.children.length > 0) {
    service.coverImage = service.children[0].coverImage;
  }

  service.markModified('children');
  const saved = await service.save();
  res.json({ success: true, message: `${uploaded.length} image(s) added`, data: saved });
});

// @desc    Delete a gallery image from a child
// @route   DELETE /api/services/:id/children/:childIdx/gallery/:imgIdx
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const idx = parseInt(req.params.childIdx, 10);
  const imgIdx = parseInt(req.params.imgIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= service.children.length)
    return res.status(400).json({ success: false, message: 'Invalid child index' });
  const child = service.children[idx];
  if (!child.gallery || isNaN(imgIdx) || imgIdx < 0 || imgIdx >= child.gallery.length)
    return res.status(400).json({ success: false, message: 'Invalid image index' });
  child.gallery.splice(imgIdx, 1);
  service.children[idx] = child;
  service.markModified('children');
  const saved = await service.save();
  res.json({ success: true, message: 'Gallery image deleted', data: saved });
});

// @desc    Reorder gallery images for a child
// @route   PUT /api/services/:id/children/:childIdx/gallery/reorder
const reorderGallery = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const idx = parseInt(req.params.childIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= service.children.length)
    return res.status(400).json({ success: false, message: 'Invalid child index' });
  const { order } = req.body;
  if (!Array.isArray(order))
    return res.status(400).json({ success: false, message: 'order must be an array of indices' });
  const child = service.children[idx];
  const gallery = child.gallery || [];
  child.gallery = order.map((i) => gallery[i]).filter(Boolean);
  service.children[idx] = child;
  service.markModified('children');
  const saved = await service.save();
  res.json({ success: true, message: 'Gallery reordered', data: saved });
});

// @desc    Update a gallery image details (caption & description)
// @route   PUT /api/services/:id/children/:childIdx/gallery/:imgIdx
const updateGalleryImage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const idx = parseInt(req.params.childIdx, 10);
  const imgIdx = parseInt(req.params.imgIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= service.children.length)
    return res.status(400).json({ success: false, message: 'Invalid child index' });
  const child = service.children[idx];
  if (!child.gallery || isNaN(imgIdx) || imgIdx < 0 || imgIdx >= child.gallery.length)
    return res.status(400).json({ success: false, message: 'Invalid image index' });
  
  const { caption, description } = req.body;
  if (caption !== undefined) child.gallery[imgIdx].caption = caption;
  if (description !== undefined) child.gallery[imgIdx].description = description;

  // Cover fallback if cover image is empty
  if (!child.coverImage && child.gallery.length > 0) {
    child.coverImage = child.gallery[0].url;
  }

  service.children[idx] = child;
  service.markModified('children');
  const saved = await service.save();
  res.json({ success: true, message: 'Gallery image updated', data: saved });
});

module.exports = {
  getServices, createService, updateService, deleteService,
  updateChildService, addGalleryImages, deleteGalleryImage, reorderGallery,
  updateGalleryImage
};
