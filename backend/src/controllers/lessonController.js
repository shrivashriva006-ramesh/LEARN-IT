const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Get all lessons for a course
// @route   GET /api/lessons?courseId=xyz
// @access  Public / Enrolled
exports.getLessons = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) {
      query.course = courseId;
    }

    const lessons = await Lesson.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public / Private
exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'title category');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private (Instructor, Admin)
exports.createLesson = async (req, res, next) => {
  try {
    const { course, lessonTitle, contentType, contentUrl, description, notesContent, pdfUrl, order, durationMinutes } = req.body;

    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (courseDoc.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await Lesson.create({
      course,
      lessonTitle,
      contentType: contentType || 'video',
      contentUrl: contentUrl || '',
      description: description || '',
      notesContent: notesContent || '',
      pdfUrl: pdfUrl || '',
      order: order || 1,
      durationMinutes: durationMinutes || 15,
    });

    // Update totalLessons in existing progress docs for this course
    const totalCount = await Lesson.countDocuments({ course });
    await Progress.updateMany({ course }, { totalLessons: totalCount });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor, Admin)
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor, Admin)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const courseId = lesson.course._id;
    await Lesson.findByIdAndDelete(req.params.id);

    // Update progress documents
    const totalCount = await Lesson.countDocuments({ course: courseId });
    await Progress.updateMany({ course: courseId }, { totalLessons: totalCount });

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
