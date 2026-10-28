const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
