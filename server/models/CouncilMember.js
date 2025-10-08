import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema({
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
  },
  twitter: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?twitter\.com\/.*$/, 'Please enter a valid Twitter URL']
  },
  github: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please enter a valid GitHub URL']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, 'Please enter a valid URL']
  }
}, { _id: false });

const councilMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [200, 'Role cannot be more than 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  socialLinks: socialLinksSchema,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search
councilMemberSchema.index({
  name: 'text',
  role: 'text',
  bio: 'text'
});

// Static method to get active members
councilMemberSchema.statics.getActiveMembers = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 });
};

const CouncilMember = mongoose.models.CouncilMember || mongoose.model('CouncilMember', councilMemberSchema);

export default CouncilMember;
