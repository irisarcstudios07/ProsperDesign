const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if login matches environment variables
    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    if (username === envUser && password === envPass) {
      // Create a token (we'll just use a generic ID for env-based auth)
      const token = jwt.sign({ id: 'env_admin' }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
      return res.json({ token, username });
    }

    // 2. Alternatively, check MongoDB if we have db admins
    const admin = await Admin.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
      return res.json({ token, username: admin.username });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
