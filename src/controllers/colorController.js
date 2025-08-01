/**
 * Color Controller
 * Handle all color-related business logic
 */

const { 
  generateSecondaryColorSuggestions, 
  generateCompleteColorSystem 
} = require('../services/colorService');
const { exportColorSystem, getAvailableExportFormats } = require('../services/exportService');

// Store generated color systems temporarily (in production, use Redis or database)
const colorSystemCache = new Map();

/**
 * Generate secondary color suggestions
 */
const getSuggestions = async (req, res, next) => {
  try {
    const { primaryColor } = req.body;
    
    console.log(`🎨 Generating color suggestions for primary: ${primaryColor}`);
    
    const suggestions = generateSecondaryColorSuggestions(primaryColor);
    
    res.json({
      success: true,
      data: {
        primaryColor,
        suggestions,
        generatedAt: new Date().toISOString()
      }
    });
    
    console.log(`✅ Generated ${suggestions.length} color suggestions`);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Generate complete color system
 */
const generateColors = async (req, res, next) => {
  try {
    const { 
      primaryColor, 
      secondaryColor, 
      grayTheme = 'auto', 
      backgroundTheme = 'auto',
      sessionId 
    } = req.body;
    
    console.log(`🎨 Generating complete color system:`);
    console.log(`   Primary: ${primaryColor}`);
    console.log(`   Secondary: ${secondaryColor}`);
    console.log(`   Gray Theme: ${grayTheme}`);
    console.log(`   Background Theme: ${backgroundTheme}`);
    
    const colorSystem = generateCompleteColorSystem(primaryColor, secondaryColor, {
      grayTheme,
      backgroundTheme
    });
    
    // Generate a unique session ID if not provided
    const id = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Cache the generated color system for export
    colorSystemCache.set(id, {
      colorSystem,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });
    
    // Clean up expired entries
    cleanupExpiredSessions();
    
    res.json({
      success: true,
      data: {
        sessionId: id,
        colorSystem,
        stats: {
          totalColors: getTotalColorCount(colorSystem),
          sections: Object.keys(colorSystem).filter(key => key !== 'metadata').length,
          generatedAt: colorSystem.metadata.generatedAt
        }
      }
    });
    
    console.log(`✅ Generated complete color system with ID: ${id}`);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Export color system in specified format
 */
const exportColors = async (req, res, next) => {
  try {
    const { format } = req.params;
    const { 
      sessionId, 
      prefix = '--', 
      caseStyle = 'snake_case',
      mode = 'both',
      structure = 'sections'
    } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required',
        message: 'Please provide a sessionId from a previous color generation'
      });
    }
    
    const cachedData = colorSystemCache.get(sessionId);
    
    if (!cachedData) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Color system session not found or has expired. Please generate colors first.'
      });
    }
    
    console.log(`📦 Exporting color system as ${format.toUpperCase()} for session: ${sessionId}`);
    console.log(`🔧 Export options: prefix="${prefix}", caseStyle="${caseStyle}", mode="${mode}", structure="${structure}"`);
    
    // Prepare export options
    const exportOptions = {
      prefix,
      caseStyle,
      mode,
      structure
    };
    
    const exportedContent = exportColorSystem(cachedData.colorSystem, format, exportOptions);
    
    // Get format info for proper headers
    const formats = getAvailableExportFormats();
    const formatInfo = formats.find(f => f.id === format);
    
    if (!formatInfo) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format',
        message: `Format ${format} is not supported`
      });
    }
    
    // Generate filename based on options
    let filename = `colors-${mode}`;
    if (format === 'json' && structure) {
      filename += `-${structure}`;
    }
    if (caseStyle === 'camelCase') {
      filename += '-camelCase';
    }
    filename += formatInfo.extension;
    
    // Set appropriate headers for download
    res.setHeader('Content-Type', formatInfo.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(exportedContent);
    
    console.log(`✅ Successfully exported ${format.toUpperCase()} file: ${filename}`);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get cached color system by session ID
 */
const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    const cachedData = colorSystemCache.get(sessionId);
    
    if (!cachedData) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Color system session not found or has expired'
      });
    }
    
    res.json({
      success: true,
      data: {
        sessionId,
        colorSystem: cachedData.colorSystem,
        generatedAt: cachedData.generatedAt,
        expiresAt: cachedData.expiresAt,
        stats: {
          totalColors: getTotalColorCount(cachedData.colorSystem),
          sections: Object.keys(cachedData.colorSystem).filter(key => key !== 'metadata').length
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get available export formats
 */
const getFormats = (req, res) => {
  const formats = [
    {
      id: 'css',
      name: 'CSS Variables',
      description: 'CSS custom properties with light/dark mode support',
      extension: '.css',
      contentType: 'text/css'
    },
    {
      id: 'scss',
      name: 'SCSS Variables',
      description: 'Sass variables with color maps and utilities',
      extension: '.scss',
      contentType: 'text/scss'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Structured JSON format for programmatic use',
      extension: '.json',
      contentType: 'application/json'
    },
    {
      id: 'figma',
      name: 'Figma Tokens',
      description: 'Design tokens format compatible with Figma plugins',
      extension: '.json',
      contentType: 'application/json'
    },
    {
      id: 'tailwind',
      name: 'Tailwind Config',
      description: 'Tailwind CSS configuration file',
      extension: '.js',
      contentType: 'text/javascript'
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Spreadsheet-friendly format with all color data',
      extension: '.csv',
      contentType: 'text/csv'
    }
  ];
  
  res.json({
    success: true,
    data: {
      formats,
      totalFormats: formats.length
    }
  });
};

/**
 * Get available theme options
 */
const getThemes = (req, res) => {
  const themes = {
    grayThemes: [
      {
        id: 'auto',
        name: 'Smart Auto',
        description: 'Based on primary color',
        icon: '🔗'
      },
      {
        id: 'blue',
        name: 'Blue Grays',
        description: 'Cool professional tone',
        icon: '❄️'
      },
      {
        id: 'green-brown',
        name: 'Warm Earth',
        description: 'Brown & green undertones',
        icon: '🌿'
      },
      {
        id: 'black',
        name: 'Pure Black',
        description: 'Classic monochrome',
        icon: '⚫'
      },
      {
        id: 'neutral',
        name: 'Neutral Gray',
        description: 'Pure balanced grays',
        icon: '⚪'
      }
    ],
    backgroundThemes: [
      {
        id: 'auto',
        name: 'Smart Auto',
        description: 'Complementary harmony',
        icon: '🔗'
      },
      {
        id: 'blue',
        name: 'Deep Blue',
        description: 'Navy & midnight tones',
        icon: '🌊'
      },
      {
        id: 'green-brown',
        name: 'Earth Tones',
        description: 'Warm charcoal & brown',
        icon: '🏔️'
      },
      {
        id: 'black',
        name: 'Pure Black',
        description: 'Classic dark theme',
        icon: '🌚'
      },
      {
        id: 'neutral',
        name: 'Neutral Gray',
        description: 'Balanced dark grays',
        icon: '🌫️'
      }
    ]
  };
  
  res.json({
    success: true,
    data: themes
  });
};

/**
 * Delete cached color system
 */
const deleteSession = (req, res) => {
  const { sessionId } = req.params;
  
  const deleted = colorSystemCache.delete(sessionId);
  
  if (deleted) {
    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
};

// Utility functions
const getTotalColorCount = (colorSystem) => {
  let total = 0;
  Object.keys(colorSystem).forEach(key => {
    if (key !== 'metadata' && Array.isArray(colorSystem[key])) {
      total += colorSystem[key].length;
    }
  });
  return total;
};

const cleanupExpiredSessions = () => {
  const now = new Date();
  const expiredSessions = [];
  
  colorSystemCache.forEach((value, key) => {
    if (new Date(value.expiresAt) < now) {
      expiredSessions.push(key);
    }
  });
  
  expiredSessions.forEach(sessionId => {
    colorSystemCache.delete(sessionId);
  });
  
  if (expiredSessions.length > 0) {
    console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`);
  }
};

// Clean up expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
  getSuggestions,
  generateColors,
  exportColors,
  getSession,
  getFormats,
  getThemes,
  deleteSession
};