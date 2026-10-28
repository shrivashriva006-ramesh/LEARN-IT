const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      enrolledAt: new Date(),
    });

    // Increment enrolledCount
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // Initialize progress record for this student and course
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    await Progress.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        student: studentId,
        course: courseId,
        completedLessons: [],
        totalLessons,
        completionPercentage: 0,
      },
      { upsert: true, new: true }
    );

    // Create welcoming notification
    await Notification.create({
      recipient: studentId,
      title: 'Course Enrollment Confirmed!',
      message: `You have successfully enrolled in ${course.title}. Start exploring learning materials and prepare for assessments!`,
      type: 'course',
      link: `/courses/${courseId}`,
    });

    res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.title}`,
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ enrolledAt: -1 });

    // Fetch progress for each enrollment
    const enriched = await Promise.all(
      enrollments.map(async (enr) => {
        if (!enr.course) return null;
        const prog = await Progress.findOne({ student: studentId, course: enr.course._id });
        return {
          _id: enr._id,
          enrolledAt: enr.enrolledAt,
          completionStatus: enr.completionStatus,
          completionPercentage: prog ? prog.completionPercentage : 0,
          completedLessonsCount: prog ? prog.completedLessons.length : 0,
          course: enr.course,
        };
      })
    );

    res.status(200).json({
      success: true,
      enrollments: enriched.filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};
