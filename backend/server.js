import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import middleware
import { requestLogger } from './src/middleware/requestLogger.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import subscriptionRoutes from './src/routes/subscriptions.js';
import membershipRoutes from './src/routes/memberships.js';
import billRoutes from './src/routes/bills.js';
import creditCardRoutes from './src/routes/creditCards.js';
import loanRoutes from './src/routes/loans.js';
import settingsRoutes from './src/routes/settings.js';
import notificationRoutes from './src/routes/notifications.js';
import analyticsRoutes from './src/routes/analytics.js';
import quotesRoutes from './src/routes/quotes.js';

// Import database initialization
import { initDatabase } from './src/config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/creditcards', creditCardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quotes', quotesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 GlassFlow API server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
