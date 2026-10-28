const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  publishCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { enrollInCourse } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.patch('/:id/publish', protect, authorize('instructor', 'admin'), publishCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Enrollment shortcut route per spec: POST /api/courses/:id/enroll
router.post('/:id/enroll', protect, enrollInCourse);

module.exports = router;
