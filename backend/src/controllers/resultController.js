const Result = require('../models/Result');

// @desc    Get current user's results
// @route   GET /api/results/my-results
// @access  Private (Student)
exports.getMyResults = async (req, res, next) => {
  try {
    const { itemType, subject } = req.query;
    let query = { student: req.user.id };

    if (itemType && (itemType === 'assessment' || itemType === 'quiz')) {
      query.itemType = itemType;
    }
    if (subject && subject !== 'All') {
      query.subject = new RegExp(`^${subject}$`, 'i');
    }

    const results = await Result.find(query)
      .populate('course', 'title category thumbnail')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
exports.getResultById = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('course', 'title category thumbnail')
      .populate('student', 'name email');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result record not found' });
    }

    // Security check: ensure student owns the result unless instructor or admin
    if (
      result.student._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'instructor'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view another student’s result record',
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all results (for Instructor & Admin)
// @route   GET /api/results
// @access  Private (Instructor, Admin)
exports.getAllResults = async (req, res, next) => {
  try {
    const { subject, itemType } = req.query;
    let query = {};

    if (subject && subject !== 'All') {
      query.subject = new RegExp(`^${subject}$`, 'i');
    }
    if (itemType) {
      query.itemType = itemType;
    }

    const results = await Result.find(query)
      .populate('student', 'name email avatar')
      .populate('course', 'title category')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
};
