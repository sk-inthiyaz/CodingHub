const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get user settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      notifications: user.notifications || {
        emailNotifications: true,
        streakReminders: true,
        discussionUpdates: true
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Find user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notification settings
router.put('/notifications', auth, async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({ message: 'Notification settings are required' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update notification preferences
    user.notifications = {
      emailNotifications: notifications.emailNotifications ?? true,
      streakReminders: notifications.streakReminders ?? true,
      discussionUpdates: notifications.discussionUpdates ?? true
    };

    await user.save();

    res.json({ 
      message: 'Notification settings updated successfully',
      notifications: user.notifications
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user-related data
    // You might want to also delete:
    // - User's submissions
    // - User's discussions
    // - User's comments
    // - User's chat history
    // - User's code explanations
    
    const Submission = require('../models/Submission');
    const ChatHistory = require('../models/ChatHistory');
    const CodeExplanation = require('../models/CodeExplanation');
    
    // Delete user's submissions
    await Submission.deleteMany({ userId: req.user._id });
    
    // Delete user's chat history
    await ChatHistory.deleteMany({ userId: req.user._id });
    
    // Delete user's code explanations
    await CodeExplanation.deleteMany({ userId: req.user._id });

    // Delete discussions model if it exists
    try {
      const Discussion = require('../models/Discussion');
      await Discussion.deleteMany({ author: req.user._id });
    } catch (e) {
      // Discussion model might not exist
      console.log('Discussion model not found, skipping...');
    }

    // Finally, delete the user
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
