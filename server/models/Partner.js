import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true,
    maxlength: [200, 'Partner name cannot be more than 200 characters']
  },
  logoUrl: {
    type: String,
    required: [true, 'Logo URL is required'],
    trim: true
  },
  websiteUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, 'Please enter a valid URL']
  },
  contactName: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact name cannot be more than 100 characters']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  partnershipType: {
    type: String,
    enum: ['sponsor', 'community', 'education', 'technology', 'media'],
    default: 'sponsor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  partnershipDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search
partnerSchema.index({
  name: 'text',
  description: 'text',
  contactName: 'text'
});

// Static method to get featured partners
partnerSchema.statics.getFeatured = function() {
  return this.find({ isActive: true, featured: true })
    .sort({ 'partnershipDate': -1 });
};

// Static method to get partners by type
partnerSchema.statics.getByType = function(type) {
  return this.find({ isActive: true, partnershipType: type })
    .sort({ 'partnershipDate': -1 });
};

const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

export default Partner;
