import express from 'express';
import {
  markAttendance,
  markBulkAttendance,
  getUserAttendance,
  getMyAttendanceStats,
  getCourseAttendance,
  getSessionAttendance,
  deleteAttendance,
  getAttendanceLeaderboard
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with authentication)
router.get('/my-stats/:courseId', protect, getMyAttendanceStats);
router.get('/leaderboard/:courseId', protect, getAttendanceLeaderboard);

// Teacher/Admin routes
router.post('/mark', protect, markAttendance);
router.post('/mark-bulk', protect, markBulkAttendance);
router.get('/user/:courseId/:userId', protect, getUserAttendance);
router.get('/course/:courseId', protect, getCourseAttendance);
router.get('/session/:courseId/:sessionDate', protect, getSessionAttendance);
router.delete('/:id', protect, deleteAttendance);

export default router;
