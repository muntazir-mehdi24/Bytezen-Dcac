import express from 'express';
import multer from 'multer';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseContent,
  addWeek,
  updateWeek,
  deleteWeek,
  addContent,
  updateContent,
  deleteContent
} from '../controllers/courseContentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Public route - get all courses
router.get('/', getAllCourses);

// Protected routes - require authentication
router.use(protect);

// Course CRUD (Admin only)
router.post('/', authorize('admin'), createCourse);
router.put('/:courseId', authorize('admin'), updateCourse);
router.delete('/:courseId', authorize('admin'), deleteCourse);

// Get course content
router.get('/:courseId/content', getCourseContent);

// Week management
router.post('/:courseId/weeks', addWeek);
router.put('/:courseId/weeks/:weekId', updateWeek);
router.delete('/:courseId/weeks/:weekId', deleteWeek);

// Content management
router.post('/:courseId/weeks/:weekId/content', upload.array('images', 10), addContent);
router.put('/:courseId/weeks/:weekId/content/:contentId', upload.array('images', 10), updateContent);
router.delete('/:courseId/weeks/:weekId/content/:contentId', deleteContent);

export default router;
