const express = require('express');
const router = express.Router();
const multer = require('multer');
const Setting = require('../models/Setting');
const { protect } = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');

// Multer Disk Storage for temporary Logo upload staging
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// @route   GET /api/settings
// @desc    Get website settings (Public)
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/settings
// @desc    Update website settings (Admin)
router.put('/', protect, upload.single('logo'), async (req, res) => {
  try {
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
      const uploadRes = await uploadToCloudinary(req.file.path, 'prosper_design/logos');
      if (uploadRes) {
        settings.logo = uploadRes.secure_url;
      }
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
