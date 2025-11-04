const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || '2b5d94eb644c2edf7c4e1a46b716e137517e3bb0e6101f2dd01f6785a6ae1de0a8e6193c495d3aea3c5eb53f4a42c69ac964b520b834a8aedcdf69369c503386';

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Admin only middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
};

// Check subscription for premium content
exports.checkSubscription = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    const subscription = req.user.subscription;

    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required to access this content',
      });
    }

    if (subscription.endDate && new Date() > subscription.endDate) {
      req.user.subscription.status = 'expired';
      await req.user.save();
      
      return res.status(403).json({
        success: false,
        message: 'Your subscription has expired',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking subscription',
    });
  }
};
