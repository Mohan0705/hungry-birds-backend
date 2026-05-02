require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const menuRoutes = require('./routes/menu.js');
const orderRoutes = require('./routes/orders.js');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Hungry Birds API is live 🍗',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Database & Start ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hungry-birds', {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
