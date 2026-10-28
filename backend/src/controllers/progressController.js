const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Result = require('../models/Result');

// @desc    Get logged in student's overall progress
// @route   GET /api/progress/my-progress
// @access  Private (Student)
exports.getMyProgress = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Fetch student's progress docs
    const progressList = await Progress.find({ student: studentId })
      .populate('course', 'title category thumbnail enrolledCount')
      .populate('completedLessons', 'lessonTitle contentType order durationMinutes')
      .populate('lastAccessedLesson', 'lessonTitle contentType')
      .sort({ lastActivityAt: -1 });

    // Calculate aggregated overall progress
    let totalCompletedLessonsCount = 0;
    let totalPossibleLessons = 0;
    let totalPercentSum = 0;

    progressList.forEach((p) => {
      totalCompletedLessonsCount += p.completedLessons ? p.completedLessons.length : 0;
      totalPossibleLessons += p.totalLessons || 0;
      totalPercentSum += p.completionPercentage || 0;
    });

    const overallPercentage =
      progressList.length > 0 ? Math.round(totalPercentSum / progressList.length) : 0;

    // Get recent results for charts
    const recentResults = await Result.find({ student: studentId })
      .sort({ submissionDate: -1 })
      .limit(10);

    // Subject performance breakdown
    const subjectStats = {};
    recentResults.forEach((r) => {
      if (!subjectStats[r.subject]) {
        subjectStats[r.subject] = { subject: r.subject, totalScore: 0, count: 0 };
      }
      subjectStats[r.subject].totalScore += r.percentage;
      subjectStats[r.subject].count += 1;
    });

    const performanceChartData = Object.values(subjectStats).map((s) => ({
      subject: s.subject,
      averageScore: Math.round(s.totalScore / s.count),
    }));

    res.status(200).json({
      success: true,
      progressList,
      overallPercentage,
      totalCompletedLessonsCount,
      totalEnrolledCourses: progressList.length,
      performanceChartData,
      recentResults,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a lesson completed (or toggle)
// @route   PATCH /api/progress/:lessonId
// @access  Private (Student)
exports.updateLessonProgress = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const courseId = lesson.course;
    const totalLessons = await Lesson.countDocuments({ course: courseId });

    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = new Progress({
        student: studentId,
        course: courseId,
        completedLessons: [],
        totalLessons,
        completionPercentage: 0,
      });
    }

    const index = progress.completedLessons.indexOf(lessonId);
    const isCompleted = index !== -1;

    if (!isCompleted) {
      progress.completedLessons.push(lessonId);
    } else {
      // Toggle off if already marked
      progress.completedLessons.splice(index, 1);
    }

    progress.totalLessons = totalLessons;
    progress.lastAccessedLesson = lessonId;
    progress.lastActivityAt = new Date();

    // Recompute completion percentage:
    // Lessons account for 60%, Assessment 20%, Quiz 20%
    const lessonRatio = totalLessons > 0 ? progress.completedLessons.length / totalLessons : 1;
    const lessonScore = lessonRatio * 60;
    const assessScore = progress.hasCompletedAssessment ? 20 : 0;
    const quizScore = progress.hasCompletedQuiz ? 20 : 0;
    progress.completionPercentage = Math.min(100, Math.round(lessonScore + assessScore + quizScore));

    await progress.save();

    // Check if course is 100% complete
    if (progress.completionPercentage >= 100) {
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { completionStatus: 'completed', completionPercentage: 100, completedAt: new Date() }
      );
    } else {
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { completionPercentage: progress.completionPercentage }
      );
    }

    res.status(200).json({
      success: true,
      message: !isCompleted ? 'Lesson marked as completed' : 'Lesson marked as incomplete',
      completed: !isCompleted,
      completionPercentage: progress.completionPercentage,
      completedLessons: progress.completedLessons,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get progress for single course
// @route   GET /api/progress/course/:courseId
// @access  Private (Student)
exports.getCourseProgress = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId;

    const progress = await Progress.findOne({ student: studentId, course: courseId })
      .populate('completedLessons');

    res.status(200).json({
      success: true,
      progress: progress || {
        completedLessons: [],
        completionPercentage: 0,
        hasCompletedAssessment: false,
        hasCompletedQuiz: false,
      },
    });
  } catch (err) {
    next(err);
  }
};
