/**
 * Validation Middleware for Color API
 * Validates hex colors, themes, and other parameters
 */

const { isValidHexColor } = require('../src/services/colorService');

// Validate hex color format
const validateHexColor = (value, fieldName) => {
  if (!value) {
    return `${fieldName} is required`;
  }
  
  if (!isValidHexColor(value)) {
    return `${fieldName} must be a valid hex color (e.g., #FF5733)`;
  }
  
  return null;
};

// Validate theme options
const validateTheme = (value, fieldName) => {
  const validThemes = ['auto', 'blue', 'green-brown', 'black', 'neutral'];
  
  if (value && !validThemes.includes(value)) {
    return `${fieldName} must be one of: ${validThemes.join(', ')}`;
  }
  
  return null;
};

// Validate export format
const validateExportFormat = (format) => {
  const validFormats = ['css', 'scss', 'json', 'figma', 'tailwind', 'csv'];
  
  if (!format) {
    return 'Export format is required';
  }
  
  if (!validFormats.includes(format.toLowerCase())) {
    return `Export format must be one of: ${validFormats.join(', ')}`;
  }
  
  return null;
};

// Middleware to validate color suggestions request
const validateColorSuggestionsRequest = (req, res, next) => {
  const errors = [];
  const { primaryColor } = req.body;
  
  // Validate primary color
  const primaryError = validateHexColor(primaryColor, 'primaryColor');
  if (primaryError) {
    errors.push(primaryError);
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Middleware to validate color generation request
const validateColorGenerationRequest = (req, res, next) => {
  const errors = [];
  const { primaryColor, secondaryColor, grayTheme, backgroundTheme } = req.body;
  
  // Validate primary color
  const primaryError = validateHexColor(primaryColor, 'primaryColor');
  if (primaryError) {
    errors.push(primaryError);
  }
  
  // Validate secondary color
  const secondaryError = validateHexColor(secondaryColor, 'secondaryColor');
  if (secondaryError) {
    errors.push(secondaryError);
  }
  
  // Validate gray theme (optional)
  if (grayTheme) {
    const grayThemeError = validateTheme(grayTheme, 'grayTheme');
    if (grayThemeError) {
      errors.push(grayThemeError);
    }
  }
  
  // Validate background theme (optional)
  if (backgroundTheme) {
    const backgroundThemeError = validateTheme(backgroundTheme, 'backgroundTheme');
    if (backgroundThemeError) {
      errors.push(backgroundThemeError);
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Middleware to validate export request
const validateExportRequest = (req, res, next) => {
  const errors = [];
  const { format } = req.params;
  const { sessionId, prefix, caseStyle, mode, structure } = req.query;
  
  // Validate format
  const formatError = validateExportFormat(format);
  if (formatError) {
    errors.push(formatError);
  }
  
  // Validate sessionId (required)
  if (!sessionId) {
    errors.push('sessionId parameter is required');
  }
  
  // Validate prefix (optional, but if provided should be alphanumeric)
  if (prefix && !/^[a-zA-Z0-9\-_]*$/.test(prefix)) {
    errors.push('prefix must contain only letters, numbers, hyphens, and underscores');
  }
  
  // Validate caseStyle (optional)
  if (caseStyle && !['camelCase', 'snake_case'].includes(caseStyle)) {
    errors.push('caseStyle must be either "camelCase" or "snake_case"');
  }
  
  // Validate mode (optional)
  if (mode && !['light', 'dark', 'both'].includes(mode)) {
    errors.push('mode must be one of: light, dark, both');
  }
  
  // Validate structure for JSON format (optional)
  if (format === 'json' && structure && !['sections', 'themes'].includes(structure)) {
    errors.push('structure must be either "sections" or "themes" for JSON format');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// General error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle known error types
  if (err.message && err.message.includes('Invalid hex color')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid color format',
      message: err.message
    });
  }
  
  if (err.message && err.message.includes('Unsupported export format')) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported format',
      message: err.message
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = {
  validateColorSuggestionsRequest,
  validateColorGenerationRequest,
  validateExportRequest,
  errorHandler,
  validateHexColor,
  validateTheme,
  validateExportFormat
};