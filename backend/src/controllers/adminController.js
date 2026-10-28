const User = require('../models/User');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Enrollment = require('../models/Enrollment');

// @desc    Get Admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalResults = await Result.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Pass rate across all attempts
    const passedResults = await Result.countDocuments({ passed: true });
    const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(8).select('-password');
    const recentResults = await Result.find()
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ submissionDate: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalAssessments,
        totalQuizzes,
        totalResults,
        totalEnrollments,
        passRate,
      },
      recentUsers,
      recentResults,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating oneself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account',
      });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account ${user.status === 'active' ? 'activated' : 'deactivated'}`,
      status: user.status,
    });
  } catch (err) {
    next(err);
  }
};
