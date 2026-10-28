const express = require('express');
const router = express.Router();
const {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.post('/', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
