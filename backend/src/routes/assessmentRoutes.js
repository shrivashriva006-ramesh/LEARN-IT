const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  submitAssessment,
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAssessments);
router.get('/:id', protect, getAssessmentById);
router.post('/', protect, authorize('instructor', 'admin'), createAssessment);
router.post('/:id/submit', protect, submitAssessment);

module.exports = router;
