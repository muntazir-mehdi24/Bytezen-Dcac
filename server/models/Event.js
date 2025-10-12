import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the event'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the event']
  },
  images: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
eventSchema.index({ date: 1 });

// Pre-save hook to update the updatedAt field
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function() {
  return this.find({ date: { $gte: new Date() } }).sort('date');
};

// Static method to get past events
eventSchema.statics.getPastEvents = function() {
  return this.find({ date: { $lt: new Date() } }).sort('-date');
};

// Virtual for formatted date
eventSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
