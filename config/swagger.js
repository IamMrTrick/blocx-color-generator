/**
 * Swagger Configuration
 * Complete OpenAPI 3.0 specification for Colors API
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Colors API',
      version: '1.0.0',
      description: `
# 🎨 Colors API - Advanced Color System Generator

A comprehensive API for generating professional color systems based on color theory and accessibility principles.

## 🌟 Features

- **Smart Color Suggestions**: Generate 3 secondary color suggestions using color theory
- **Complete Color Systems**: Generate 66+ colors including semantic, component, and utility colors
- **Advanced Themes**: 5 different gray and background theme options
- **Multiple Export Formats**: CSS, SCSS, JSON, Figma, Tailwind, CSV
- **Session Management**: Cache color systems for easy retrieval and export
- **WCAG Compliance**: All colors generated with accessibility in mind

## 🚀 Quick Start

1. **Get Suggestions**: Send your primary color to get 3 secondary suggestions
2. **Generate System**: Create a complete color system with your chosen colors
3. **Export**: Download your color system in your preferred format

## 📊 Color System Structure

Each generated color system includes:
- **Base Colors**: Pure black and white
- **Primary Colors**: 10 shades of your primary color
- **Secondary Colors**: 10 shades of your secondary color  
- **Gray Colors**: 10 shades optimized for your theme
- **Semantic Colors**: Error, Warning, Success, Info (8 shades each)

Total: **66+ carefully crafted colors** ready for production use.
      `,
      contact: {
        name: 'Colors API Support',
        email: 'support@colorsapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'http://colors.mrtrick.me',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Color Generation',
        description: 'Generate color suggestions and complete color systems'
      },
      {
        name: 'Export',
        description: 'Export color systems in various formats'
      },
      {
        name: 'Session Management',
        description: 'Manage cached color systems'
      },
      {
        name: 'Information',
        description: 'Get information about formats, themes, and system status'
      }
    ],
    components: {
      schemas: {
        ColorShade: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the color shade',
              example: 'primary-05'
            },
            light: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
              description: 'Hex color for light mode',
              example: '#3B82F6'
            },
            dark: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
              description: 'Hex color for dark mode',
              example: '#1E40AF'
            },
            description: {
              type: 'string',
              description: 'Description of the color shade',
              example: 'Primary color shade 05'
            }
          },
          required: ['name', 'light', 'dark', 'description']
        },
        ColorSuggestion: {
          type: 'object',
          properties: {
            color: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
              description: 'Suggested hex color',
              example: '#10B981'
            },
            name: {
              type: 'string',
              description: 'Color theory name',
              example: 'Complementary'
            },
            description: {
              type: 'string',
              description: 'Description of color relationship',
              example: 'High contrast, professional'
            }
          },
          required: ['color', 'name', 'description']
        },
        ColorSystem: {
          type: 'object',
          properties: {
            base: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Base colors (black, white)'
            },
            primary: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Primary color shades (10 variants)'
            },
            secondary: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Secondary color shades (10 variants)'
            },
            gray: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Gray color shades (10 variants)'
            },
            error: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Error color shades (8 variants)'
            },
            warning: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Warning color shades (8 variants)'
            },
            success: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Success color shades (8 variants)'
            },
            info: {
              type: 'array',
              items: { $ref: '#/components/schemas/ColorShade' },
              description: 'Info color shades (8 variants)'
            },
            metadata: {
              type: 'object',
              properties: {
                primaryColor: { type: 'string', example: '#3B82F6' },
                secondaryColor: { type: 'string', example: '#10B981' },
                grayTheme: { type: 'string', example: 'blue' },
                backgroundTheme: { type: 'string', example: 'auto' },
                generatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        ExportFormat: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Format identifier',
              example: 'css'
            },
            name: {
              type: 'string',
              description: 'Human-readable format name',
              example: 'CSS Variables'
            },
            description: {
              type: 'string',
              description: 'Format description',
              example: 'CSS custom properties with light/dark mode support'
            },
            extension: {
              type: 'string',
              description: 'File extension',
              example: '.css'
            },
            contentType: {
              type: 'string',
              description: 'MIME content type',
              example: 'text/css'
            }
          }
        },
        Theme: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Theme identifier',
              example: 'blue'
            },
            name: {
              type: 'string',
              description: 'Human-readable theme name',
              example: 'Blue Grays'
            },
            description: {
              type: 'string',
              description: 'Theme description',
              example: 'Cool professional tone'
            },
            icon: {
              type: 'string',
              description: 'Emoji icon',
              example: '❄️'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'string',
              description: 'Error message (if success is false)'
            },
            details: {
              type: 'array',
              items: { type: 'string' },
              description: 'Detailed error messages (validation errors)'
            }
          },
          required: ['success']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Validation failed'
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid hex color format'
            },
            details: {
              type: 'array',
              items: { type: 'string' },
              description: 'Detailed error messages',
              example: ['primaryColor must be a valid hex color (e.g., #FF5733)']
            }
          },
          required: ['success', 'error']
        }
      },
      parameters: {
        sessionId: {
          name: 'sessionId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Session ID from color generation',
          example: 'session_1736351820123_abc123'
        },
        format: {
          name: 'format',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['css', 'scss', 'json', 'figma', 'tailwind', 'csv']
          },
          description: 'Export format',
          example: 'css'
        },
        prefix: {
          name: 'prefix',
          in: 'query',
          required: false,
          schema: { type: 'string', pattern: '^[a-zA-Z0-9-_]+$' },
          description: 'Optional prefix for variable names',
          example: 'my-app'
        }
      },
      requestBodies: {
        ColorSuggestionsRequest: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  primaryColor: {
                    type: 'string',
                    pattern: '^#[0-9A-Fa-f]{6}$',
                    description: 'Primary color in hex format',
                    example: '#3B82F6'
                  }
                },
                required: ['primaryColor']
              }
            }
          }
        },
        ColorGenerationRequest: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  primaryColor: {
                    type: 'string',
                    pattern: '^#[0-9A-Fa-f]{6}$',
                    description: 'Primary color in hex format',
                    example: '#3B82F6'
                  },
                  secondaryColor: {
                    type: 'string',
                    pattern: '^#[0-9A-Fa-f]{6}$',
                    description: 'Secondary color in hex format',
                    example: '#10B981'
                  },
                  grayTheme: {
                    type: 'string',
                    enum: ['auto', 'blue', 'green-brown', 'black', 'neutral'],
                    description: 'Gray color theme',
                    example: 'blue',
                    default: 'auto'
                  },
                  backgroundTheme: {
                    type: 'string',
                    enum: ['auto', 'blue', 'green-brown', 'black', 'neutral'],
                    description: 'Background color theme',
                    example: 'auto',
                    default: 'auto'
                  },
                  sessionId: {
                    type: 'string',
                    description: 'Optional custom session ID',
                    example: 'my-custom-session'
                  }
                },
                required: ['primaryColor', 'secondaryColor']
              }
            }
          }
        }
      }
    },
    paths: {}
  },
  apis: [
    './routes/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;