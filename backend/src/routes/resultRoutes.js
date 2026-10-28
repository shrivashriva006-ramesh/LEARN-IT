const express = require('express');
const router = express.Router();
const {
  getMyResults,
  getResultById,
  getAllResults,
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-results', protect, getMyResults);
router.get('/', protect, authorize('instructor', 'admin'), getAllResults);
router.get('/:id', protect, getResultById);

module.exports = router;
