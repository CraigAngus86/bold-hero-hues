
export const theme = {
  colors: {
    primary: '#00105A',      // Primary club color - deep blue
    secondary: '#C5E7FF',    // Secondary club color - light blue
    accent: '#FFD700',       // Accent color - gold/yellow
    darkText: '#1A1F2C',     // Dark text color
    lightText: '#FFFFFF',    // Light text color
    grayBg: '#F5F7FA',       // Light gray background
    success: '#10B981',      // Success color - green
    warning: '#F59E0B',      // Warning color - amber
    error: '#EF4444'         // Error color - red
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// Theme for the tailwind.config.js
export const tailwindTheme = {
  extend: {
    colors: {
      'team-blue': theme.colors.primary,
      'team-lightBlue': theme.colors.secondary,
      'team-accent': theme.colors.accent,
      'team-gray': theme.colors.grayBg
    },
    fontFamily: {
      sans: theme.fonts.body,
      heading: theme.fonts.heading,
    },
    boxShadow: {
      'team': '0 4px 14px 0 rgba(0, 16, 90, 0.1)',
    },
  },
};
