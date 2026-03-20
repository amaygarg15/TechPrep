const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// ─── Security Middleware ───
app.use(helmet());
app.use(cors());

// ─── Body Parsing ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Documentation ───
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TechPrep API Documentation',
}));

// ─── Health Check (public) ───
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TechPrep API is running',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/auth/profile',
      plan: '/select-plan',
      questions: '/questions',
      questionById: '/questions/:id',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───
// All routes below are protected via Firebase token verification in their middleware
app.use('/auth', authRoutes);
app.use('/select-plan', planRoutes);
app.use('/questions', questionRoutes);

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
