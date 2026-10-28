const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
