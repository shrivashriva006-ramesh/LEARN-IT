const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  getInstructorRequests,
  reviewInstructorRequest,
  updateUserRole,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/instructor-requests', getInstructorRequests);
router.patch('/instructor-requests/:id', reviewInstructorRequest);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
