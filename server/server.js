import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/login-system';

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running (MongoDB)');
});

import { MongoMemoryServer } from 'mongodb-memory-server';

// Connect to MongoDB and Start Server
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB at', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Local MongoDB connection failed:', err.message);
    console.log('Falling back to in-memory MongoDB...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log('In-memory MongoDB started at', uri);
      await mongoose.connect(uri);
      console.log('In-memory MongoDB connected. Note: Data will be lost on restart.');
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr);
    }
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
