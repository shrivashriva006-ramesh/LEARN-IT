const express = require('express');
const router = express.Router();
const {
  getMyProgress,
  updateLessonProgress,
  getCourseProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/my-progress', protect, getMyProgress);
router.get('/course/:courseId', protect, getCourseProgress);
router.patch('/:lessonId', protect, updateLessonProgress);

module.exports = router;
