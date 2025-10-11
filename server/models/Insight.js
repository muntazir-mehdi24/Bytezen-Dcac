import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  thumbnailUrl: {
    type: String
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
insightSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word characters
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/--+/g, '-') // replace multiple - with single -
      .trim();
  }
  next();
});

// Static method to get published insights
insightSchema.statics.getPublished = function() {
  return this.find({ isPublished: true })
    .sort('-date')
    .populate('author', 'name');
};

// Virtual for formatted date
insightSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const Insight = mongoose.models.Insight || mongoose.model('Insight', insightSchema);

export default Insight;
