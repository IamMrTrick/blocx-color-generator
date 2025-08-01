const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');

// Import routes
const indexRoutes = require('../routes/index');
const colorRoutes = require('../routes/colors');

// Import middleware
const logger = require('../middleware/logger');
const { errorHandler } = require('../middleware/validation');

const app = express();

// CORS configuration for frontend integration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Custom middleware
app.use(logger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .info hgroup.main { margin: 0 0 20px 0 }
    .swagger-ui .info .title { color: #667eea; font-size: 36px; }
    .swagger-ui .scheme-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; padding: 15px; border-radius: 10px; }
    .swagger-ui .scheme-container .schemes > label { color: white; }
    .swagger-ui .btn.authorize { background: #667eea; border-color: #667eea; }
    .swagger-ui .btn.authorize:hover { background: #764ba2; border-color: #764ba2; }
  `,
  customSiteTitle: 'Colors API Documentation',
  customfavIcon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8cGF0aCBkPSJNOCAxNkw5LjUgMTcuNUwxMyAxNEwxNC41IDE1LjVMMTggMTJMMTkuNSAxMy41TDIzIDEwTDI0IDExTDIwLjUgMTQuNUwxOSAxNkwyMC41IDE3LjVMMjQgMjFMMjMgMjJMMTkuNSAxOC41TDE4IDIwTDE0LjUgMTYuNUwxMyAxOEw5LjUgMTQuNUw4IDE2WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCIgeTE9IjAiIHgyPSIzMiIgeTI9IjMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2NjdFRUEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzY0QkEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=='
}));

// API Routes
app.use('/api/colors', colorRoutes);

// Basic routes
app.use('/', indexRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      colors: {
        suggestions: 'POST /api/colors/suggestions',
        generate: 'POST /api/colors/generate',
        export: 'GET /api/colors/export/:format',
        session: 'GET /api/colors/session/:sessionId',
        formats: 'GET /api/colors/formats',
        themes: 'GET /api/colors/themes'
      },
      general: {
        home: 'GET /',
        health: 'GET /health'
      }
    }
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;