import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

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

    // Important: don't reveal if user exists
    if (!user) {
      return res.json({ message: 'If email exists, reset link sent' });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: '10m' }
    );

    // DEV MODE: return token so frontend can redirect
    res.json({
      message: 'Reset token generated',
      resetToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and password required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: decoded.email },
      { password: hashedPassword }
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid or expired token' });
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
