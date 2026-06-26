const Message = require('../models/Message');
const asyncHandler = require('../middleware/asyncHandler');
const { sendEmailNotification } = require('../services/emailService');

// @desc    Submit a contact form or consultation booking (Public)
// @route   POST /api/messages
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, service, subject, message } = req.body;

  console.log(`📥 New message from: ${name} | ${email} | service: ${service || 'N/A'}`);

  // Save to MongoDB first
  const newMessage = new Message({ name, email, phone, service, subject, message });
  await newMessage.save();
  console.log(`✅ Message saved to MongoDB: ${newMessage._id}`);

  // Respond immediately to frontend
  res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });

  // Send email in background (after response is sent)
  sendEmailNotification(name, email, phone, subject, service, message);
});

// @desc    Get all messages (Admin)
// @route   GET /api/messages
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Messages fetched successfully', data: messages });
});

// @desc    Mark message as read (Admin)
// @route   PUT /api/messages/:id/read
const markMessageRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  message.readStatus = true;
  const updatedMessage = await message.save();
  res.json({ success: true, message: 'Message marked as read', data: updatedMessage });
});

// @desc    Delete a message (Admin)
// @route   DELETE /api/messages/:id
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  await message.deleteOne();
  res.json({ success: true, message: 'Message removed', data: null });
});

module.exports = {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage
};
