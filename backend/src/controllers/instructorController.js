const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// @desc    Get Instructor dashboard statistics
// @route   GET /api/instructor/stats
// @access  Private (Instructor, Admin)
exports.getInstructorStats = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const isInstructor = req.user.role === 'instructor';

    // If instructor, filter by their courses; if admin, show all
    const courseQuery = isInstructor ? { instructor: instructorId } : {};
    const myCourses = await Course.find(courseQuery).select('_id title category enrolledCount status');
    const courseIds = myCourses.map(c => c._id);

    const totalStudentsEnrolled = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const totalAssessments = await Assessment.countDocuments({ course: { $in: courseIds } });
    const totalQuizzes = await Quiz.countDocuments({ course: { $in: courseIds } });
    const totalSubmissions = await Result.countDocuments({ course: { $in: courseIds } });

    // Recent student submissions for instructor courses
    const recentSubmissions = await Result.find({ course: { $in: courseIds } })
      .populate('student', 'name email avatar')
      .populate('course', 'title')
      .sort({ submissionDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses: myCourses.length,
        totalStudentsEnrolled,
        totalAssessments,
        totalQuizzes,
        totalSubmissions,
      },
      courses: myCourses,
      recentSubmissions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get enrolled students across instructor's courses
// @route   GET /api/instructor/students
// @access  Private (Instructor, Admin)
exports.getInstructorStudents = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const isInstructor = req.user.role === 'instructor';
    const courseQuery = isInstructor ? { instructor: instructorId } : {};

    const myCourses = await Course.find(courseQuery).select('_id');
    const courseIds = myCourses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email createdAt status')
      .populate('course', 'title category')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (err) {
    next(err);
  }
};
