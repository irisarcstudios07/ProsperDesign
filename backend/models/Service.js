const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // Water Fountains, Landscaping, Play Station, Interiors, Construction
  multipleImages: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
