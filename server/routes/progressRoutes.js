import express from 'express';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
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
    
    // Use uid if _id is not an ObjectId (for Firebase users)
    const userId = req.user._id || req.user.uid;

    let progress = await Progress.findOne({
      user: userId,
      course: req.params.courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
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
    // Note: For hardcoded courses, we'll calculate progress based on completed items
    // If course exists in DB, use that, otherwise use a reasonable estimate
    try {
      const course = await Course.findById(req.params.courseId);
      if (course) {
        const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
        progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);
      } else {
        // For hardcoded courses, just track completion count
        progress.overallProgress = Math.min(100, progress.completedLessons.length * 5); // Rough estimate
      }
    } catch (err) {
      // If course not found, just track completion count
      progress.overallProgress = Math.min(100, progress.completedLessons.length * 5);
    }

    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error in mark lesson complete:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/progress/:courseId/article
// @desc    Mark article as complete
// @access  Private
router.post('/:courseId/article', protect, async (req, res) => {
  try {
    const { articleId, timeSpent } = req.body;

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
      progress.completedArticles.push({ 
        articleId, 
        timeSpent: timeSpent || 0 
      });
      progress.totalArticlesCompleted = (progress.totalArticlesCompleted || 0) + 1;
      progress.totalTimeSpent = (progress.totalTimeSpent || 0) + (timeSpent || 0);
      await progress.save();
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/progress/:courseId/problem
// @desc    Mark problem as complete
// @access  Private
router.post('/:courseId/problem', protect, async (req, res) => {
  try {
    const { problemId, difficulty, points, timeSpent, attempts } = req.body;

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

    const problemIndex = progress.completedProblems.findIndex(
      p => p.problemId === problemId
    );

    if (problemIndex === -1) {
      progress.completedProblems.push({ 
        problemId,
        difficulty: difficulty || 'Easy',
        points: points || 0,
        timeSpent: timeSpent || 0,
        attempts: attempts || 1
      });
      progress.totalProblemsCompleted = (progress.totalProblemsCompleted || 0) + 1;
      progress.totalPoints = (progress.totalPoints || 0) + (points || 0);
      progress.totalTimeSpent = (progress.totalTimeSpent || 0) + (timeSpent || 0);
    } else {
      progress.completedProblems[problemIndex].attempts += 1;
    }

    await progress.save();
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/progress/:courseId/quiz
// @desc    Mark quiz as complete
// @access  Private
router.post('/:courseId/quiz', protect, async (req, res) => {
  try {
    const { quizId, score, totalQuestions, timeSpent } = req.body;

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

    const quizIndex = progress.completedQuizzes.findIndex(
      q => q.quizId === quizId
    );

    if (quizIndex === -1) {
      progress.completedQuizzes.push({ 
        quizId,
        score: score || 0,
        totalQuestions: totalQuestions || 10,
        timeSpent: timeSpent || 0,
        attempts: 1
      });
      progress.totalQuizzesCompleted = (progress.totalQuizzesCompleted || 0) + 1;
      progress.totalTimeSpent = (progress.totalTimeSpent || 0) + (timeSpent || 0);
    } else {
      if (score > progress.completedQuizzes[quizIndex].score) {
        progress.completedQuizzes[quizIndex].score = score;
      }
      progress.completedQuizzes[quizIndex].attempts += 1;
    }

    await progress.save();
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/progress/:courseId/detailed
// @desc    Get detailed progress breakdown
// @access  Private
router.get('/:courseId/detailed', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress not found' });
    }

    const stats = {
      overall: {
        progress: progress.overallProgress || 0,
        timeSpent: progress.totalTimeSpent || 0,
        points: progress.totalPoints || 0,
        streak: progress.currentStreak || 0,
        longestStreak: progress.longestStreak || 0
      },
      articles: {
        completed: progress.totalArticlesCompleted || 0,
        list: progress.completedArticles || []
      },
      problems: {
        completed: progress.totalProblemsCompleted || 0,
        totalPoints: (progress.completedProblems || []).reduce((sum, p) => sum + (p.points || 0), 0),
        list: progress.completedProblems || []
      },
      quizzes: {
        completed: progress.totalQuizzesCompleted || 0,
        averageScore: (progress.completedQuizzes || []).length > 0
          ? Math.round((progress.completedQuizzes || []).reduce((sum, q) => sum + (q.score || 0), 0) / progress.completedQuizzes.length)
          : 0,
        list: progress.completedQuizzes || []
      },
      weeks: progress.weekProgress || [],
      days: progress.dayProgress || []
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/progress/user/stats
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
      totalArticlesCompleted: progressRecords.reduce((acc, p) => acc + (p.totalArticlesCompleted || 0), 0),
      totalProblemsCompleted: progressRecords.reduce((acc, p) => acc + (p.totalProblemsCompleted || 0), 0),
      totalQuizzesCompleted: progressRecords.reduce((acc, p) => acc + (p.totalQuizzesCompleted || 0), 0),
      totalPoints: progressRecords.reduce((acc, p) => acc + (p.totalPoints || 0), 0),
      totalTimeSpent: progressRecords.reduce((acc, p) => acc + (p.totalTimeSpent || 0), 0),
      averageProgress: progressRecords.length > 0
        ? Math.round(progressRecords.reduce((acc, p) => acc + p.overallProgress, 0) / progressRecords.length)
        : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/progress/admin/course/:courseId
// @desc    Get all students' progress for a course (Admin only)
// @access  Private (Admin/Instructor)
router.get('/admin/course/:courseId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const progressRecords = await Progress.find({ course: req.params.courseId })
      .populate('user', 'name email profilePicture')
      .sort({ overallProgress: -1 });

    const stats = progressRecords.map(progress => ({
      user: progress.user,
      overallProgress: progress.overallProgress || 0,
      articlesCompleted: progress.totalArticlesCompleted || 0,
      problemsCompleted: progress.totalProblemsCompleted || 0,
      quizzesCompleted: progress.totalQuizzesCompleted || 0,
      totalPoints: progress.totalPoints || 0,
      timeSpent: progress.totalTimeSpent || 0,
      currentStreak: progress.currentStreak || 0,
      lastAccessed: progress.lastAccessed,
      enrolledAt: progress.enrolledAt
    }));

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/progress/admin/student/:userId/:courseId
// @desc    Get specific student's detailed progress (Admin only)
// @access  Private (Admin/Instructor)
router.get('/admin/student/:userId/:courseId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const progress = await Progress.findOne({
      user: req.params.userId,
      course: req.params.courseId
    }).populate('user', 'name email profilePicture');

    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress not found' });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
