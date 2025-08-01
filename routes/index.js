const express = require('express');
const router = express.Router();
const indexController = require('../src/controllers/indexController');

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Information]
 *     summary: API Home
 *     description: Welcome page with basic API information and navigation links
 *     responses:
 *       200:
 *         description: Welcome message with API endpoints
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Welcome to Colors Express App!'
 *                     status:
 *                       type: string
 *                       example: 'success'
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     endpoints:
 *                       type: object
 *                       properties:
 *                         home:
 *                           type: string
 *                           example: '/'
 *                         health:
 *                           type: string
 *                           example: '/health'
 *                         api:
 *                           type: string
 *                           example: '/api'
 */
router.get('/', indexController.getHome);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Information]
 *     summary: Health Check
 *     description: Check server health, uptime, and memory usage
 *     responses:
 *       200:
 *         description: Server health information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: 'OK'
 *                     uptime:
 *                       type: number
 *                       description: 'Server uptime in seconds'
 *                       example: 3600.123
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     memory:
 *                       type: object
 *                       properties:
 *                         rss:
 *                           type: number
 *                           description: 'Resident Set Size'
 *                         heapTotal:
 *                           type: number
 *                           description: 'Total heap memory'
 *                         heapUsed:
 *                           type: number
 *                           description: 'Used heap memory'
 *                         external:
 *                           type: number
 *                           description: 'External memory'
 *                         arrayBuffers:
 *                           type: number
 *                           description: 'Array buffers memory'
 */
router.get('/health', indexController.getHealth);

/**
 * @swagger
 * /api:
 *   get:
 *     tags: [Information]
 *     summary: API Information
 *     description: Complete API information including features, endpoints, and usage examples
 *     responses:
 *       200:
 *         description: Complete API documentation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: 'Colors API'
 *                 version:
 *                   type: string
 *                   example: '1.0.0'
 *                 description:
 *                   type: string
 *                   example: 'Express.js API for comprehensive color system generation'
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: 
 *                     - 'Secondary color suggestions based on color theory'
 *                     - 'Complete color system generation'
 *                     - 'Advanced theme options (Gray & Background)'
 *                     - 'Multiple export formats (CSS, SCSS, JSON, Figma, Tailwind, CSV)'
 *                     - 'Session-based color system caching'
 *                     - 'WCAG accessibility compliance'
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     general:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           method:
 *                             type: string
 *                           path:
 *                             type: string
 *                           description:
 *                             type: string
 *                     colors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           method:
 *                             type: string
 *                           path:
 *                             type: string
 *                           description:
 *                             type: string
 *                 examples:
 *                   type: object
 *                   properties:
 *                     suggestions:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         body:
 *                           type: object
 *                     generate:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         body:
 *                           type: object
 *                     export:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 */
router.get('/api', indexController.getApiInfo);

module.exports = router;