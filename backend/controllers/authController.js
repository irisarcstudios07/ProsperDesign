const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // 1. Check if login matches environment variables
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;

  if (username === envUser && password === envPass) {
    const token = jwt.sign({ id: 'env_admin' }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    return res.json({ success: true, message: 'Login successful', data: { token, username } });
  }

  // 2. Alternatively, check MongoDB if we have db admins
  const admin = await Admin.findOne({ username });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    return res.json({ success: true, message: 'Login successful', data: { token, username: admin.username } });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = {
  login
};
