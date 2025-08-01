/**
 * Index Controller
 * Handle general endpoints
 */

/**
 * Home page handler
 */
const getHome = (req, res) => {
  res.json({
    message: 'Welcome to Colors Express App!',
    status: 'success',
    timestamp: new Date().toISOString(),
    endpoints: {
      home: '/',
      health: '/health',
      api: '/api'
    }
  });
};

/**
 * Health check handler
 */
const getHealth = (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
};

/**
 * API information handler
 */
const getApiInfo = (req, res) => {
  res.json({
    name: 'Colors API',
    version: '1.0.0',
    description: 'Express.js API for comprehensive color system generation',
    features: [
      'Secondary color suggestions based on color theory',
      'Complete color system generation',
      'Advanced theme options (Gray & Background)',
      'Multiple export formats (CSS, SCSS, JSON, Figma, Tailwind, CSV)',
      'Session-based color system caching',
      'WCAG accessibility compliance'
    ],
    endpoints: {
      general: [
        { method: 'GET', path: '/', description: 'Home endpoint' },
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/api', description: 'API information' }
      ],
      colors: [
        { method: 'POST', path: '/api/colors/suggestions', description: 'Generate secondary color suggestions' },
        { method: 'POST', path: '/api/colors/generate', description: 'Generate complete color system' },
        { method: 'GET', path: '/api/colors/export/:format', description: 'Export color system in specified format' },
        { method: 'GET', path: '/api/colors/session/:sessionId', description: 'Get cached color system' },
        { method: 'GET', path: '/api/colors/formats', description: 'Get available export formats' },
        { method: 'GET', path: '/api/colors/themes', description: 'Get available theme options' },
        { method: 'DELETE', path: '/api/colors/session/:sessionId', description: 'Delete cached session' }
      ]
    },
    examples: {
      suggestions: {
        url: 'POST /api/colors/suggestions',
        body: { primaryColor: '#3B82F6' }
      },
      generate: {
        url: 'POST /api/colors/generate',
        body: { 
          primaryColor: '#3B82F6', 
          secondaryColor: '#10B981',
          grayTheme: 'blue',
          backgroundTheme: 'auto'
        }
      },
      export: {
        url: 'GET /api/colors/export/css?sessionId=session_123&prefix=my-app'
      }
    }
  });
};

module.exports = {
  getHome,
  getHealth,
  getApiInfo
};