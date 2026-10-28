const express = require('express');
const router = express.Router();
const {
  getInstructorStats,
  getInstructorStudents,
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('instructor', 'admin'));

router.get('/stats', getInstructorStats);
router.get('/students', getInstructorStudents);

module.exports = router;
