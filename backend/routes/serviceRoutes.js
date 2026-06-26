const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  getServices,
  createService,
  updateService,
  deleteService,
  updateChildService,
  addGalleryImages,
  deleteGalleryImage,
  reorderGallery,
  updateGalleryImage
} = require('../controllers/serviceController');

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// Parent CRUD
router.get('/', getServices);
router.post('/', protect, upload.single('coverImage'), createService);
router.put('/:id', protect, upload.single('coverImage'), updateService);
router.delete('/:id', protect, deleteService);

// Child metadata update (title, description, features, coverImage)
router.put('/:id/children/:childIdx', protect, upload.single('coverImage'), updateChildService);

// Gallery operations
router.post('/:id/children/:childIdx/gallery', protect, upload.array('gallery', 20), addGalleryImages);
router.put('/:id/children/:childIdx/gallery/:imgIdx', protect, updateGalleryImage);
router.delete('/:id/children/:childIdx/gallery/:imgIdx', protect, deleteGalleryImage);
router.put('/:id/children/:childIdx/gallery/reorder', protect, reorderGallery);

module.exports = router;
