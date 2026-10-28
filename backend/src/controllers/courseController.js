const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// @desc    Get all courses (with optional filters)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    // By default, public/students see published courses only
    if (status && (req.user?.role === 'admin' || req.user?.role === 'instructor')) {
      query.status = status;
    } else {
      query.status = 'published';
    }

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .populate('lessons')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, category, description, level, learningObjectives, thumbnail, iconName } = req.body;

    const course = await Course.create({
      title,
      category,
      description,
      level: level || 'Beginner',
      learningObjectives: learningObjectives || [],
      thumbnail: thumbnail || '',
      iconName: iconName || 'BookOpen',
      instructor: req.user.id,
      status: 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor, Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership if not admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Publish / Unpublish course
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor, Admin)
exports.publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify publish status for this course',
      });
    }

    course.status = course.status === 'published' ? 'draft' : 'published';
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.status === 'published' ? 'published' : 'unpublished'} successfully`,
      status: course.status,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin, Owner Instructor)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Lesson.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
