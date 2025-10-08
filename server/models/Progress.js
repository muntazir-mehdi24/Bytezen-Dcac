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
    completedAt: { type: Date, default: Date.now }
  }],
  completedProblems: [{
    problemId: String,
    completedAt: { type: Date, default: Date.now }
  }],
  completedQuizzes: [{
    quizId: String,
    score: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  lastAccessed: { type: Date, default: Date.now },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Create compound index for user and course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Update lastAccessed before saving
progressSchema.pre('save', function(next) {
  this.lastAccessed = Date.now();
  next();
});

export default mongoose.model('Progress', progressSchema);
