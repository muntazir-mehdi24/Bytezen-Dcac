import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rollNumber: {
    type: String,
    sparse: true
  },
  phone: {
    type: String
  },
  department: {
    type: String,
    enum: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', '']
  },
  division: {
    type: String,
    enum: ['A', 'B', 'C', 'D', '']
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE', '']
  },
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Student', studentSchema);
