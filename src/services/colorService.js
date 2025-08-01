/**
 * Complete Color System Generator Service
 * Based EXACTLY on the original mini-app.ts code with all 292 colors
 */

// Helper function to get optimal text color
const getOptimalTextColor = (backgroundColor) => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance < 0.5 ? '#FFFFFF' : '#000000';
};

// Color utilities
const hexToHsl = (hex) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 7) {
    throw new Error(`Invalid hex color format: ${hex}. Expected format: #RRGGBB`);
  }
  
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexRegex.test(hex)) {
    throw new Error(`Invalid hex color characters: ${hex}. Only 0-9, A-F, a-f are allowed.`);
  }
  
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate color shades with exact base color at shade 5
const generateShades = (baseHex, name) => {
  const [h, s, l] = hexToHsl(baseHex);
  const shades = [];

  // Generate 10 shades - shade 5 is EXACTLY the input color
  for (let i = 1; i <= 10; i++) {
    let lightLightness;
    let darkLightness;
    let lightSaturation;
    let darkSaturation;
    
    if (i === 5) {
      // Shade 5 = EXACT input color for both light and dark modes
      lightLightness = l;
      darkLightness = l;
      lightSaturation = s;
      darkSaturation = s;
    } else if (i < 5) {
      // Lighter shades (01-04) - progressively lighter
      const step = 5 - i; // 4, 3, 2, 1
      lightLightness = Math.min(l + (step * 12), 95); // Get lighter
      darkLightness = Math.min(l + (step * 10), 90); // Get lighter for dark mode too
      lightSaturation = Math.max(s - (step * 8), 15); // Reduce saturation for lighter shades
      darkSaturation = Math.max(s - (step * 6), 20); // Reduce saturation for dark mode
    } else {
      // Darker shades (06-10) - progressively darker  
      const step = i - 5; // 1, 2, 3, 4, 5
      lightLightness = Math.max(l - (step * 10), 8); // Get darker
      darkLightness = Math.max(l - (step * 8), 12); // Get darker for dark mode
      lightSaturation = Math.min(s + (step * 5), 95); // Increase saturation for darker shades
      darkSaturation = Math.min(s + (step * 4), 90); // Increase saturation for dark mode
    }

    const lightColor = hslToHex(h, lightSaturation, lightLightness);
    const darkColor = hslToHex(h, darkSaturation, darkLightness);

    shades.push({
      name: `${name}-${i.toString().padStart(2, '0')}`,
      light: lightColor,
      dark: darkColor,
      description: i === 5 
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} base color (exact input)`
        : `${name.charAt(0).toUpperCase() + name.slice(1)} color shade ${i.toString().padStart(2, '0')}`
    });
  }

  return shades;
};

// Helper function to get theme harmony
const getThemeHarmony = (theme, primaryHex) => {
  const [primaryH, primaryS] = hexToHsl(primaryHex);
  
  const themes = {
    'blue': {
      hue: 220,
      saturation: { gray: Math.min(primaryS * 0.3, 25), background: Math.min(primaryS * 0.4, 35) },
      description: 'Cool blue professional tone'
    },
    'green-brown': {
      hue: 30,
      saturation: { gray: Math.min(primaryS * 0.25, 20), background: Math.min(primaryS * 0.35, 30) },
      description: 'Warm earth tones with brown & green undertones'
    },
    'black': {
      hue: 0,
      saturation: { gray: 0, background: 0 },
      description: 'Pure monochrome classic'
    },
    'neutral': {
      hue: 0,
      saturation: { gray: 0, background: 0 },
      description: 'Pure balanced grays'
    }
  };
  
  return themes[theme] || null;
};

// Generate color suggestions
const generateSecondaryColorSuggestions = (primaryHex) => {
  const [h, s, l] = hexToHsl(primaryHex);
  
  const suggestions = [
    {
      color: hslToHex((h + 180) % 360, s, l),
      name: 'Complementary',
      description: 'High contrast, professional'
    },
    {
      color: hslToHex((h + 120) % 360, s, l),
      name: 'Triadic',
      description: 'Vibrant, creative energy'
    },
    {
      color: hslToHex((h + 150) % 360, s, l),
      name: 'Split-Complementary',
      description: 'Harmonious, sophisticated'
    }
  ];
  
  return suggestions;
};

// Validate hex color
const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  return hexRegex.test(color);
};

// Generate gray shades (10 colors)
const generateGrayShades = (primaryHex, secondaryHex, theme = 'auto') => {
  const [primaryH, primaryS] = hexToHsl(primaryHex);
  const [secondaryH, secondaryS] = hexToHsl(secondaryHex);
  
  let baseHue;
  let baseSaturation;
  
  if (theme === 'auto') {
    // Smart auto-detection based on primary color
    if (primaryH >= 200 && primaryH <= 260) {
      baseHue = primaryH;
      baseSaturation = Math.min(primaryS * 0.3, 25);
    } else if (primaryH >= 30 && primaryH <= 90) {
      baseHue = 30;
      baseSaturation = Math.min(primaryS * 0.25, 20);
    } else {
      baseHue = 220;
      baseSaturation = Math.min(primaryS * 0.3, 25);
    }
  } else {
    const harmony = getThemeHarmony(theme, primaryHex);
    if (harmony) {
      baseHue = harmony.hue;
      baseSaturation = harmony.saturation.gray;
    } else {
      baseHue = 220;
      baseSaturation = 25;
    }
  }
  
  const shades = [];
  for (let i = 1; i <= 10; i++) {
    const lightLightness = 95 - (i - 1) * 9; // 95, 86, 77, 68, 59, 50, 41, 32, 23, 14
    const darkLightness = 8 + (i - 1) * 8.5; // 8, 16.5, 25, 33.5, 42, 50.5, 59, 67.5, 76, 84.5
    
    shades.push({
      name: `gray-${i.toString().padStart(2, '0')}`,
      light: hslToHex(baseHue, baseSaturation, lightLightness),
      dark: hslToHex(baseHue, baseSaturation, darkLightness),
      description: `Gray color shade ${i.toString().padStart(2, '0')}`
    });
  }
  
  return shades;
};

// Generate base colors (2 colors)
const generateBaseColors = (primaryHex, secondaryHex) => {
  const [primaryH, primaryS] = hexToHsl(primaryHex);
  
  let blackHue;
  let whiteHue;
  
  if (primaryH >= 270 && primaryH <= 330) {
    blackHue = 240;
    whiteHue = 240;
  } else if (primaryH >= 330 || primaryH <= 30) {
    blackHue = 0;
    whiteHue = 0;
  } else if (primaryH >= 30 && primaryH <= 90) {
    blackHue = 30;
    whiteHue = 45;
  } else if (primaryH >= 90 && primaryH <= 150) {
    blackHue = 210;
    whiteHue = 210;
  } else {
    blackHue = primaryH;
    whiteHue = primaryH;
  }
  
  const baseSaturation = Math.min(primaryS * 0.08, 6);
  
  return [
    {
      name: 'black',
      light: hslToHex(blackHue, baseSaturation, 5),
      dark: hslToHex(blackHue, baseSaturation * 1.2, 3),
      description: 'Smart harmonized black based on primary color family'
    },
    {
      name: 'white', 
      light: '#FFFFFF',
      dark: hslToHex(whiteHue, baseSaturation * 0.6, 98),
      description: 'Pure white (light) / Smart harmonized white (dark)'
    }
  ];
};

// Generate error colors (8 colors)
const generateErrorColors = () => {
  const errorBase = { h: 2, s: 85, l: 55 };
  const shades = [];
  
  for (let i = 1; i <= 8; i++) {
    let lightLightness, lightSaturation, darkLightness, darkSaturation;
    
    switch(i) {
      case 1:
        lightLightness = 97; lightSaturation = 20;
        darkLightness = 15; darkSaturation = 35;
        break;
      case 2:
        lightLightness = 93; lightSaturation = 35;
        darkLightness = 22; darkSaturation = 45;
        break;
      case 3:
        lightLightness = 85; lightSaturation = 50;
        darkLightness = 30; darkSaturation = 55;
        break;
      case 4:
        lightLightness = 72; lightSaturation = 65;
        darkLightness = 40; darkSaturation = 65;
        break;
      case 5:
        lightLightness = 62; lightSaturation = 78;
        darkLightness = 52; darkSaturation = 75;
        break;
      case 6:
        lightLightness = 55; lightSaturation = 85;
        darkLightness = 55; darkSaturation = 85;
        break;
      case 7:
        lightLightness = 45; lightSaturation = 85;
        darkLightness = 65; darkSaturation = 80;
        break;
      case 8:
        lightLightness = 35; lightSaturation = 80;
        darkLightness = 75; darkSaturation = 70;
        break;
      default:
        lightLightness = 55; lightSaturation = 85;
        darkLightness = 55; darkSaturation = 85;
    }
    
    shades.push({
      name: `error-${i.toString().padStart(2, '0')}`,
      light: hslToHex(errorBase.h, lightSaturation, lightLightness),
      dark: hslToHex(errorBase.h + 2, darkSaturation, darkLightness),
      description: `Error color shade ${i.toString().padStart(2, '0')} - optimized for accessibility and contrast`
    });
  }
  
  return shades;
};

// Generate warning colors (8 colors)
const generateWarningColors = () => {
  const warningBase = { h: 35, s: 95, l: 50 };
  const shades = [];
  
  for (let i = 1; i <= 8; i++) {
    let lightLightness, lightSaturation, darkLightness, darkSaturation;
    
    switch(i) {
      case 1:
        lightLightness = 97; lightSaturation = 25;
        darkLightness = 12; darkSaturation = 40;
        break;
      case 2:
        lightLightness = 92; lightSaturation = 40;
        darkLightness = 18; darkSaturation = 50;
        break;
      case 3:
        lightLightness = 84; lightSaturation = 55;
        darkLightness = 26; darkSaturation = 60;
        break;
      case 4:
        lightLightness = 70; lightSaturation = 70;
        darkLightness = 36; darkSaturation = 70;
        break;
      case 5:
        lightLightness = 58; lightSaturation = 85;
        darkLightness = 48; darkSaturation = 80;
        break;
      case 6:
        lightLightness = 50; lightSaturation = 95;
        darkLightness = 50; darkSaturation = 95;
        break;
      case 7:
        lightLightness = 42; lightSaturation = 90;
        darkLightness = 60; darkSaturation = 85;
        break;
      case 8:
        lightLightness = 32; lightSaturation = 85;
        darkLightness = 70; darkSaturation = 75;
        break;
      default:
        lightLightness = 50; lightSaturation = 95;
        darkLightness = 50; darkSaturation = 95;
    }
    
    shades.push({
      name: `warning-${i.toString().padStart(2, '0')}`,
      light: hslToHex(warningBase.h, lightSaturation, lightLightness),
      dark: hslToHex(warningBase.h + 3, darkSaturation, darkLightness),
      description: `Warning color shade ${i.toString().padStart(2, '0')} - optimized for accessibility and contrast`
    });
  }
  
  return shades;
};

// Generate success colors (8 colors)
const generateSuccessColors = () => {
  const successBase = { h: 140, s: 85, l: 42 };
  const shades = [];
  
  for (let i = 1; i <= 8; i++) {
    let lightLightness, lightSaturation, darkLightness, darkSaturation;
    
    switch(i) {
      case 1:
        lightLightness = 97; lightSaturation = 30;
        darkLightness = 10; darkSaturation = 45;
        break;
      case 2:
        lightLightness = 91; lightSaturation = 45;
        darkLightness = 16; darkSaturation = 55;
        break;
      case 3:
        lightLightness = 82; lightSaturation = 60;
        darkLightness = 24; darkSaturation = 65;
        break;
      case 4:
        lightLightness = 68; lightSaturation = 75;
        darkLightness = 34; darkSaturation = 75;
        break;
      case 5:
        lightLightness = 52; lightSaturation = 85;
        darkLightness = 46; darkSaturation = 80;
        break;
      case 6:
        lightLightness = 42; lightSaturation = 85;
        darkLightness = 42; darkSaturation = 85;
        break;
      case 7:
        lightLightness = 34; lightSaturation = 80;
        darkLightness = 52; darkSaturation = 80;
        break;
      case 8:
        lightLightness = 26; lightSaturation = 75;
        darkLightness = 62; darkSaturation = 70;
        break;
      default:
        lightLightness = 42; lightSaturation = 85;
        darkLightness = 42; darkSaturation = 85;
    }
    
    shades.push({
      name: `success-${i.toString().padStart(2, '0')}`,
      light: hslToHex(successBase.h, lightSaturation, lightLightness),
      dark: hslToHex(successBase.h - 5, darkSaturation, darkLightness),
      description: `Success color shade ${i.toString().padStart(2, '0')} - optimized for accessibility and contrast`
    });
  }
  
  return shades;
};

// Generate info colors (8 colors)
const generateInfoColors = () => {
  const infoBase = { h: 210, s: 85, l: 52 };
  const shades = [];
  
  for (let i = 1; i <= 8; i++) {
    let lightLightness, lightSaturation, darkLightness, darkSaturation;
    
    switch(i) {
      case 1:
        lightLightness = 97; lightSaturation = 25;
        darkLightness = 12; darkSaturation = 40;
        break;
      case 2:
        lightLightness = 92; lightSaturation = 40;
        darkLightness = 20; darkSaturation = 50;
        break;
      case 3:
        lightLightness = 84; lightSaturation = 55;
        darkLightness = 30; darkSaturation = 60;
        break;
      case 4:
        lightLightness = 72; lightSaturation = 70;
        darkLightness = 42; darkSaturation = 70;
        break;
      case 5:
        lightLightness = 62; lightSaturation = 85;
        darkLightness = 52; darkSaturation = 80;
        break;
      case 6:
        lightLightness = 52; lightSaturation = 85;
        darkLightness = 52; darkSaturation = 85;
        break;
      case 7:
        lightLightness = 42; lightSaturation = 80;
        darkLightness = 62; darkSaturation = 80;
        break;
      case 8:
        lightLightness = 32; lightSaturation = 75;
        darkLightness = 72; darkSaturation = 70;
        break;
      default:
        lightLightness = 52; lightSaturation = 85;
        darkLightness = 52; darkSaturation = 85;
    }
    
    shades.push({
      name: `info-${i.toString().padStart(2, '0')}`,
      light: hslToHex(infoBase.h, lightSaturation, lightLightness),
      dark: hslToHex(infoBase.h + 5, darkSaturation, darkLightness),
      description: `Info color shade ${i.toString().padStart(2, '0')} - optimized for accessibility and contrast`
    });
  }
  
  return shades;
};

// Generate interface backgrounds (6 colors)
const generateInterfaceBackgrounds = (primaryHex, secondaryHex, theme = 'auto') => {
  const [primaryH, primaryS] = hexToHsl(primaryHex);
  
  let baseHue;
  let baseSaturation;
  let harmonyType;
  
  if (theme === 'auto') {
    if (primaryH >= 300 && primaryH <= 340) {
      baseHue = 220;
      baseSaturation = Math.min(primaryS * 0.6, 45);
      harmonyType = 'complementary-blue (auto)';
    } else if (primaryH >= 340 || primaryH <= 20) {
      baseHue = 210;
      baseSaturation = Math.min(primaryS * 0.5, 35);
      harmonyType = 'cool-complement (auto)';
    } else if (primaryH >= 270 && primaryH < 300) {
      baseHue = 230;
      baseSaturation = Math.min(primaryS * 0.55, 40);
      harmonyType = 'analogous-cool (auto)';
    } else if (primaryH >= 20 && primaryH <= 60) {
      baseHue = 35;
      baseSaturation = Math.min(primaryS * 0.25, 20);
      harmonyType = 'warm-neutral (auto)';
    } else if (primaryH >= 60 && primaryH <= 120) {
      baseHue = 200;
      baseSaturation = Math.min(primaryS * 0.3, 25);
      harmonyType = 'cool-balance (auto)';
    } else if (primaryH >= 120 && primaryH <= 180) {
      baseHue = 25;
      baseSaturation = Math.min(primaryS * 0.35, 30);
      harmonyType = 'warm-balance (auto)';
    } else if (primaryH >= 180 && primaryH <= 240) {
      baseHue = primaryH + 15;
      baseSaturation = Math.min(primaryS * 0.4, 35);
      harmonyType = 'analogous-blue (auto)';
    } else {
      baseHue = 220;
      baseSaturation = Math.min(primaryS * 0.5, 40);
      harmonyType = 'monochromatic-deep (auto)';
    }
  } else {
    const harmony = getThemeHarmony(theme, primaryHex);
    if (harmony) {
      baseHue = harmony.hue;
      baseSaturation = harmony.saturation.background;
      harmonyType = `${harmony.description} (matches gray)`;
    } else {
      baseHue = 220;
      baseSaturation = Math.min(primaryS * 0.4, 35);
      harmonyType = 'default';
    }
  }
  
  baseSaturation = Math.max(baseSaturation, 8);
  
  const backgrounds = [
    {
      name: 'bg-quinary',
      lightness: { light: 98, dark: 7 },
      saturation: baseSaturation * 1.0,
      description: `Primary interface background (${harmonyType} harmony)`
    },
    {
      name: 'bg-quinary_alt',
      lightness: { light: 96, dark: 10 },
      saturation: baseSaturation * 0.9,
      description: 'Alternative primary background'
    },
    {
      name: 'bg-senary',
      lightness: { light: 94, dark: 13 },
      saturation: baseSaturation * 0.85,
      description: 'Secondary interface background'
    },
    {
      name: 'bg-senary_alt',
      lightness: { light: 92, dark: 16 },
      saturation: baseSaturation * 0.8,
      description: 'Alternative secondary background'
    },
    {
      name: 'bg-septenary',
      lightness: { light: 89, dark: 20 },
      saturation: baseSaturation * 0.75,
      description: 'Tertiary interface background'
    },
    {
      name: 'bg-active',
      lightness: { light: 85, dark: 25 },
      saturation: baseSaturation * 1.2,
      description: 'Active state background'
    }
  ];
  
  return backgrounds.map(bg => ({
    name: bg.name,
    light: hslToHex(baseHue, bg.saturation, bg.lightness.light),
    dark: hslToHex(baseHue, bg.saturation, bg.lightness.dark),
    description: bg.description
  }));
};

// Generate text colors (4 colors)
const generateTextColors = (primaryHex, secondaryHex) => {
  return [
    {
      name: 'txt-01',
      light: '#0C111D',
      dark: '#FFFFFF',
      description: 'Primary text color'
    },
    {
      name: 'txt-02',
      light: '#575E6F',
      dark: '#C1C6DC',
      description: 'Secondary text color'
    },
    {
      name: 'txt-03',
      light: 'var(--primary-05)',
      dark: 'var(--primary-06)',
      description: 'Accent text color'
    },
    {
      name: 'txt-04',
      light: 'var(--secondary-05)',
      dark: 'var(--secondary-06)',
      description: 'Secondary accent text color'
    }
  ];
};

// Generate icon colors (4 colors)
const generateIconColors = (primaryHex, secondaryHex) => {
  return [
    {
      name: 'icon-01',
      light: '#0C111D',
      dark: '#FFFFFF',
      description: 'Primary icon color'
    },
    {
      name: 'icon-02',
      light: 'var(--gray-05)',
      dark: 'var(--gray-07)',
      description: 'Secondary icon color'
    },
    {
      name: 'icon-03',
      light: 'var(--secondary-05)',
      dark: 'var(--secondary-06)',
      description: 'Tertiary icon color'
    },
    {
      name: 'icon-04',
      light: 'var(--primary-06)',
      dark: 'var(--primary-06)',
      description: 'Quaternary icon color'
    }
  ];
};

// Generate border colors (4 colors)
const generateBorderColors = () => {
  return [
    {
      name: 'border-primary',
      light: 'var(--transparent-04)',
      dark: 'var(--transparent-04)',
      description: 'Primary border color'
    },
    {
      name: 'border-secondary',
      light: 'var(--bg-senary)',
      dark: 'var(--bg-senary)',
      description: 'Secondary border color'
    },
    {
      name: 'border-tertiary',
      light: 'var(--bg-senary_alt)',
      dark: 'var(--bg-senary_alt)',
      description: 'Tertiary border color'
    },
    {
      name: 'border-active',
      light: 'var(--primary-05)',
      dark: 'var(--primary-06)',
      description: 'Active border color'
    }
  ];
};

// Generate card colors (4 colors)
const generateCardColors = () => {
  return [
    {
      name: 'card-bg-01',
      light: 'var(--bg-quinary_alt)',
      dark: 'var(--bg-quinary_alt)',
      description: 'Card background 01'
    },
    {
      name: 'card-bg-02',
      light: 'var(--secondary-06)',
      dark: 'var(--gray-02)',
      description: 'Card background 02'
    },
    {
      name: 'card-bg-03',
      light: 'var(--secondary-06)',
      dark: 'var(--gray-03)',
      description: 'Card background 03'
    },
    {
      name: 'card-bg-04',
      light: 'var(--bg-senary)',
      dark: 'var(--bg-senary)',
      description: 'Card background 04'
    }
  ];
};

// Generate input colors (12 colors)
const generateInputColors = () => {
  return [
    {
      name: 'inp-bg-default',
      light: 'var(--gray-01)',
      dark: 'var(--bg-quinary_alt)',
      description: 'Input background default'
    },
    {
      name: 'inp-bg-hover',
      light: 'var(--bg-senary)',
      dark: 'var(--bg-senary)',
      description: 'Input background hover'
    },
    {
      name: 'inp-bg-pressed',
      light: 'var(--bg-quinary)',
      dark: 'var(--bg-quinary)',
      description: 'Input background pressed'
    },
    {
      name: 'inp-bg-disabled',
      light: 'var(--transparent-02)',
      dark: 'var(--transparent-02)',
      description: 'Input background disabled'
    },
    {
      name: 'inp-text-default',
      light: 'var(--transparent-04)',
      dark: 'var(--transparent-04)',
      description: 'Input text default'
    },
    {
      name: 'inp-text-hover',
      light: 'var(--transparent-10)',
      dark: 'var(--transparent-10)',
      description: 'Input text hover'
    },
    {
      name: 'inp-text-pressed',
      light: 'var(--txt-01)',
      dark: 'var(--txt-01)',
      description: 'Input text pressed'
    },
    {
      name: 'inp-text-disabled',
      light: 'var(--transparent-03)',
      dark: 'var(--transparent-03)',
      description: 'Input text disabled'
    },
    {
      name: 'inp-icon-default',
      light: 'var(--txt-01)',
      dark: 'var(--txt-01)',
      description: 'Input icon default'
    },
    {
      name: 'inp-icon-hover',
      light: 'var(--primary-05)',
      dark: 'var(--primary-05)',
      description: 'Input icon hover'
    },
    {
      name: 'inp-icon-pressed',
      light: 'var(--primary-07)',
      dark: 'var(--primary-07)',
      description: 'Input icon pressed'
    },
    {
      name: 'inp-icon-disabled',
      light: 'var(--transparent-03)',
      dark: 'var(--transparent-03)',
      description: 'Input icon disabled'
    }
  ];
};

// Generate primary button colors (16 colors)
const generatePrimaryButtonColors = (primaryHex) => {
  const primaryShades = generateShades(primaryHex, 'primary');
  
  const bgDefault = 'var(--primary-05)';
  const bgHover = 'var(--primary-06)';
  const bgPressed = 'var(--primary-07)';
  const bgDisabled = 'var(--primary-09)';
  
  const actualBgDefault = primaryShades[4].light;
  const actualBgHover = primaryShades[5].light;
  const actualBgPressed = primaryShades[6].light;
  const actualBgDisabled = primaryShades[8].light;
  
  const textDefault = getOptimalTextColor(actualBgDefault);
  const textHover = getOptimalTextColor(actualBgHover);
  const textPressed = getOptimalTextColor(actualBgPressed);
  const textDisabled = getOptimalTextColor(actualBgDisabled);
  
  return [
    // Background
    { name: 'btn-primary-bg-default', light: bgDefault, dark: bgDefault, description: 'Primary button background default' },
    { name: 'btn-primary-bg-hover', light: bgHover, dark: bgHover, description: 'Primary button background hover' },
    { name: 'btn-primary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Primary button background pressed' },
    { name: 'btn-primary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Primary button background disabled' },
    // Text
    { name: 'btn-primary-text-default', light: textDefault, dark: textDefault, description: 'Primary button text default' },
    { name: 'btn-primary-text-hover', light: textHover, dark: textHover, description: 'Primary button text hover' },
    { name: 'btn-primary-text-pressed', light: textPressed, dark: textPressed, description: 'Primary button text pressed' },
    { name: 'btn-primary-text-disabled', light: textDisabled, dark: textDisabled, description: 'Primary button text disabled' },
    // Icon
    { name: 'btn-primary-icon-default', light: 'var(--btn-primary-text-default)', dark: 'var(--btn-primary-text-default)', description: 'Primary button icon default' },
    { name: 'btn-primary-icon-hover', light: 'var(--btn-primary-text-hover)', dark: 'var(--btn-primary-text-hover)', description: 'Primary button icon hover' },
    { name: 'btn-primary-icon-pressed', light: 'var(--btn-primary-text-pressed)', dark: 'var(--btn-primary-text-pressed)', description: 'Primary button icon pressed' },
    { name: 'btn-primary-icon-disabled', light: 'var(--btn-primary-text-disabled)', dark: 'var(--btn-primary-text-disabled)', description: 'Primary button icon disabled' },
    // Border
    { name: 'btn-primary-border-default', light: 'var(--btn-primary-bg-default)', dark: 'var(--btn-primary-bg-default)', description: 'Primary button border default' },
    { name: 'btn-primary-border-hover', light: 'var(--btn-primary-bg-hover)', dark: 'var(--btn-primary-bg-hover)', description: 'Primary button border hover' },
    { name: 'btn-primary-border-pressed', light: 'var(--btn-primary-bg-pressed)', dark: 'var(--btn-primary-bg-pressed)', description: 'Primary button border pressed' },
    { name: 'btn-primary-border-disabled', light: 'var(--btn-primary-bg-disabled)', dark: 'var(--btn-primary-bg-disabled)', description: 'Primary button border disabled' }
  ];
};

// Generate secondary button colors (16 colors)
const generateSecondaryButtonColors = (secondaryHex) => {
  const secondaryShades = generateShades(secondaryHex, 'secondary');
  
  const bgDefault = 'var(--secondary-05)';
  const bgHover = 'var(--secondary-06)';
  const bgPressed = 'var(--secondary-07)';
  const bgDisabled = 'var(--secondary-09)';
  
  const actualBgDefault = secondaryShades[4].light;
  const actualBgHover = secondaryShades[5].light;
  const actualBgPressed = secondaryShades[6].light;
  const actualBgDisabled = secondaryShades[8].light;
  
  const textDefault = getOptimalTextColor(actualBgDefault);
  const textHover = getOptimalTextColor(actualBgHover);
  const textPressed = getOptimalTextColor(actualBgPressed);
  const textDisabled = getOptimalTextColor(actualBgDisabled);
  
  return [
    // Background
    { name: 'btn-secondary-bg-default', light: bgDefault, dark: bgDefault, description: 'Secondary button background default' },
    { name: 'btn-secondary-bg-hover', light: bgHover, dark: bgHover, description: 'Secondary button background hover' },
    { name: 'btn-secondary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Secondary button background pressed' },
    { name: 'btn-secondary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Secondary button background disabled' },
    // Text
    { name: 'btn-secondary-text-default', light: textDefault, dark: textDefault, description: 'Secondary button text default' },
    { name: 'btn-secondary-text-hover', light: textHover, dark: textHover, description: 'Secondary button text hover' },
    { name: 'btn-secondary-text-pressed', light: textPressed, dark: textPressed, description: 'Secondary button text pressed' },
    { name: 'btn-secondary-text-disabled', light: textDisabled, dark: textDisabled, description: 'Secondary button text disabled' },
    // Icon
    { name: 'btn-secondary-icon-default', light: 'var(--btn-secondary-text-default)', dark: 'var(--btn-secondary-text-default)', description: 'Secondary button icon default' },
    { name: 'btn-secondary-icon-hover', light: 'var(--btn-secondary-text-hover)', dark: 'var(--btn-secondary-text-hover)', description: 'Secondary button icon hover' },
    { name: 'btn-secondary-icon-pressed', light: 'var(--btn-secondary-text-pressed)', dark: 'var(--btn-secondary-text-pressed)', description: 'Secondary button icon pressed' },
    { name: 'btn-secondary-icon-disabled', light: 'var(--btn-secondary-text-disabled)', dark: 'var(--btn-secondary-text-disabled)', description: 'Secondary button icon disabled' },
    // Border
    { name: 'btn-secondary-border-default', light: 'var(--btn-secondary-bg-default)', dark: 'var(--btn-secondary-bg-default)', description: 'Secondary button border default' },
    { name: 'btn-secondary-border-hover', light: 'var(--btn-secondary-bg-hover)', dark: 'var(--btn-secondary-bg-hover)', description: 'Secondary button border hover' },
    { name: 'btn-secondary-border-pressed', light: 'var(--btn-secondary-bg-pressed)', dark: 'var(--btn-secondary-bg-pressed)', description: 'Secondary button border pressed' },
    { name: 'btn-secondary-border-disabled', light: 'var(--btn-secondary-bg-disabled)', dark: 'var(--btn-secondary-bg-disabled)', description: 'Secondary button border disabled' }
  ];
};

// Generate tertiary button colors (16 colors)
const generateTertiaryButtonColors = () => {
  const bgDefault = 'var(--white)';
  const bgHover = 'var(--gray-01)';
  const bgPressed = 'var(--gray-02)';
  const bgDisabled = 'var(--white)';
  
  const textDefault = getOptimalTextColor(bgDefault);
  const textHover = getOptimalTextColor(bgHover);
  const textPressed = getOptimalTextColor(bgPressed);
  const textDisabled = getOptimalTextColor(bgDisabled);
  
  return [
    // Background
    { name: 'btn-tertiary-bg-default', light: bgDefault, dark: bgDefault, description: 'Tertiary button background default' },
    { name: 'btn-tertiary-bg-hover', light: bgHover, dark: bgHover, description: 'Tertiary button background hover' },
    { name: 'btn-tertiary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Tertiary button background pressed' },
    { name: 'btn-tertiary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Tertiary button background disabled' },
    // Text
    { name: 'btn-tertiary-text-default', light: textDefault, dark: textDefault, description: 'Tertiary button text default' },
    { name: 'btn-tertiary-text-hover', light: 'var(--primary-05)', dark: 'var(--primary-05)', description: 'Tertiary button text hover' },
    { name: 'btn-tertiary-text-pressed', light: 'var(--primary-06)', dark: 'var(--primary-06)', description: 'Tertiary button text pressed' },
    { name: 'btn-tertiary-text-disabled', light: 'var(--gray-02)', dark: 'var(--gray-02)', description: 'Tertiary button text disabled' },
    // Icon
    { name: 'btn-tertiary-icon-default', light: 'var(--btn-tertiary-text-default)', dark: 'var(--btn-tertiary-text-default)', description: 'Tertiary button icon default' },
    { name: 'btn-tertiary-icon-hover', light: 'var(--btn-tertiary-text-hover)', dark: 'var(--btn-tertiary-text-hover)', description: 'Tertiary button icon hover' },
    { name: 'btn-tertiary-icon-pressed', light: 'var(--btn-tertiary-text-pressed)', dark: 'var(--btn-tertiary-text-pressed)', description: 'Tertiary button icon pressed' },
    { name: 'btn-tertiary-icon-disabled', light: 'var(--btn-tertiary-text-disabled)', dark: 'var(--btn-tertiary-text-disabled)', description: 'Tertiary button icon disabled' },
    // Border
    { name: 'btn-tertiary-border-default', light: 'var(--gray-02)', dark: 'var(--gray-02)', description: 'Tertiary button border default' },
    { name: 'btn-tertiary-border-hover', light: 'var(--gray-03)', dark: 'var(--gray-03)', description: 'Tertiary button border hover' },
    { name: 'btn-tertiary-border-pressed', light: 'var(--gray-04)', dark: 'var(--gray-04)', description: 'Tertiary button border pressed' },
    { name: 'btn-tertiary-border-disabled', light: 'var(--btn-tertiary-bg-disabled)', dark: 'var(--btn-tertiary-bg-disabled)', description: 'Tertiary button border disabled' }
  ];
};

// Generate quaternary button colors (16 colors)
const generateQuaternaryButtonColors = () => {
  const bgDefault = 'var(--black)';
  const bgHover = 'var(--gray-09)';
  const bgPressed = 'var(--gray-08)';
  const bgDisabled = 'var(--gray-06)';
  
  const textDefault = getOptimalTextColor(bgDefault);
  const textHover = getOptimalTextColor(bgHover);
  const textPressed = getOptimalTextColor(bgPressed);
  const textDisabled = getOptimalTextColor(bgDisabled);
  
  return [
    // Background
    { name: 'btn-quaternary-bg-default', light: bgDefault, dark: bgDefault, description: 'Quaternary button background default' },
    { name: 'btn-quaternary-bg-hover', light: bgHover, dark: bgHover, description: 'Quaternary button background hover' },
    { name: 'btn-quaternary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Quaternary button background pressed' },
    { name: 'btn-quaternary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Quaternary button background disabled' },
    // Text
    { name: 'btn-quaternary-text-default', light: textDefault, dark: textDefault, description: 'Quaternary button text default' },
    { name: 'btn-quaternary-text-hover', light: 'var(--primary-05)', dark: 'var(--primary-05)', description: 'Quaternary button text hover' },
    { name: 'btn-quaternary-text-pressed', light: 'var(--primary-04)', dark: 'var(--primary-04)', description: 'Quaternary button text pressed' },
    { name: 'btn-quaternary-text-disabled', light: 'var(--gray-04)', dark: 'var(--gray-04)', description: 'Quaternary button text disabled' },
    // Icon
    { name: 'btn-quaternary-icon-default', light: 'var(--btn-quaternary-text-default)', dark: 'var(--btn-quaternary-text-default)', description: 'Quaternary button icon default' },
    { name: 'btn-quaternary-icon-hover', light: 'var(--btn-quaternary-text-hover)', dark: 'var(--btn-quaternary-text-hover)', description: 'Quaternary button icon hover' },
    { name: 'btn-quaternary-icon-pressed', light: 'var(--btn-quaternary-text-pressed)', dark: 'var(--btn-quaternary-text-pressed)', description: 'Quaternary button icon pressed' },
    { name: 'btn-quaternary-icon-disabled', light: 'var(--btn-quaternary-text-disabled)', dark: 'var(--btn-quaternary-text-disabled)', description: 'Quaternary button icon disabled' },
    // Border
    { name: 'btn-quaternary-border-default', light: 'var(--gray-08)', dark: 'var(--gray-08)', description: 'Quaternary button border default' },
    { name: 'btn-quaternary-border-hover', light: 'var(--btn-quaternary-bg-hover)', dark: 'var(--btn-quaternary-bg-hover)', description: 'Quaternary button border hover' },
    { name: 'btn-quaternary-border-pressed', light: 'var(--btn-quaternary-bg-pressed)', dark: 'var(--btn-quaternary-bg-pressed)', description: 'Quaternary button border pressed' },
    { name: 'btn-quaternary-border-disabled', light: 'var(--btn-quaternary-bg-disabled)', dark: 'var(--btn-quaternary-bg-disabled)', description: 'Quaternary button border disabled' }
  ];
};

// Generate quinary button colors (16 colors)
const generateQuinaryButtonColors = () => {
  const bgDefault = 'rgba(240, 68, 56, 1)';
  const bgHover = 'rgba(217, 45, 32, 1)';
  const bgPressed = 'rgba(180, 35, 24, 1)';
  const bgDisabled = 'rgba(254, 243, 242, 1)';
  
  const textDefault = getOptimalTextColor(bgDefault);
  const textHover = getOptimalTextColor(bgHover);
  const textPressed = getOptimalTextColor(bgPressed);
  const textDisabled = getOptimalTextColor(bgDisabled);
  
  return [
    // Background
    { name: 'btn-quinary-bg-default', light: bgDefault, dark: bgDefault, description: 'Quinary button default background' },
    { name: 'btn-quinary-bg-hover', light: bgHover, dark: bgHover, description: 'Quinary button hover background' },
    { name: 'btn-quinary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Quinary button pressed background' },
    { name: 'btn-quinary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Quinary button disabled background' },
    // Text
    { name: 'btn-quinary-text-default', light: textDefault, dark: textDefault, description: 'Quinary button default text' },
    { name: 'btn-quinary-text-hover', light: textHover, dark: textHover, description: 'Quinary button hover text' },
    { name: 'btn-quinary-text-pressed', light: textPressed, dark: textPressed, description: 'Quinary button pressed text' },
    { name: 'btn-quinary-text-disabled', light: textDisabled, dark: textDisabled, description: 'Quinary button disabled text' },
    // Icon
    { name: 'btn-quinary-icon-default', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Quinary button default icon' },
    { name: 'btn-quinary-icon-hover', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Quinary button hover icon' },
    { name: 'btn-quinary-icon-pressed', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Quinary button pressed icon' },
    { name: 'btn-quinary-icon-disabled', light: 'rgba(254, 228, 226, 1)', dark: 'rgba(254, 228, 226, 1)', description: 'Quinary button disabled icon' },
    // Border
    { name: 'btn-quinary-border-default', light: 'rgba(240, 68, 56, 1)', dark: 'rgba(240, 68, 56, 1)', description: 'Quinary button default border' },
    { name: 'btn-quinary-border-hover', light: 'rgba(217, 45, 32, 1)', dark: 'rgba(217, 45, 32, 1)', description: 'Quinary button hover border' },
    { name: 'btn-quinary-border-pressed', light: 'rgba(180, 35, 24, 1)', dark: 'rgba(180, 35, 24, 1)', description: 'Quinary button pressed border' },
    { name: 'btn-quinary-border-disabled', light: 'rgba(254, 243, 242, 1)', dark: 'rgba(254, 243, 242, 1)', description: 'Quinary button disabled border' }
  ];
};

// Generate senary button colors (16 colors)
const generateSenaryButtonColors = () => {
  const bgDefault = 'rgba(46, 144, 250, 1)';
  const bgHover = 'rgba(83, 177, 253, 1)';
  const bgPressed = 'rgba(21, 112, 239, 1)';
  const bgDisabled = 'rgba(209, 233, 255, 1)';
  
  const textDefault = getOptimalTextColor(bgDefault);
  const textHover = getOptimalTextColor(bgHover);
  const textPressed = getOptimalTextColor(bgPressed);
  const textDisabled = getOptimalTextColor(bgDisabled);
  
  return [
    // Background
    { name: 'btn-senary-bg-default', light: bgDefault, dark: bgDefault, description: 'Senary button default background' },
    { name: 'btn-senary-bg-hover', light: bgHover, dark: bgHover, description: 'Senary button hover background' },
    { name: 'btn-senary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Senary button pressed background' },
    { name: 'btn-senary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Senary button disabled background' },
    // Text
    { name: 'btn-senary-text-default', light: textDefault, dark: textDefault, description: 'Senary button default text' },
    { name: 'btn-senary-text-hover', light: textHover, dark: textHover, description: 'Senary button hover text' },
    { name: 'btn-senary-text-pressed', light: textPressed, dark: textPressed, description: 'Senary button pressed text' },
    { name: 'btn-senary-text-disabled', light: textDisabled, dark: textDisabled, description: 'Senary button disabled text' },
    // Icon
    { name: 'btn-senary-icon-default', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Senary button default icon' },
    { name: 'btn-senary-icon-hover', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Senary button hover icon' },
    { name: 'btn-senary-icon-pressed', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Senary button pressed icon' },
    { name: 'btn-senary-icon-disabled', light: 'rgba(239, 248, 255, 1)', dark: 'rgba(239, 248, 255, 1)', description: 'Senary button disabled icon' },
    // Border
    { name: 'btn-senary-border-default', light: 'rgba(46, 144, 250, 1)', dark: 'rgba(46, 144, 250, 1)', description: 'Senary button default border' },
    { name: 'btn-senary-border-hover', light: 'rgba(83, 177, 253, 1)', dark: 'rgba(83, 177, 253, 1)', description: 'Senary button hover border' },
    { name: 'btn-senary-border-pressed', light: 'rgba(21, 112, 239, 1)', dark: 'rgba(21, 112, 239, 1)', description: 'Senary button pressed border' },
    { name: 'btn-senary-border-disabled', light: 'rgba(209, 233, 255, 1)', dark: 'rgba(209, 233, 255, 1)', description: 'Senary button disabled border' }
  ];
};

// Generate septenary button colors (16 colors)
const generateSeptenaryButtonColors = () => {
  const bgDefault = 'rgba(23, 178, 106, 1)';
  const bgHover = 'rgba(7, 148, 85, 1)';
  const bgPressed = 'rgba(6, 118, 71, 1)';
  const bgDisabled = 'rgba(220, 250, 230, 1)';
  
  const textDefault = getOptimalTextColor(bgDefault);
  const textHover = getOptimalTextColor(bgHover);
  const textPressed = getOptimalTextColor(bgPressed);
  const textDisabled = getOptimalTextColor(bgDisabled);
  
  return [
    // Background
    { name: 'btn-septenary-bg-default', light: bgDefault, dark: bgDefault, description: 'Septenary button default background' },
    { name: 'btn-septenary-bg-hover', light: bgHover, dark: bgHover, description: 'Septenary button hover background' },
    { name: 'btn-septenary-bg-pressed', light: bgPressed, dark: bgPressed, description: 'Septenary button pressed background' },
    { name: 'btn-septenary-bg-disabled', light: bgDisabled, dark: bgDisabled, description: 'Septenary button disabled background' },
    // Text
    { name: 'btn-septenary-text-default', light: textDefault, dark: textDefault, description: 'Septenary button default text' },
    { name: 'btn-septenary-text-hover', light: textHover, dark: textHover, description: 'Septenary button hover text' },
    { name: 'btn-septenary-text-pressed', light: textPressed, dark: textPressed, description: 'Septenary button pressed text' },
    { name: 'btn-septenary-text-disabled', light: textDisabled, dark: textDisabled, description: 'Septenary button disabled text' },
    // Icon
    { name: 'btn-septenary-icon-default', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Septenary button default icon' },
    { name: 'btn-septenary-icon-hover', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Septenary button hover icon' },
    { name: 'btn-septenary-icon-pressed', light: 'rgba(255, 255, 255, 1)', dark: 'rgba(255, 255, 255, 1)', description: 'Septenary button pressed icon' },
    { name: 'btn-septenary-icon-disabled', light: 'rgba(236, 253, 243, 1)', dark: 'rgba(236, 253, 243, 1)', description: 'Septenary button disabled icon' },
    // Border
    { name: 'btn-septenary-border-default', light: 'rgba(23, 178, 106, 1)', dark: 'rgba(23, 178, 106, 1)', description: 'Septenary button default border' },
    { name: 'btn-septenary-border-hover', light: 'rgba(7, 148, 85, 1)', dark: 'rgba(7, 148, 85, 1)', description: 'Septenary button hover border' },
    { name: 'btn-septenary-border-pressed', light: 'rgba(6, 118, 71, 1)', dark: 'rgba(6, 118, 71, 1)', description: 'Septenary button pressed border' },
    { name: 'btn-septenary-border-disabled', light: 'rgba(220, 250, 230, 1)', dark: 'rgba(220, 250, 230, 1)', description: 'Septenary button disabled border' }
  ];
};

// Generate header colors (14 colors)
const generateHeaderColors = () => {
  return [
    // Main Navigation
    { name: 'nav-main-bg', light: 'var(--bg-quinary_alt)', dark: 'var(--bg-quinary_alt)', description: 'Main navigation background' },
    { name: 'nav-main-sticky-bg', light: 'var(--white)', dark: 'var(--transparent-07)', description: 'Main navigation sticky background' },
    { name: 'nav-main-txt', light: 'var(--black)', dark: 'var(--white)', description: 'Main navigation text' },
    { name: 'nav-main-sticky-txt', light: 'var(--white)', dark: 'var(--white)', description: 'Main navigation sticky text' },
    { name: 'nav-main-border', light: 'var(--transparent-01)', dark: 'var(--transparent-01)', description: 'Main navigation border' },
    { name: 'nav-main-sticky-border', light: 'var(--transparent-02)', dark: 'var(--transparent-02)', description: 'Main navigation sticky border' },
    
    // Bottom Navigation
    { name: 'nav-bottom-bg', light: 'var(--bg-senary_alt)', dark: 'var(--bg-senary)', description: 'Bottom navigation background' },
    { name: 'nav-bottom-sticky-bg', light: 'var(--white)', dark: 'var(--white)', description: 'Bottom navigation sticky background' },
    { name: 'nav-bottom-txt', light: 'var(--black)', dark: 'var(--white)', description: 'Bottom navigation text' },
    { name: 'nav-bottom-sticky-txt', light: 'var(--white)', dark: 'var(--white)', description: 'Bottom navigation sticky text' },
    { name: 'nav-bottom-border', light: 'var(--transparent-01)', dark: 'var(--transparent-01)', description: 'Bottom navigation border' },
    { name: 'nav-bottom-sticky-border', light: 'var(--white)', dark: 'var(--white)', description: 'Bottom navigation sticky border' },
    
    // Promotion Navigation
    { name: 'nav-promotion-bg', light: 'var(--secondary-06)', dark: 'var(--secondary-06)', description: 'Navigation promotion background' },
    { name: 'nav-promotion-txt', light: 'var(--white)', dark: 'var(--white)', description: 'Navigation promotion text' }
  ];
};

// Generate odds colors (7 colors)
const generateOddsColors = () => {
  return [
    { name: 'odd-bg-column-1', light: 'var(--gray-03)', dark: 'var(--secondary-04)', description: 'Odds column 1 background' },
    { name: 'odd-bg-column-2', light: 'var(--gray-02)', dark: 'var(--secondary-03)', description: 'Odds column 2 background' },
    { name: 'odd-title', light: 'var(--bg-quinary_alt)', dark: 'var(--bg-quinary_alt)', description: 'Odds title background' },
    { name: 'odd-bg-red', light: 'var(--error-04)', dark: 'var(--error-02)', description: 'Odds red background' },
    { name: 'odd-bg-green', light: 'var(--success-04)', dark: 'var(--success-02)', description: 'Odds green background' },
    { name: 'odd-bg-disabled', light: 'var(--bg-senary)', dark: 'var(--bg-senary)', description: 'Odds disabled background' },
    { name: 'odd-bg-hover', light: 'var(--gray-04)', dark: 'var(--secondary-02)', description: 'Odds hover background' }
  ];
};

// Generate sidebar nav colors (12 colors)
const generateSidebarNavColors = () => {
  return [
    { name: 'sidebar-item-icon-default', light: 'var(--gray-07)', dark: 'var(--gray-08)', description: 'Sidebar nav item icon default' },
    { name: 'sidebar-item-icon-hover', light: 'var(--gray-06)', dark: 'var(--gray-09)', description: 'Sidebar nav item icon hover' },
    { name: 'sidebar-item-icon-active', light: 'var(--primary-06)', dark: 'var(--primary-06)', description: 'Sidebar nav item icon active' },
    { name: 'sidebar-item-icon-bg-default', light: 'var(--transparent-01)', dark: 'var(--transparent-01)', description: 'Sidebar nav item icon background default' },
    { name: 'sidebar-item-icon-bg-hover', light: 'var(--transparent-02)', dark: 'var(--transparent-02)', description: 'Sidebar nav item icon background hover' },
    { name: 'sidebar-item-icon-bg-active', light: 'var(--primary-10)', dark: 'var(--primary-10)', description: 'Sidebar nav item icon background active' },
    { name: 'sidebar-item-text-default', light: 'var(--gray-08)', dark: 'var(--gray-08)', description: 'Sidebar nav item text default' },
    { name: 'sidebar-item-text-hover', light: 'var(--gray-06)', dark: 'var(--gray-09)', description: 'Sidebar nav item text hover' },
    { name: 'sidebar-item-text-active', light: 'var(--primary-06)', dark: 'var(--primary-06)', description: 'Sidebar nav item text active' },
    { name: 'sidebar-item-bg-default', light: 'var(--transparent-0-bg)', dark: 'var(--transparent-0-bg)', description: 'Sidebar nav item background default' },
    { name: 'sidebar-item-bg-hover', light: 'var(--transparent-02)', dark: 'var(--transparent-02)', description: 'Sidebar nav item background hover' },
    { name: 'sidebar-item-bg-active', light: 'var(--primary-10)', dark: 'var(--primary-10)', description: 'Sidebar nav item background active' }
  ];
};

// Generate sidebar button colors (22 colors)
const generateSidebarButtonColors = () => {
  const primaryBgDefault = 'var(--gray-02)';
  const primaryBgHover = 'var(--gray-03)';
  const primaryBgActive = 'var(--success-06)';
  
  const secondaryBgDefault = 'var(--gray-02)';
  const secondaryBgHover = 'var(--gray-03)';
  const secondaryBgActive = 'var(--warning-06)';
  
  const tertiaryBgDefault = 'var(--gray-02)';
  const tertiaryBgHover = 'var(--gray-03)';
  const tertiaryBgActive = 'var(--primary-06)';
  
  const primaryTextDefault = getOptimalTextColor(primaryBgDefault);
  const primaryTextHover = getOptimalTextColor(primaryBgHover);
  const primaryTextActive = getOptimalTextColor(primaryBgActive);
  
  const secondaryTextDefault = getOptimalTextColor(secondaryBgDefault);
  const secondaryTextHover = getOptimalTextColor(secondaryBgHover);
  const secondaryTextActive = getOptimalTextColor(secondaryBgActive);
  
  const tertiaryTextDefault = getOptimalTextColor(tertiaryBgDefault);
  const tertiaryTextHover = getOptimalTextColor(tertiaryBgHover);
  const tertiaryTextActive = getOptimalTextColor(tertiaryBgActive);

  return [
    { name: 'sidebar-button-icon-default', light: 'var(--gray-07)', dark: 'var(--gray-08)', description: 'Sidebar button icon default' },
    { name: 'sidebar-button-icon-hover', light: 'var(--gray-06)', dark: 'var(--gray-09)', description: 'Sidebar button icon hover' },
    { name: 'sidebar-button-icon-active', light: 'var(--icon-01)', dark: 'var(--icon-01)', description: 'Sidebar button icon active' },
    { name: 'sidebar-background-icon', light: 'var(--transparent-03)', dark: 'var(--transparent-04)', description: 'Sidebar background icon' },
    
    // Primary Sidebar Button
    { name: 'sidebar-primary-btn-bg-default', light: primaryBgDefault, dark: primaryBgDefault, description: 'Sidebar primary button background default' },
    { name: 'sidebar-primary-btn-bg-hover', light: primaryBgHover, dark: primaryBgHover, description: 'Sidebar primary button background hover' },
    { name: 'sidebar-primary-btn-bg-active', light: primaryBgActive, dark: primaryBgActive, description: 'Sidebar primary button background active' },
    { name: 'sidebar-primary-btn-text-default', light: primaryTextDefault, dark: primaryTextDefault, description: 'Sidebar primary button text default - WCAG optimized' },
    { name: 'sidebar-primary-btn-text-hover', light: primaryTextHover, dark: primaryTextHover, description: 'Sidebar primary button text hover - WCAG optimized' },
    { name: 'sidebar-primary-btn-text-active', light: primaryTextActive, dark: primaryTextActive, description: 'Sidebar primary button text active - WCAG optimized' },
    
    // Secondary Sidebar Button
    { name: 'sidebar-secondary-btn-bg-default', light: secondaryBgDefault, dark: secondaryBgDefault, description: 'Sidebar secondary button background default' },
    { name: 'sidebar-secondary-btn-bg-hover', light: secondaryBgHover, dark: secondaryBgHover, description: 'Sidebar secondary button background hover' },
    { name: 'sidebar-secondary-btn-bg-active', light: secondaryBgActive, dark: secondaryBgActive, description: 'Sidebar secondary button background active' },
    { name: 'sidebar-secondary-btn-text-default', light: secondaryTextDefault, dark: secondaryTextDefault, description: 'Sidebar secondary button text default - WCAG optimized' },
    { name: 'sidebar-secondary-btn-text-hover', light: secondaryTextHover, dark: secondaryTextHover, description: 'Sidebar secondary button text hover - WCAG optimized' },
    { name: 'sidebar-secondary-btn-text-active', light: secondaryTextActive, dark: secondaryTextActive, description: 'Sidebar secondary button text active - WCAG optimized' },
    
    // Tertiary Sidebar Button
    { name: 'sidebar-tertiary-btn-bg-default', light: tertiaryBgDefault, dark: tertiaryBgDefault, description: 'Sidebar tertiary button background default' },
    { name: 'sidebar-tertiary-btn-bg-hover', light: tertiaryBgHover, dark: tertiaryBgHover, description: 'Sidebar tertiary button background hover' },
    { name: 'sidebar-tertiary-btn-bg-active', light: tertiaryBgActive, dark: tertiaryBgActive, description: 'Sidebar tertiary button background active' },
    { name: 'sidebar-tertiary-btn-text-default', light: tertiaryTextDefault, dark: tertiaryTextDefault, description: 'Sidebar tertiary button text default - WCAG optimized' },
    { name: 'sidebar-tertiary-btn-text-hover', light: tertiaryTextHover, dark: tertiaryTextHover, description: 'Sidebar tertiary button text hover - WCAG optimized' },
    { name: 'sidebar-tertiary-btn-text-active', light: tertiaryTextActive, dark: tertiaryTextActive, description: 'Sidebar tertiary button text active - WCAG optimized' }
  ];
};

// Generate transparency colors (24 colors)
const generateTransparencyColors = (primaryHex, secondaryHex) => {
  const transparencies = [];
  
  // Fixed transparency levels 01-10 (white-based transparency)
  const transparencyLevels = [
    { num: '01', opacity: 0.03 },
    { num: '02', opacity: 0.07 },
    { num: '03', opacity: 0.1 },
    { num: '04', opacity: 0.15 },
    { num: '05', opacity: 0.2 },
    { num: '06', opacity: 0.25 },
    { num: '07', opacity: 0.3 },
    { num: '08', opacity: 0.35 },
    { num: '09', opacity: 0.4 },
    { num: '10', opacity: 0.45 }
  ];
  
  transparencyLevels.forEach(level => {
    transparencies.push({
      name: `transparent-${level.num}`,
      light: `rgba(255, 255, 255, ${level.opacity})`,
      dark: `rgba(255, 255, 255, ${level.opacity})`,
      description: `Transparency level ${level.num}`
    });
  });
  
  // Primary color transparencies
  transparencies.push({
    name: 'transparent-primary-10',
    light: 'rgba(250, 121, 30, 0.1)',
    dark: 'rgba(250, 121, 30, 0.1)',
    description: 'Primary color 10% transparency'
  });
  
  transparencies.push({
    name: 'transparent-primary-50',
    light: 'rgba(250, 121, 30, 0.5)',
    dark: 'rgba(250, 121, 30, 0.5)',
    description: 'Primary color 50% transparency'
  });
  
  // Warning color transparency
  transparencies.push({
    name: 'transparent-warning-10',
    light: 'rgba(247, 144, 9, 0.1)',
    dark: 'rgba(247, 144, 9, 0.1)',
    description: 'Warning color 10% transparency'
  });
  
  // Error color transparency
  transparencies.push({
    name: 'transparent-error-10',
    light: 'rgba(240, 68, 56, 0.1)',
    dark: 'rgba(240, 68, 56, 0.1)',
    description: 'Error color 10% transparency'
  });
  
  // Special background transparencies
  transparencies.push({
    name: 'transparent-0-bg',
    light: 'rgba(12, 17, 29, 0)',
    dark: 'rgba(12, 17, 29, 0)',
    description: 'Transparent background 0%'
  });
  
  transparencies.push({
    name: 'transparent-50-bg',
    light: 'rgba(12, 17, 29, 0.5)',
    dark: 'rgba(12, 17, 29, 0.5)',
    description: 'Transparent background 50%'
  });
  
  // Black transparencies (10% to 50%)
  const blackOpacities = [10, 20, 30, 40, 50];
  blackOpacities.forEach(opacity => {
    transparencies.push({
      name: `black-${opacity}`,
      light: `rgba(12, 17, 29, ${opacity / 100})`,
      dark: `rgba(12, 17, 29, ${opacity / 100})`,
      description: `Black ${opacity}% transparency`
    });
  });
    
  // White transparencies (10% to 50%)
  const whiteOpacities = [10, 20, 30, 40, 50];
  whiteOpacities.forEach(opacity => {
    transparencies.push({
      name: `white-${opacity}`,
      light: `rgba(255, 255, 255, ${opacity / 100})`,
      dark: `rgba(255, 255, 255, ${opacity / 100})`,
      description: `White ${opacity}% transparency`
    });
  });
  
  // Shadow transparency
  transparencies.push({
    name: 'shadow-01',
    light: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.2)',
    description: 'Shadow transparency 01'
  });
  
  return transparencies;
};

// Main function to generate complete color system
const generateCompleteColorSystem = (primaryHex, secondaryHex, options = {}) => {
  const {
    grayTheme = 'auto',
    backgroundTheme = 'auto'
  } = options;

  // Validate inputs
  if (!isValidHexColor(primaryHex)) {
    throw new Error(`Invalid primary color: ${primaryHex}`);
  }
  if (!isValidHexColor(secondaryHex)) {
    throw new Error(`Invalid secondary color: ${secondaryHex}`);
  }

  return {
    base: generateBaseColors(primaryHex, secondaryHex),
    primary: generateShades(primaryHex, 'primary'),
    secondary: generateShades(secondaryHex, 'secondary'),
    gray: generateGrayShades(primaryHex, secondaryHex, grayTheme),
    error: generateErrorColors(),
    warning: generateWarningColors(),
    success: generateSuccessColors(),
    info: generateInfoColors(),
    interfaceBg: generateInterfaceBackgrounds(primaryHex, secondaryHex, backgroundTheme),
    text: generateTextColors(primaryHex, secondaryHex),
    icon: generateIconColors(primaryHex, secondaryHex),
    border: generateBorderColors(),
    card: generateCardColors(),
    input: generateInputColors(),
    buttonPrimary: generatePrimaryButtonColors(primaryHex),
    buttonSecondary: generateSecondaryButtonColors(secondaryHex),
    buttonTertiary: generateTertiaryButtonColors(),
    buttonQuaternary: generateQuaternaryButtonColors(),
    buttonQuinary: generateQuinaryButtonColors(),
    buttonSenary: generateSenaryButtonColors(),
    buttonSeptenary: generateSeptenaryButtonColors(),
    header: generateHeaderColors(),
    odds: generateOddsColors(),
    sidebarNav: generateSidebarNavColors(),
    sidebarButton: generateSidebarButtonColors(),
    transparency: generateTransparencyColors(primaryHex, secondaryHex),
    metadata: {
      primaryColor: primaryHex,
      secondaryColor: secondaryHex,
      grayTheme,
      backgroundTheme,
      generatedAt: new Date().toISOString()
    }
  };
};

// Get available themes
const getAvailableThemes = () => {
  return {
    grayThemes: [
      { id: 'auto', name: 'Smart Auto', description: 'Based on primary color', icon: '🔗' },
      { id: 'blue', name: 'Blue Grays', description: 'Cool professional tone', icon: '❄️' },
      { id: 'green-brown', name: 'Warm Earth', description: 'Brown & green undertones', icon: '🌿' },
      { id: 'black', name: 'Pure Black', description: 'Classic monochrome', icon: '⚫' },
      { id: 'neutral', name: 'Neutral Gray', description: 'Pure balanced grays', icon: '⚪' }
    ],
    backgroundThemes: [
      { id: 'auto', name: 'Smart Auto', description: 'Complementary harmony', icon: '🔗' },
      { id: 'blue', name: 'Deep Blue', description: 'Navy & midnight tones', icon: '🌊' },
      { id: 'green-brown', name: 'Earth Tones', description: 'Warm charcoal & brown', icon: '🏔️' },
      { id: 'black', name: 'Pure Black', description: 'Classic dark theme', icon: '🌚' },
      { id: 'neutral', name: 'Neutral Gray', description: 'Balanced dark grays', icon: '🌫️' }
    ]
  };
};

module.exports = {
  generateSecondaryColorSuggestions,
  generateCompleteColorSystem,
  getAvailableThemes,
  isValidHexColor,
  hexToHsl,
  hslToHex
};