/**
 * Export Service - Convert color systems to various formats
 * Supports CSS, SCSS, JSON, Figma, Tailwind, and CSV formats
 */

// Helper function to convert camelCase to snake_case
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper function to make section names clearer and more descriptive
const getSectionDisplayName = (sectionName) => {
  const sectionMap = {
    'base': 'Base Colors',
    'primary': 'Primary Colors', 
    'secondary': 'Secondary Colors',
    'gray': 'Gray Scale',
    'error': 'Error Colors',
    'warning': 'Warning Colors', 
    'success': 'Success Colors',
    'info': 'Info Colors',
    'interfaceBg': 'Interface Backgrounds',
    'text': 'Text Colors',
    'icon': 'Icon Colors',
    'border': 'Border Colors',
    'card': 'Card Colors',
    'input': 'Input Colors',
    'buttonPrimary': 'Primary Buttons',
    'buttonSecondary': 'Secondary Buttons',
    'buttonTertiary': 'Tertiary Buttons',
    'buttonQuaternary': 'Quaternary Buttons',
    'buttonQuinary': 'Quinary Buttons',
    'buttonSenary': 'Senary Buttons',
    'buttonSeptenary': 'Septenary Buttons',
    'header': 'Header Navigation',
    'odds': 'Odds Display',
    'sidebarNav': 'Sidebar Navigation',
    'sidebarButton': 'Sidebar Buttons',
    'transparency': 'Transparency Effects'
  };
  
  return sectionMap[sectionName] || sectionName;
};

// Helper function to convert section names based on naming convention
const formatSectionName = (sectionName, caseStyle = 'snake_case') => {
  if (caseStyle === 'snake_case') {
    return camelToSnake(sectionName);
  }
  return sectionName; // camelCase
};

// Helper function to format variable names with prefix (always kebab-case)
const formatVariableName = (name, prefix = '--') => {
  // Ensure prefix ends with appropriate separator
  let formattedPrefix = prefix;
  if (!formattedPrefix.endsWith('-') && !formattedPrefix.endsWith('_')) {
    formattedPrefix += '-';
  }
  
  // Always keep variable names in kebab-case
  return `${formattedPrefix}${name}`;
};

// Convert color system to CSS variables
const exportToCSS = (colorSystem, options = {}) => {
  const { 
    mode = 'both', 
    prefix = '--',
    caseStyle = 'snake_case'
  } = options;

  const generateVariables = (themeMode) => {
    const variables = [];
    
    Object.entries(colorSystem).forEach(([sectionName, colors]) => {
      if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
      
      const displayName = getSectionDisplayName(sectionName);
      variables.push(`  /* ${displayName} */`);
      
      colors.forEach(color => {
        const variableName = formatVariableName(color.name, prefix);
        variables.push(`  ${variableName}: ${color[themeMode]};`);
      });
      
      variables.push('');
    });
    
    return variables.join('\n');
  };

  if (mode === 'both') {
    const lightVars = generateVariables('light');
    const darkVars = generateVariables('dark');
    
    return `/* Light Theme (Default) */
:root {
${lightVars}
}

/* Dark Theme */
.dark {
${darkVars}
}

/* Alternative: Using data-theme attribute */
[data-theme="dark"] {
${darkVars}
}

/* Alternative: Using media query */
@media (prefers-color-scheme: dark) {
  :root {
${darkVars}
  }
}`;
  } else {
    return `/* ${mode.charAt(0).toUpperCase() + mode.slice(1)} Theme */
:root {
${generateVariables(mode)}
}`;
  }
};

// Convert color system to SCSS variables
const exportToSCSS = (colorSystem, options = {}) => {
  const { 
    mode = 'both',
    prefix = '',
    caseStyle = 'snake_case'
  } = options;

  const generateVariables = (themeMode) => {
    const variables = [];
    
    Object.entries(colorSystem).forEach(([sectionName, colors]) => {
      if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
      
      const displayName = getSectionDisplayName(sectionName);
      variables.push(`// ${displayName}`);
      
      colors.forEach(color => {
        let scssPrefix = prefix.replace(/^--/, '').replace(/-$/, '');
        if (scssPrefix && !scssPrefix.endsWith('_') && !scssPrefix.endsWith('-')) {
          scssPrefix += '_';
        }
        const variableName = caseStyle === 'snake_case' 
          ? `${scssPrefix}${color.name.replace(/-/g, '_')}`
          : `${scssPrefix}${color.name}`;
        variables.push(`$${variableName}: ${color[themeMode]};`);
      });
      
      variables.push('');
    });
    
    return variables.join('\n');
  };

  if (mode === 'both') {
    return `// Light theme
${generateVariables('light')}

// Dark theme
${generateVariables('dark')}`;
  } else {
    return generateVariables(mode);
  }
};

