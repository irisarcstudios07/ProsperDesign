const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  businessName: { type: String },
  phone: { type: String },
  email: { type: String },
  whatsapp: { type: String },
  address: { type: String },
  logo: { type: String },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
