const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  thumbnail: { type: String },
  coverImage: { type: String },
  video: { type: String }, // path to local or Cloudinary video
  videoType: { type: String }, // 'cloudinary', 'gdrive', etc
  videoUrl: { type: String },
  images: [{ type: String }],
  galleryImages: [{ type: String }],
  featured: { type: Boolean, default: false },
  visibility: { type: Boolean, default: true },
  location: { type: String },
  area: { type: String },
  completion: { type: String },
  completionDate: { type: Date },
  materials: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