// Convert color system to JSON
const exportToJSON = (colorSystem, options = {}) => {
  const { 
    mode = 'both',
    structure = 'sections',
    prefix = '--',
    caseStyle = 'snake_case'
  } = options;

  if (structure === 'themes') {
    // Generate theme list for cssVariables structure
    const generateThemeList = (themeMode) => {
      const list = [];
      Object.entries(colorSystem).forEach(([sectionName, colors]) => {
        if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
        
        colors.forEach(color => {
          const variableName = formatVariableName(color.name, prefix);
          list.push({
            key: variableName,
            value: color[themeMode]
          });
        });
      });
      return { list };
    };

    const cssVariables = {};
    
    if (mode === 'both') {
      cssVariables.light = generateThemeList('light');
      cssVariables.dark = generateThemeList('dark');
    } else {
      cssVariables[mode] = generateThemeList(mode);
    }

    return JSON.stringify({ cssVariables }, null, 2);
  } else {
    // Generate tokens grouped by sections
    const generateTokens = (themeMode) => {
      const tokens = {};
      Object.entries(colorSystem).forEach(([sectionName, colors]) => {
        if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
        
        const formattedSectionName = formatSectionName(sectionName, caseStyle);
        tokens[formattedSectionName] = {};
        colors.forEach(color => {
          const variableName = formatVariableName(color.name, prefix);
          tokens[formattedSectionName][variableName] = {
            value: color[themeMode],
            description: color.description || ''
          };
        });
      });
      return tokens;
    };

    if (mode === 'both') {
      return JSON.stringify({
        light: generateTokens('light'),
        dark: generateTokens('dark')
      }, null, 2);
    } else {
      return JSON.stringify(generateTokens(mode), null, 2);
    }
  }
};

