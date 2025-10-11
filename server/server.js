import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
dotenv.config();

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import bytelogRoutes from './routes/bytelogRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import courseContentRoutes from './routes/courseContentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import councilRoutes from './routes/councilRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://bytezendcac.tech',
  'https://www.bytezendcac.tech',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use('/bytelogs', express.static(path.join(__dirname, 'public', 'bytelogs')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/bytelogs', bytelogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/courses', courseContentRoutes); // Course content management
app.use('/api/progress', progressRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/students', studentRoutes); // Student management
app.use('/api/events', eventRoutes); // Events management
app.use('/api/insights', insightRoutes); // ByteLogs management
app.use('/api/partners', partnerRoutes); // Partners management
app.use('/api/council', councilRoutes); // Council management

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
