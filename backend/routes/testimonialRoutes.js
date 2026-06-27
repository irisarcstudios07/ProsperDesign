const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

router.get('/',     getTestimonials);
router.post('/',    protect, createTestimonial);
router.put('/:id',  protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
