const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { isSmtpConfigured, sendVerificationEmail } = require('../utils/email');
const { getConfiguredAdminEmail, isAuthorizedAdminEmail } = require('../utils/adminEmail');

// Generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.cookie('edtech_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { name, email, password, confirmPassword, role } = body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be 80 characters or fewer',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        success: false,
        message: 'Password must be 72 UTF-8 bytes or fewer',
      });
    }

    if (role !== undefined && !['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid registration role',
      });
    }

    if (role === 'admin' && !getConfiguredAdminEmail()) {
      return res.status(503).json({
        success: false,
        message: 'Administrator registration is not configured.',
      });
    }

    if (role === 'admin' && !isAuthorizedAdminEmail(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Administrator registration is restricted to the authorized email address.',
      });
    }

    const emailVerificationEnabled = process.env.EMAIL_VERIFICATION_ENABLED === 'true';
    const verificationRequired = emailVerificationEnabled || role === 'admin';
    if (verificationRequired && !isSmtpConfigured()) {
      return res.status(503).json({
        success: false,
        message: role === 'admin'
          ? 'Administrator registration requires a configured email verification service.'
          : 'Email verification is enabled but email service is not configured. Contact the administrator.',
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }

    const verificationToken = verificationRequired
      ? crypto.randomBytes(32).toString('hex')
      : undefined;
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'student',
      instructorRequestStatus: role === 'instructor' ? 'pending' : 'none',
      adminRegistrationRequested: role === 'admin',
      emailVerified: !verificationRequired,
      emailVerificationTokenHash: verificationToken
        ? crypto.createHash('sha256').update(verificationToken).digest('hex')
        : undefined,
      emailVerificationExpiresAt: verificationToken
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : undefined,
    });

    if (verificationToken) {
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);
      } catch {
        await User.findByIdAndDelete(user._id);
        return res.status(502).json({
          success: false,
          message: 'The verification email could not be sent. Please try again later.',
        });
      }

      return res.status(201).json({
        success: true,
        message: role === 'instructor'
          ? 'Your account is registered as a student. Verify your email and wait for administrator approval before instructor access is granted.'
          : role === 'admin'
            ? 'Verify your email address, then complete administrator setup using the secure backend bootstrap command.'
          : 'Registration successful. Verify your email before signing in.',
      });
    }

    res.status(201).json({
      success: true,
      message: role === 'instructor'
        ? 'Your instructor request was submitted. Your account remains a student until an administrator approves it.'
        : role === 'admin'
          ? 'Administrator registration requires email verification before secure setup.'
        : 'Registration successful. You can now sign in.',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact support.',
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before signing in.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.role === 'admin' && !isAuthorizedAdminEmail(user.email)) {
      return res.status(403).json({
        success: false,
        message: 'Administrator access is restricted to the configured email address.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Verify a user's email address
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { token } = body;
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({
        success: false,
        message: 'A verification token is required',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOneAndUpdate(
      {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: { $gt: new Date() },
      },
      {
        $set: { emailVerified: true },
        $unset: {
          emailVerificationTokenHash: 1,
          emailVerificationExpiresAt: 1,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This verification link is invalid or has expired. Register again or contact support.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now sign in.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log out the current user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.clearCookie('edtech_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    next(err);
  }
};
