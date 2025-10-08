import express from 'express';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query).select('-modules');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      user: req.user._id,
      course: course._id
    });

    if (existingProgress) {
      return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
    }

    // Create progress entry
    const progress = await Progress.create({
      user: req.user._id,
      course: course._id
    });

    // Update enrolled students count
    course.enrolledStudents += 1;
    await course.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/courses/enrolled
// @desc    Get user's enrolled courses
// @access  Private
router.get('/user/enrolled', protect, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ user: req.user._id })
      .populate('course')
      .sort('-lastAccessed');

    const enrolledCourses = progressRecords.map(record => ({
      course: record.course,
      progress: record.overallProgress,
      lastAccessed: record.lastAccessed,
      enrolledAt: record.enrolledAt
    }));

    res.json({ success: true, data: enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a course (Admin only)
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    // Add admin check here if needed
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course (Admin only)
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
