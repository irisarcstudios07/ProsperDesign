const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' }
}, { _id: false });

const ChildServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  gallery: [GalleryImageSchema]
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String, default: '' },
  children: [ChildServiceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
