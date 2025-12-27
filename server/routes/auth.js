import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import sendEmail from '../utils/emailService.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_12345';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Mongoose: findOne({ email }) instead of findOne({ where: { email } })
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Mongoose: create returns the doc directly
    const user = await User.create({ email, name, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Note: Mongoose uses _id
    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If email exists, OTP sent' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiry (10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email
    await sendEmail(
      user.email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('Debug Reset:', {
      storedOtp: user.resetPasswordOtp,
      receivedOtp: otp,
      expiry: user.resetPasswordExpires,
      now: new Date(),
      types: {
        stored: typeof user.resetPasswordOtp,
        received: typeof otp
      }
    });

    // Robust comparison: ensure strings and trim whitespace
    const storedOtp = (user.resetPasswordOtp || '').toString().trim();
    const receivedOtp = (otp || '').toString().trim();

    if (storedOtp !== receivedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Expired OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// GET /auth/profile (Protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Mongoose: findById instead of findByPk
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) return res.sendStatus(404);

    // Transform to match previous API response format roughly, though _id is standard in Mongo
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});




export default router;
