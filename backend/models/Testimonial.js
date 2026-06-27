const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  service:    { type: String, required: true },
  message:    { type: String, required: true },
  rating:     { type: Number, default: 5, min: 1, max: 5 },
  order:      { type: Number, default: 0 },
  visible:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