// Convert color system to Figma tokens
const exportToFigma = (colorSystem, options = {}) => {
  const { 
    mode = 'both',
    prefix = '',
    caseStyle = 'snake_case'
  } = options;

  // Helper function to convert hex to RGBA object
  const hexToRgba = (hex) => {
    const cleanHex = hex.replace('#', '');
    let fullHex = cleanHex;
    if (cleanHex.length === 3) {
      fullHex = cleanHex.split('').map(char => char + char).join('');
    }
    
    if (fullHex.length === 6) {
      const r = parseInt(fullHex.substr(0, 2), 16) / 255;
      const g = parseInt(fullHex.substr(2, 2), 16) / 255;
      const b = parseInt(fullHex.substr(4, 2), 16) / 255;
      
      return {
        r: parseFloat(r.toFixed(16)),
        g: parseFloat(g.toFixed(16)),
        b: parseFloat(b.toFixed(16)),
        a: 1
      };
    }
    
    return { r: 0, g: 0, b: 0, a: 1 };
  };
  
  // Helper function to generate deterministic IDs
  const generateDeterministicId = (sectionName, variableName) => {
    const input = `${sectionName}-${variableName}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const baseId = Math.abs(hash % 2000) + 3000;
    const suffixId = Math.abs(hash % 40000) + 10000;
    return `VariableID:${baseId}:${suffixId}`;
  };
  
  const variableIds = [];
  const variables = [];
  
  // Generate variables
  Object.entries(colorSystem).forEach(([sectionName, colors]) => {
    if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
    
    colors.forEach(color => {
      const variableId = generateDeterministicId(sectionName, color.name);
      variableIds.push(variableId);
      
      const formattedSectionName = formatSectionName(sectionName, caseStyle);
      const variableName = color.name; // Always keep kebab-case
      
      const variableObj = {
        id: variableId,
        name: `${formattedSectionName}/${prefix}${variableName}`,
        description: color.description || "",
        type: "COLOR",
        valuesByMode: {},
        resolvedValuesByMode: {},
        scopes: ["ALL_SCOPES"],
        hiddenFromPublishing: false,
        codeSyntax: {}
      };
      
      // Add color values
      if (mode === 'both') {
        const lightColor = hexToRgba(color.light);
        const darkColor = hexToRgba(color.dark);
        
        variableObj.valuesByMode["307:0"] = lightColor;
        variableObj.valuesByMode["3006:0"] = darkColor;
        
        variableObj.resolvedValuesByMode["307:0"] = {
          resolvedValue: lightColor,
          alias: null
        };
        variableObj.resolvedValuesByMode["3006:0"] = {
          resolvedValue: darkColor,
          alias: null
        };
      } else if (mode === 'light') {
        const lightColor = hexToRgba(color.light);
        variableObj.valuesByMode["307:0"] = lightColor;
        variableObj.resolvedValuesByMode["307:0"] = {
          resolvedValue: lightColor,
          alias: null
        };
      } else if (mode === 'dark') {
        const darkColor = hexToRgba(color.dark);
        variableObj.valuesByMode["3006:0"] = darkColor;
        variableObj.resolvedValuesByMode["3006:0"] = {
          resolvedValue: darkColor,
          alias: null
        };
      }
      
      variables.push(variableObj);
    });
  });
  
  const figmaData = {
    id: "VariableCollectionId:307:15216",
    name: "Colors",
    modes: mode === 'both' ? {
      "307:0": "Light Mode",
      "3006:0": "Dark Mode"
    } : mode === 'light' ? {
      "307:0": "Light Mode"
    } : {
      "3006:0": "Dark Mode"
    },
    variableIds: variableIds,
    variables: variables
  };
  
  return JSON.stringify(figmaData, null, 2);
};

// Convert color system to Tailwind config
const exportToTailwind = (colorSystem, options = {}) => {
  const { 
    mode = 'both',
    prefix = '',
    caseStyle = 'snake_case'
  } = options;

  const generateColors = (themeMode) => {
    const colors = {};
    Object.entries(colorSystem).forEach(([sectionName, colorArray]) => {
      if (sectionName === 'metadata' || !colorArray || !Array.isArray(colorArray)) return;
      
      const formattedSectionName = formatSectionName(sectionName, caseStyle);
      colors[formattedSectionName] = {};
      colorArray.forEach(color => {
        let tailwindPrefix = prefix.replace(/^--/, '').replace(/-$/, '');
        if (tailwindPrefix && !tailwindPrefix.endsWith('_') && !tailwindPrefix.endsWith('-')) {
          tailwindPrefix += '_';
        }
        const variableName = caseStyle === 'snake_case' 
          ? `${tailwindPrefix}${color.name.replace(/-/g, '_')}`
          : `${tailwindPrefix}${color.name}`;
        colors[formattedSectionName][variableName] = color[themeMode];
      });
    });
    return colors;
  };

  const colors = mode === 'both' 
    ? { light: generateColors('light'), dark: generateColors('dark') }
    : generateColors(mode);

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)}
    }
  }
}`;
};

// Convert color system to CSV
const exportToCSV = (colorSystem, options = {}) => {
  const { 
    mode = 'both',
    prefix = '--',
    caseStyle = 'snake_case'
  } = options;

  const headers = mode === 'both' 
    ? ['Section', 'Variable Name', 'Light Value', 'Dark Value', 'Description']
    : ['Section', 'Variable Name', 'Value', 'Description'];

  const rows = [];
  Object.entries(colorSystem).forEach(([sectionName, colors]) => {
    if (sectionName === 'metadata' || !colors || !Array.isArray(colors)) return;
    
    const formattedSectionName = formatSectionName(sectionName, caseStyle);
    colors.forEach(color => {
      const variableName = formatVariableName(color.name, prefix);
      if (mode === 'both') {
        rows.push([
          formattedSectionName,
          variableName,
          color.light,
          color.dark,
          color.description || ''
        ]);
      } else {
        rows.push([
          formattedSectionName,
          variableName,
          color[mode],
          color.description || ''
        ]);
      }
    });
  });

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Export main function
const exportColorSystem = (colorSystem, format, options = {}) => {
  switch (format) {
    case 'css':
      return exportToCSS(colorSystem, options);
    case 'scss':
      return exportToSCSS(colorSystem, options);
    case 'json':
      return exportToJSON(colorSystem, options);
    case 'figma':
      return exportToFigma(colorSystem, options);
    case 'tailwind':
      return exportToTailwind(colorSystem, options);
    case 'csv':
      return exportToCSV(colorSystem, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Available export formats
const getAvailableExportFormats = () => {
  return [
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
      description: 'Sass variables for preprocessing',
      extension: '.scss',
      contentType: 'text/scss'
    },
    {
      id: 'json',
      name: 'JSON Tokens',
      description: 'Structured color tokens in JSON format',
      extension: '.json',
      contentType: 'application/json'
    },
    {
      id: 'figma',
      name: 'Figma Tokens',
      description: 'Design tokens compatible with Figma',
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
      name: 'CSV Table',
      description: 'Comma-separated values for spreadsheet import',
      extension: '.csv',
      contentType: 'text/csv'
    }
  ];
};

module.exports = {
  exportColorSystem,
  getAvailableExportFormats
};