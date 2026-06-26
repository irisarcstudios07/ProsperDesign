const Setting = require('../models/Setting');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage } = require('../services/cloudinaryService');

// @desc    Get website settings (Public)
// @route   GET /api/settings
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = new Setting({});
    await settings.save();
  }
  res.json({ success: true, message: 'Settings fetched successfully', data: settings });
});

// @desc    Update website settings (Admin)
// @route   PUT /api/settings
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = new Setting({});
  }

  const { businessName, phone, email, whatsapp, address, heroTitle, heroSubtitle, facebook, instagram, twitter, linkedin } = req.body;
  
  settings.businessName = businessName !== undefined ? businessName : settings.businessName;
  settings.phone = phone !== undefined ? phone : settings.phone;
  settings.email = email !== undefined ? email : settings.email;
  settings.whatsapp = whatsapp !== undefined ? whatsapp : settings.whatsapp;
  settings.address = address !== undefined ? address : settings.address;
  settings.heroTitle = heroTitle !== undefined ? heroTitle : settings.heroTitle;
  settings.heroSubtitle = heroSubtitle !== undefined ? heroSubtitle : settings.heroSubtitle;
  
  settings.socialLinks = {
    facebook: facebook !== undefined ? facebook : settings.socialLinks?.facebook,
    instagram: instagram !== undefined ? instagram : settings.socialLinks?.instagram,
    twitter: twitter !== undefined ? twitter : settings.socialLinks?.twitter,
    linkedin: linkedin !== undefined ? linkedin : settings.socialLinks?.linkedin
  };

  if (req.file) {
    const secureUrl = await uploadImage(req.file.path, 'prosper_design/logos');
    if (secureUrl) {
      settings.logo = secureUrl;
    }
  }

  const updatedSettings = await settings.save();
  res.json({ success: true, message: 'Settings updated successfully', data: updatedSettings });
});

module.exports = {
  getSettings,
  updateSettings
};
