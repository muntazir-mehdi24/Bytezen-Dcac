import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: String,
  type: { type: String, enum: ['article', 'day', 'lesson'], default: 'lesson' },
  completed: { type: Boolean, default: false },
  content: String,
  articles: [{
    id: String,
    title: String,
    completed: { type: Boolean, default: false },
    content: String
  }],
  problems: [{
    id: String,
    title: String,
    completed: { type: Boolean, default: false },
    content: String,
    difficulty: String,
    testCases: Array
  }],
  quiz: [{
    id: String,
    title: String,
    completed: { type: Boolean, default: false },
    questions: Number
  }]
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: String,
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  instructor: String,
  image: String,
  modules: [moduleSchema],
  whatYouWillLearn: [String],
  requirements: [String],
  enrolledStudents: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Course', courseSchema);
