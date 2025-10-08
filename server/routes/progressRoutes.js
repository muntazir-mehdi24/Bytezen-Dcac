import express from 'express';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress/:courseId
// @desc    Get course progress for current user
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      // Create new progress if doesn't exist
      progress = await Progress.create({
        user: req.user._id,
        course: req.params.courseId
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/progress/:courseId/lesson
// @desc    Mark lesson as complete
// @access  Private
router.post('/:courseId/lesson', protect, async (req, res) => {
  try {
    const { lessonId, completed } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: req.params.courseId
      });
    }

    // Check if lesson already completed
    const lessonIndex = progress.completedLessons.findIndex(
      l => l.lessonId === lessonId
    );

    if (completed && lessonIndex === -1) {
      progress.completedLessons.push({ lessonId });
    } else if (!completed && lessonIndex !== -1) {
      progress.completedLessons.splice(lessonIndex, 1);
    }

    // Calculate overall progress
    const course = await Course.findById(req.params.courseId);
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);

    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/progress/:courseId/article
// @desc    Mark article as complete
// @access  Private
router.post('/:courseId/article', protect, async (req, res) => {
  try {
    const { articleId } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: req.params.courseId
      });
    }

    // Check if article already completed
    const articleIndex = progress.completedArticles.findIndex(
      a => a.articleId === articleId
    );

    if (articleIndex === -1) {
      progress.completedArticles.push({ articleId });
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/progress/stats
// @desc    Get overall stats for user
// @access  Private
router.get('/user/stats', protect, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ user: req.user._id });

    const stats = {
      totalCourses: progressRecords.length,
      completedCourses: progressRecords.filter(p => p.overallProgress === 100).length,
      inProgressCourses: progressRecords.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length,
      totalLessonsCompleted: progressRecords.reduce((acc, p) => acc + p.completedLessons.length, 0),
      averageProgress: progressRecords.length > 0
        ? Math.round(progressRecords.reduce((acc, p) => acc + p.overallProgress, 0) / progressRecords.length)
        : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
