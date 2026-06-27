const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'thumbnail' || file.fieldname === 'coverImage') {
      cb(null, 'uploads/thumbnails');
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/videos');
    } else {
      cb(null, 'uploads/thumbnails');
    }
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', getProjects);

router.post('/', protect, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'galleryImages', maxCount: 30 },
  { name: 'images', maxCount: 30 }
]), createProject);

router.put('/:id', protect, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'galleryImages', maxCount: 30 },
  { name: 'images', maxCount: 30 }
]), updateProject);

router.delete('/:id', protect, deleteProject);

module.exports = router;

