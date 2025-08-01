/**
 * Color API Routes
 * Route definitions for color-related endpoints
 */

const express = require('express');
const router = express.Router();
const colorController = require('../src/controllers/colorController');
const {
  validateColorSuggestionsRequest,
  validateColorGenerationRequest,
  validateExportRequest
} = require('../middleware/validation');

/**
 * @swagger
 * /api/colors/suggestions:
 *   post:
 *     tags: [Color Generation]
 *     summary: Generate secondary color suggestions
 *     description: Generate 3 secondary color suggestions based on a primary color using color theory principles (Complementary, Triadic, Split-Complementary)
 *     requestBody:
 *       $ref: '#/components/requestBodies/ColorSuggestionsRequest'
 *     responses:
 *       200:
 *         description: Color suggestions generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         primaryColor:
 *                           type: string
 *                           pattern: '^#[0-9A-Fa-f]{6}$'
 *                           example: '#3B82F6'
 *                         suggestions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ColorSuggestion'
 *                         generatedAt:
 *                           type: string
 *                           format: date-time
 *             example:
 *               success: true
 *               data:
 *                 primaryColor: '#3B82F6'
 *                 suggestions:
 *                   - color: '#F97316'
 *                     name: 'Complementary'
 *                     description: 'High contrast, professional'
 *                   - color: '#10B981'
 *                     name: 'Triadic'
 *                     description: 'Vibrant, creative energy'
 *                   - color: '#EF4444'
 *                     name: 'Split-Complementary'
 *                     description: 'Harmonious, sophisticated'
 *                 generatedAt: '2025-01-08T16:37:00.000Z'
 *       401:
 *         description: Unauthorized - Invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: 'Validation failed'
 *               details: ['primaryColor must be a valid hex color (e.g., #FF5733)']
 */
router.post('/suggestions', validateColorSuggestionsRequest, colorController.getSuggestions);

/**
 * @swagger
 * /api/colors/generate:
 *   post:
 *     tags: [Color Generation]
 *     summary: Generate complete color system
 *     description: Generate a complete color system with 66+ colors including primary, secondary, gray, and semantic colors with advanced theme options
 *     requestBody:
 *       $ref: '#/components/requestBodies/ColorGenerationRequest'
 *     responses:
 *       200:
 *         description: Color system generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sessionId:
 *                           type: string
 *                           description: 'Session ID for caching and export'
 *                           example: 'session_1736351820123_abc123'
 *                         colorSystem:
 *                           $ref: '#/components/schemas/ColorSystem'
 *                         stats:
 *                           type: object
 *                           properties:
 *                             totalColors:
 *                               type: integer
 *                               example: 66
 *                             sections:
 *                               type: integer
 *                               example: 8
 *                             generatedAt:
 *                               type: string
 *                               format: date-time
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generate', validateColorGenerationRequest, colorController.generateColors);

/**
 * @swagger
 * /api/colors/export/{format}:
 *   get:
 *     tags: [Export]
 *     summary: Export color system
 *     description: Export a cached color system in the specified format (CSS, SCSS, JSON, Figma, Tailwind, CSV)
 *     parameters:
 *       - $ref: '#/components/parameters/format'
 *       - name: sessionId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID from color generation
 *         example: session_1736351820123_abc123
 *       - $ref: '#/components/parameters/prefix'
 *       - name: caseStyle
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['camelCase', 'snake_case']
 *           default: 'snake_case'
 *         description: Variable naming convention
 *         example: snake_case
 *       - name: mode
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['light', 'dark', 'both']
 *           default: 'both'
 *         description: Color theme mode to export
 *         example: both
 *       - name: structure
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['sections', 'themes']
 *           default: 'sections'
 *         description: JSON structure type (only for JSON format)
 *         example: sections
 *     responses:
 *       200:
 *         description: Color system exported successfully
 *         content:
 *           text/css:
 *             schema:
 *               type: string
 *               description: CSS file with color variables
 *           text/scss:
 *             schema:
 *               type: string
 *               description: SCSS file with color variables
 *           application/json:
 *             schema:
 *               type: string
 *               description: JSON file with color data
 *           text/javascript:
 *             schema:
 *               type: string
 *               description: Tailwind config file
 *           text/csv:
 *             schema:
 *               type: string
 *               description: CSV file with color data
 *       400:
 *         description: Invalid request or missing session ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Session not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/export/:format', validateExportRequest, colorController.exportColors);

/**
 * @swagger
 * /api/colors/session/{sessionId}:
 *   get:
 *     tags: [Session Management]
 *     summary: Get cached color system
 *     description: Retrieve a cached color system by session ID
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     responses:
 *       200:
 *         description: Color system retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sessionId:
 *                           type: string
 *                         colorSystem:
 *                           $ref: '#/components/schemas/ColorSystem'
 *                         generatedAt:
 *                           type: string
 *                           format: date-time
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                         stats:
 *                           type: object
 *                           properties:
 *                             totalColors:
 *                               type: integer
 *                             sections:
 *                               type: integer
 *       404:
 *         description: Session not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags: [Session Management]
 *     summary: Delete cached color system
 *     description: Delete a cached color system by session ID
 *     parameters:
 *       - $ref: '#/components/parameters/sessionId'
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Session deleted successfully'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/session/:sessionId', colorController.getSession);

/**
 * @swagger
 * /api/colors/formats:
 *   get:
 *     tags: [Information]
 *     summary: Get available export formats
 *     description: Get a list of all available export formats with descriptions and file extensions
 *     responses:
 *       200:
 *         description: Export formats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         formats:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ExportFormat'
 *                         totalFormats:
 *                           type: integer
 *                           example: 6
 *             example:
 *               success: true
 *               data:
 *                 formats:
 *                   - id: 'css'
 *                     name: 'CSS Variables'
 *                     description: 'CSS custom properties with light/dark mode support'
 *                     extension: '.css'
 *                     contentType: 'text/css'
 *                 totalFormats: 6
 */
router.get('/formats', colorController.getFormats);

/**
 * @swagger
 * /api/colors/themes:
 *   get:
 *     tags: [Information]
 *     summary: Get available theme options
 *     description: Get available gray and background theme options for color generation
 *     responses:
 *       200:
 *         description: Theme options retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         grayThemes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Theme'
 *                         backgroundThemes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Theme'
 *             example:
 *               success: true
 *               data:
 *                 grayThemes:
 *                   - id: 'auto'
 *                     name: 'Smart Auto'
 *                     description: 'Based on primary color'
 *                     icon: '🔗'
 *                   - id: 'blue'
 *                     name: 'Blue Grays'
 *                     description: 'Cool professional tone'
 *                     icon: '❄️'
 *                 backgroundThemes:
 *                   - id: 'auto'
 *                     name: 'Smart Auto'
 *                     description: 'Complementary harmony'
 *                     icon: '🔗'
 */
router.get('/themes', colorController.getThemes);

router.delete('/session/:sessionId', colorController.deleteSession);

module.exports = router;