# 🎨 Colors API - Advanced Color System Generator

A comprehensive REST API for generating professional color systems based on color theory and accessibility principles. Transform a primary color into a complete design system with 292 carefully crafted colors across 26 categories.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18%2B-blue.svg)](https://expressjs.com/)
[![API Version](https://img.shields.io/badge/API%20Version-1.0.0-orange.svg)](#)

## 🌟 Features

### 🎯 **Smart Color Generation**
- **Color Suggestions**: Generate 3 intelligent secondary color suggestions using color theory (complementary, triadic, split-complementary)
- **Complete Color Systems**: Generate 292 colors across 26 categories including semantic, component, and utility colors
- **Advanced Themes**: 5 different gray shade options and 6 background theme variations

### 🎨 **Professional Color Categories**
- **Base Colors**: Pure black and white foundations
- **Primary & Secondary**: 10 shades each of your chosen colors
- **Gray System**: 10 optimized shades with theme variations
- **Semantic Colors**: Error, Warning, Success, Info (8 shades each)
- **Interface Elements**: Backgrounds, borders, cards, inputs (4 shades each)
- **Text & Icons**: Optimized contrast ratios (4 shades each)
- **Button Systems**: 7 button types with 16 colors each (background, text, icon, border)
- **Specialized Components**: Header, sidebar navigation, odds display
- **Transparency System**: 27 opacity variations

### 📤 **Multiple Export Formats**
- **CSS Variables**: Ready-to-use CSS custom properties
- **SCSS Variables**: Sass/SCSS variable declarations
- **JSON**: Structured data in two formats (sections/themes)
- **Figma Tokens**: Design tokens for Figma integration
- **Tailwind Config**: Tailwind CSS configuration
- **CSV**: Spreadsheet-compatible format

### ⚙️ **Advanced Export Options**
- **Custom Prefix**: Configurable variable prefix (default: `--`)
- **Naming Convention**: Choose between `snake_case` (default) or `camelCase`
- **Color Modes**: Export light, dark, or both themes
- **JSON Structure**: Choose between sections or themes organization

### 🔧 **Developer Features**
- **Session Management**: Cache generated color systems for easy retrieval
- **RESTful Design**: Clean, intuitive API endpoints
- **Comprehensive Documentation**: Interactive Swagger UI documentation
- **Input Validation**: Robust validation with clear error messages
- **CORS Support**: Ready for frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/colors-api.git
cd colors-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Access the API**
- **API Base URL**: `http://localhost:3001`
- **Documentation**: `http://localhost:3001`
- **Swagger UI**: `http://localhost:3001/api-docs`

## 📖 Usage

### Basic Workflow

1. **Get Color Suggestions**
```javascript
// Get 3 secondary color suggestions
const response = await fetch('http://localhost:3001/api/colors/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ primaryColor: '#3B82F6' })
});
const suggestions = await response.json();
```

2. **Generate Complete Color System**
```javascript
// Generate full color system
const colorSystem = await fetch('http://localhost:3001/api/colors/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    grayTheme: 'Smart Auto',
    backgroundTheme: 'Smart Auto'
  })
});
const result = await colorSystem.json();
const sessionId = result.sessionId;
```

3. **Export in Your Preferred Format**
```javascript
// Export as CSS Variables
const cssExport = await fetch(`http://localhost:3001/api/colors/export/css?sessionId=${sessionId}&prefix=--&caseStyle=snake_case&mode=both`);
const cssContent = await cssExport.text();

// Export as JSON
const jsonExport = await fetch(`http://localhost:3001/api/colors/export/json?sessionId=${sessionId}&structure=sections&caseStyle=snake_case&mode=both`);
const jsonContent = await jsonExport.json();
```

## 🔗 API Endpoints

### Color Generation
- `POST /api/colors/suggestions` - Get secondary color suggestions
- `POST /api/colors/generate` - Generate complete color system

### Export & Download
- `GET /api/colors/export/{format}` - Export color system
  - Formats: `css`, `scss`, `json`, `figma`, `tailwind`, `csv`
  - Query params: `sessionId`, `prefix`, `caseStyle`, `mode`, `structure`

### Session Management
- `GET /api/colors/session/{sessionId}` - Retrieve cached color system

### Information
- `GET /api/colors/formats` - Available export formats
- `GET /api/colors/themes` - Available theme options
- `GET /api/health` - Health check
- `GET /api` - API information

## 🎨 Theme Options

### Gray Shade Themes
- **Smart Auto**: Automatically optimized based on primary color
- **Blue Grays**: Cool, professional tone
- **Warm Earth**: Brown & green undertones
- **Pure Black**: Classic monochrome
- **Neutral Gray**: Pure balanced grays

### Background Themes
- **Smart Auto**: Complementary harmony
- **Deep Blue**: Navy & midnight tones
- **Earth Tones**: Warm charcoal & brown
- **Pure Black**: Classic dark theme
- **Neutral Gray**: Balanced dark grays

## 📁 Project Structure

```
colors-api/
├── 📄 package.json           # Dependencies and scripts
├── 📄 server.js             # Application entry point
├── 📁 config/
│   ├── config.js            # Server configuration
│   └── swagger.js           # Swagger/OpenAPI specification
├── 📁 src/
│   ├── app.js              # Express application setup
│   ├── 📁 controllers/      # Request handlers
│   │   ├── colorController.js
│   │   └── indexController.js
│   └── 📁 services/         # Business logic
│       ├── colorService.js  # Color generation algorithms
│       └── exportService.js # Export format handlers
├── 📁 routes/              # API route definitions
│   ├── colors.js
│   └── index.js
├── 📁 middleware/          # Custom middleware
│   ├── logger.js
│   └── validation.js
└── 📁 public/              # Static files
    └── index.html          # API documentation page
```

## 🛠️ Technologies Used

- **Backend Framework**: Express.js 4.18+
- **Runtime**: Node.js 16+
- **Documentation**: Swagger UI with OpenAPI 3.0
- **Color Theory**: HSL color space calculations
- **Input Validation**: Custom middleware with comprehensive error handling
- **Development**: Nodemon for hot reloading

## 🎯 Color System Details

### Generated Color Count
- **Total Colors**: 292 colors across 26 categories
- **Color Modes**: Light and dark theme variants
- **Accessibility**: WCAG-compliant contrast ratios

### Color Categories
1. **Base** (2 colors): Black, White
2. **Primary** (10 colors): 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
3. **Secondary** (10 colors): Same shade structure
4. **Gray** (10 colors): Theme-optimized shades
5. **Error** (8 colors): Semantic error states
6. **Warning** (8 colors): Semantic warning states
7. **Success** (8 colors): Semantic success states
8. **Info** (8 colors): Semantic info states
9. **Interface Backgrounds** (4 colors): App, page, card, overlay
10. **Text** (4 colors): Primary, secondary, tertiary, disabled
11. **Icons** (4 colors): Primary, secondary, tertiary, disabled
12. **Borders** (4 colors): Default, hover, focus, disabled
13. **Cards** (4 colors): Background, border, shadow, hover
14. **Inputs** (4 colors): Background, border, focus, disabled
15. **Primary Buttons** (16 colors): 4×4 matrix (bg, text, icon, border)
16. **Secondary Buttons** (16 colors): 4×4 matrix
17. **Tertiary Buttons** (16 colors): 4×4 matrix
18. **Quaternary Buttons** (16 colors): 4×4 matrix
19. **Quinary Buttons** (16 colors): 4×4 matrix
20. **Senary Buttons** (16 colors): 4×4 matrix
21. **Septenary Buttons** (16 colors): 4×4 matrix
22. **Header** (14 colors): Navigation and branding
23. **Odds** (7 colors): Special highlighting system
24. **Sidebar Navigation** (12 colors): Navigation elements
25. **Sidebar Buttons** (22 colors): Sidebar interactive elements
26. **Transparency** (27 colors): Opacity variants

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3001
NODE_ENV=development
```

### Custom Configuration
Edit `config/config.js` to modify:
- Server port
- Environment settings
- CORS configuration

## 📝 API Examples

### Complete Integration Example
```javascript
class ColorsAPIClient {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  async getSuggestions(primaryColor) {
    const response = await fetch(`${this.baseURL}/api/colors/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryColor })
    });
    return response.json();
  }

  async generateColorSystem(primaryColor, secondaryColor, options = {}) {
    const response = await fetch(`${this.baseURL}/api/colors/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primaryColor,
        secondaryColor,
        grayTheme: options.grayTheme || 'Smart Auto',
        backgroundTheme: options.backgroundTheme || 'Smart Auto'
      })
    });
    return response.json();
  }

  async exportColors(sessionId, format, options = {}) {
    const params = new URLSearchParams({
      sessionId,
      prefix: options.prefix || '--',
      caseStyle: options.caseStyle || 'snake_case',
      mode: options.mode || 'both',
      ...(format === 'json' && { structure: options.structure || 'sections' })
    });

    const response = await fetch(
      `${this.baseURL}/api/colors/export/${format}?${params}`
    );
    
    return format === 'json' ? response.json() : response.text();
  }
}

// Usage
const api = new ColorsAPIClient();

async function createColorSystem() {
  // Get suggestions
  const suggestions = await api.getSuggestions('#3B82F6');
  console.log('Suggestions:', suggestions.suggestions);

  // Generate system
  const system = await api.generateColorSystem(
    '#3B82F6', 
    suggestions.suggestions[0].color,
    {
      grayTheme: 'Blue Grays',
      backgroundTheme: 'Deep Blue'
    }
  );

  // Export as CSS
  const css = await api.exportColors(system.sessionId, 'css', {
    prefix: '--my-app',
    caseStyle: 'camelCase',
    mode: 'both'
  });

  console.log('Generated CSS:', css);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Production API**: [http://colors.mrtrick.me](http://colors.mrtrick.me)
- **Documentation**: Available at root endpoint
- **Swagger UI**: `/api-docs` endpoint
- **Support**: Open an issue on GitHub

## 🙏 Acknowledgments

- Color theory algorithms based on HSL color space
- Accessibility guidelines from WCAG standards
- Design system principles from modern UI frameworks

---

**Built with ❤️ for designers and developers who love beautiful, accessible color systems.**