import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lessonId: String,
    completedAt: { type: Date, default: Date.now }
  }],
  completedArticles: [{
    articleId: String,
    timeSpent: { type: Number, default: 0 }, // in seconds
    completedAt: { type: Date, default: Date.now }
  }],
  completedProblems: [{
    problemId: String,
    attempts: { type: Number, default: 1 },
    timeSpent: { type: Number, default: 0 }, // in seconds
    difficulty: String,
    points: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
  }],
  completedQuizzes: [{
    quizId: String,
    score: Number,
    totalQuestions: Number,
    attempts: { type: Number, default: 1 },
    timeSpent: { type: Number, default: 0 }, // in seconds
    completedAt: { type: Date, default: Date.now }
  }],
  // Week/Day level progress tracking
  weekProgress: [{
    weekId: String,
    completedDays: [String],
    articlesCompleted: Number,
    problemsCompleted: Number,
    quizzesCompleted: Number,
    progressPercentage: Number,
    lastAccessedAt: Date
  }],
  dayProgress: [{
    dayId: String,
    weekId: String,
    articlesCompleted: Number,
    problemsCompleted: Number,
    quizzesCompleted: Number,
    progressPercentage: Number,
    completedAt: Date
  }],
  // Overall statistics
  totalTimeSpent: { type: Number, default: 0 }, // in seconds
  totalArticlesCompleted: { type: Number, default: 0 },
  totalProblemsCompleted: { type: Number, default: 0 },
  totalQuizzesCompleted: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  articlesProgress: { type: Number, default: 0, min: 0, max: 100 },
  problemsProgress: { type: Number, default: 0, min: 0, max: 100 },
  quizzesProgress: { type: Number, default: 0, min: 0, max: 100 },
  // Streaks and engagement
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: Date,
  // Timestamps
  lastAccessed: { type: Date, default: Date.now },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date
}, {
  timestamps: true
});

// Create compound index for user and course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Update lastAccessed before saving
progressSchema.pre('save', function(next) {
  this.lastAccessed = Date.now();
  
  // Update streak logic
  if (this.lastActivityDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change to streak
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      this.currentStreak += 1;
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
    this.longestStreak = 1;
  }
  
  this.lastActivityDate = new Date();
  next();
});

export default mongoose.model('Progress', progressSchema);
