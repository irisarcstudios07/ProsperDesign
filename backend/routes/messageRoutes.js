const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage
} = require('../controllers/messageController');

// @route  POST /api/messages
// @desc   Submit a contact form or consultation booking (Public)
router.post('/', createMessage);

// @route  GET /api/messages
// @desc   Get all messages (Admin)
router.get('/', protect, getMessages);

// @route  PUT /api/messages/:id/read
// @desc   Mark message as read (Admin)
router.put('/:id/read', protect, markMessageRead);

// @route  DELETE /api/messages/:id
// @desc   Delete a message (Admin)
router.delete('/:id', protect, deleteMessage);

module.exports = router;

