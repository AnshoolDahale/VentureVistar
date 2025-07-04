const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const router = express.Router();

// Store reset tokens temporarily (in production, use Redis or database)
const resetTokens = new Map();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, userType });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const user = await User.findOne({ email, userType });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password - Send Reset Code
router.post('/forgot-password', async (req, res) => {
  const { email, userType } = req.body;
  try {
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the reset code with expiration (15 minutes)
    const resetKey = `${email}_${userType}`;
    resetTokens.set(resetKey, {
      code: resetCode,
      userId: user._id,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // In production, send email here
    // For now, we'll just log it (in demo mode, frontend shows the code)
    console.log(`🔐 Password reset code for ${email} (${userType}): ${resetCode}`);
    
    // Simulate email sending
    setTimeout(() => {
      console.log(`📧 Email sent to ${email}: Your password reset code is ${resetCode}`);
    }, 1000);

    res.json({ 
      message: 'Reset code sent to your email',
      // In production, don't send the code in response
      // For demo purposes, we include it
      demoCode: resetCode 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify Reset Token
router.post('/verify-reset-token', async (req, res) => {
  const { email, token, userType } = req.body;
  try {
    const resetKey = `${email}_${userType}`;
    const resetData = resetTokens.get(resetKey);

    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(resetKey);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    if (resetData.code !== token) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    res.json({ message: 'Reset code verified successfully' });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword, userType } = req.body;
  try {
    const resetKey = `${email}_${userType}`;
    const resetData = resetTokens.get(resetKey);

    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(resetKey);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    if (resetData.code !== token) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Find user and update password
    const user = await User.findById(resetData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password (the User model should hash it automatically)
    user.password = newPassword;
    await user.save();

    // Clear the reset token
    resetTokens.delete(resetKey);

    console.log(`✅ Password successfully reset for ${email} (${userType})`);

    res.json({ 
      message: 'Password reset successfully',
      success: true 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 