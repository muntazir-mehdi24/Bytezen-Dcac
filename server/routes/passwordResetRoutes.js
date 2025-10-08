import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import ResetToken from '../models/ResetToken.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Forgot password - Generate reset token
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account with that email exists'
      });
    }

    // Generate and hash token
    const { resetToken, hashedToken } = ResetToken.generateToken(user);
    
    // Save hashed token to database
    await new ResetToken({
      user: user._id,
      token: hashedToken
    }).save();

    // In a real app, you would send an email with the reset token
    // For now, we'll just return it in the response
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      token: resetToken // In production, don't send the token, send an email instead
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    // Find token in database
    const resetToken = await ResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() }
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Find user and update password
    const user = await User.findById(resetToken.user);
    user.password = req.body.password;
    await user.save();

    // Delete the reset token
    await ResetToken.findByIdAndDelete(resetToken._id);

    // In a real app, you might want to send a confirmation email
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update password (for logged-in users)
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
