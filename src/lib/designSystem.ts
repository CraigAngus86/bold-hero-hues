
/**
 * Banks o' Dee FC Design System
 * 
 * A comprehensive design system for the Banks o' Dee FC website
 * inspired by elite football clubs while maintaining the club's identity.
 */

export const designSystem = {
  colors: {
    // Primary palette
    primary: '#00105A',
    primaryLight: '#001A8D',
    primaryDark: '#000C42',
    
    // Secondary palette
    secondary: '#C5E7FF',
    secondaryLight: '#E8F5FF',
    secondaryDark: '#92CCFF',
    
    // Accent colors
    accent: '#FFD700',
    accentLight: '#FFDF4D',
    accentDark: '#E6C200',
    
    // Neutrals
    white: '#FFFFFF',
    black: '#000000',
    grey100: '#F8F9FA',
    grey200: '#E9ECEF',
    grey300: '#DEE2E6',
    grey400: '#CED4DA',
    grey500: '#ADB5BD',
    grey600: '#6C757D',
    grey700: '#495057',
    grey800: '#343A40',
    grey900: '#212529',
    
    // UI feedback colors
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
    
    // Gradient definitions
    gradients: {
      primaryGradient: 'linear-gradient(135deg, #00105A 0%, #001A8D 100%)',
      accentGradient: 'linear-gradient(135deg, #00105A 0%, #FFD700 100%)',
      focusGradient: 'linear-gradient(135deg, #001A8D 0%, #0026C2 100%)',
    }
  },
  
  typography: {
    fontFamily: {
      heading: '"Montserrat", sans-serif',
      body: '"Open Sans", sans-serif',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
    fontSize: {
      // Using clamp for responsive sizing
      h1: 'clamp(2.5rem, 5vw, 4rem)',
      h2: 'clamp(2rem, 4vw, 3.5rem)',
      h3: 'clamp(1.5rem, 3vw, 2.5rem)',
      h4: 'clamp(1.25rem, 2vw, 1.75rem)',
      h5: 'clamp(1rem, 1.5vw, 1.5rem)',
      h6: 'clamp(0.875rem, 1vw, 1.25rem)',
      body: 'clamp(0.875rem, 1vw, 1rem)',
      small: 'clamp(0.75rem, 0.9vw, 0.875rem)',
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      loose: 1.8,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.05em',
    },
  },
  
  spacing: {
    xxs: '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '5rem',
  },
  
  motion: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms',
    },
    easing: {
      easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    animations: {
      fadeIn: {
        keyframes: 'fade-in',
        duration: '0.5s',
      },
      slideUp: {
        keyframes: 'slide-up',
        duration: '0.4s',
      },
      slideIn: {
        keyframes: 'slide-in',
        duration: '0.4s',
      },
      pulse: {
        keyframes: 'pulse',
        duration: '2s',
        iterationCount: 'infinite',
      },
    },
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    lg: '0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
    xl: '0 20px 40px rgba(0,0,0,0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(197, 231, 255, 0.5)',
  },
  
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '1rem',
      full: '9999px',
    },
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
      accent: '4px',
    },
  },
  
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

export default designSystem;
