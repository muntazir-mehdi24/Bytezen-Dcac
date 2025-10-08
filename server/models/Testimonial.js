import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide a role/position'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=2f8d46&color=fff`;
    }
  },
  testimonial: {
    type: String,
    required: [true, 'Please provide testimonial text'],
    trim: true
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
testimonialSchema.index({ isActive: 1, order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
