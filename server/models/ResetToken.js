import mongoose from 'mongoose';
import crypto from 'crypto';

const resetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600 // 1 hour
  }
});

// Generate and hash password reset token
resetTokenSchema.statics.generateToken = function(user) {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetToken field
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return { resetToken, hashedToken };
};

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

export default ResetToken;
