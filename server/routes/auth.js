const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    console.log('Existing user check:', existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();
    console.log('New user created:', user._id);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Create initial admin account
router.post('/create-admin', async (req, res) => {
  try {
    const { adminSecret, email, password, name } = req.body;

    // Verify admin secret key
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      email,
      password: hashedPassword,
      name,
      isAdmin: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error during admin creation' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password, isAdmin } = req.body;

    // Find user and check if they match the requested login type
    const user = await User.findOne({ email });
    console.log('User found:', !!user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate admin access
    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized for admin access' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token with user info and admin status
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Longer expiration for admin sessions
    );
    
    // Include _id in the response
    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin // Add isAdmin to response
    };
    
    console.log('Login successful:', {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    });
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token route
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the email doesn't exist for security
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token to user (expires in 1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // In production, you would send an email here
    if (process.env.NODE_ENV !== 'production') {
      console.log('Password reset URL:', resetUrl);
      console.log('Reset token:', resetToken);
    }

    // For now, just return success (in production, send email)
    res.json({ 
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token from URL
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
