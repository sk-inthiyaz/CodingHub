require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const explainRoutes = require('./routes/explainRoute');
const chatHistoryRoutes = require('./routes/chatHistory');
const tutorialRoutes = require('./routes/tutorialRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testApiRoute = require('./routes/testApiRoute');
const adminRoutes = require('./routes/adminRoutes');
const streakRoutes = require('./routes/streakRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const profileRoutes = require('./routes/profileRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const app = express();

// CORS Configuration — restrict to your frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// JSON body parser with size limit (express.json IS body-parser, no need for both)
app.use(express.json({ limit: "10mb" }));

// Debug logging middleware — ONLY in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });
}

const initializeAdmin = require('./utils/initAdmin');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(async () => {
  console.log('MongoDB connected successfully');
  console.log('Connected to database:', mongoose.connection.name);
  // Initialize admin user
  await initializeAdmin();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  if (err.code === 'ECONNREFUSED') {
    console.error('Make sure MongoDB is running on your machine');
  }
});

// Routes Configuration
app.use('/api/auth', authRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/chat-history', chatHistoryRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/test', testApiRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api', submissionRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Global error handler — catches unhandled errors and prevents raw HTML stack traces
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});