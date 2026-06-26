const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', getServices);

router.post('/', protect, upload.array('multipleImages', 10), createService);

router.put('/:id', protect, upload.array('multipleImages', 10), updateService);

router.delete('/:id', protect, deleteService);

module.exports = router;
