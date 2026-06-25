const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

// ─── Nodemailer Transporter — Force IPv4 (fixes ENETUNREACH on Render) ──────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       // TLS (STARTTLS) not SSL
  family: 4,           // Force IPv4 — avoids ENETUNREACH IPv6 on Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify SMTP connection at startup (non-blocking)
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Ready - Email notifications enabled (IPv4)');
  }
});

// ─── Background email sender (non-blocking) ───────────────────────────────────
function sendEmailNotification(name, email, phone, subject, service, message) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set — skipping email');
    return;
  }

  const isConsultation = !!service;

  const mailOptions = {
    from: `"Prosper Design" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: isConsultation ? '📋 New Book Consultation' : '📩 New Contact Form Message',
    html: isConsultation ? `
      <h2 style="color:#d4af37">New Consultation Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    ` : `
      <h2 style="color:#d4af37">New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  console.log(`📧 Sending email notification to ${process.env.EMAIL_USER}...`);

  transporter.sendMail(mailOptions, (mailError, info) => {
    if (mailError) {
      console.error('❌ Email sending failed:', mailError.message);
    } else {
      console.log('✅ Email sent successfully:', info.messageId);
    }
  });
}

// ─── @route  POST /api/messages ───────────────────────────────────────────────
// @desc   Submit a contact form or consultation booking (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, subject, message } = req.body;

    console.log(`📥 New message from: ${name} | ${email} | service: ${service || 'N/A'}`);

    // Step 1: Save to MongoDB first
    const newMessage = new Message({ name, email, phone, service, subject, message });
    await newMessage.save();
    console.log(`✅ Message saved to MongoDB: ${newMessage._id}`);

    // Step 2: Respond immediately to frontend — do NOT block on email
    res.status(201).json({ success: true, message: 'Message sent successfully' });

    // Step 3: Send email in background (after response is sent)
    sendEmailNotification(name, email, phone, subject, service, message);

  } catch (error) {
    console.error('❌ Submit message error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
});

// ─── @route  GET /api/messages ────────────────────────────────────────────────
// @desc   Get all messages (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('❌ Fetch messages error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── @route  PUT /api/messages/:id/read ──────────────────────────────────────
// @desc   Mark message as read (Admin)
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.readStatus = true;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (error) {
    console.error('❌ Mark read error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── @route  DELETE /api/messages/:id ────────────────────────────────────────
// @desc   Delete a message (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await message.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    console.error('❌ Delete message error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

