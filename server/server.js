import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import maintenanceRoutes from './routes/maintenance.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import workCentreRoutes from './routes/workCentreRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE TOGGLE ---
const USE_LOCAL_DB = false; // Set to true for local MongoDB, false for Atlas
// -----------------------

// MongoDB Atlas connection string from .env
const MONGO_URI_ATLAS = process.env.MONGO_URI;
const MONGO_URI_LOCAL = 'mongodb://localhost:27017/gearguard';

const MONGO_URI = USE_LOCAL_DB ? MONGO_URI_LOCAL : MONGO_URI_ATLAS;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set! Check .env or toggle settings.');
  process.exit(1);
}

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://gear-guard-the-ultimate-maintenance-gamma.vercel.app'],
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/teams', teamRoutes);
app.use('/work-centres', workCentreRoutes);
app.use('/equipment-categories', categoryRoutes);

// Health check
app.get('/', (req, res) => {
  res.send(`API is running (MongoDB ${USE_LOCAL_DB ? 'Local' : 'Atlas'})`);
});

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected (${USE_LOCAL_DB ? 'Local' : 'Atlas'})`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Do not exit process in serverless environment
  }
};

connectDB();

app.get('/', (req, res) => {
    res.send('GearGuard API is running');
});



export default app;
