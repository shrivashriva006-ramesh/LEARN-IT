const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getConfiguredAdminEmail, isAuthorizedAdminEmail } = require('../utils/adminEmail');

// Protect routes
exports.protect = async (req, res, next) => {
  const encodedCookieToken = req.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('edtech_token='))
    ?.slice('edtech_token='.length);
  const bearerHeader = req.headers.authorization;
  let token;
  try {
    token = encodedCookieToken
      ? decodeURIComponent(encodedCookieToken)
      : bearerHeader && bearerHeader.startsWith('Bearer ')
        ? bearerHeader.slice('Bearer '.length)
        : null;
  } catch {
    token = null;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, token missing',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User no longer exists',
    });
  }

  if (user.status === 'inactive') {
    return res.status(403).json({
      success: false,
      message: 'Your account is deactivated. Please contact an administrator.',
    });
  }

  if (user.role === 'admin') {
    if (!getConfiguredAdminEmail()) {
      return res.status(503).json({
        success: false,
        message: 'Administrator access is not configured.',
      });
    }

    if (!isAuthorizedAdminEmail(user.email)) {
      return res.status(403).json({
        success: false,
        message: 'Administrator access is restricted to the configured email address.',
      });
    }
  }

  req.user = user;
  next();
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user?.role === 'admin' && !isAuthorizedAdminEmail(req.user.email)) {
      return res.status(403).json({
        success: false,
        message: 'Administrator access is restricted to the configured email address.',
      });
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`,
      });
    }
    next();
  };
};
