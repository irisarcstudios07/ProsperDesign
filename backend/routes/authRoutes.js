const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', login);

module.exports = router;
