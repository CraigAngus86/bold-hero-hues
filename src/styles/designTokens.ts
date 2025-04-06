
/**
 * Design System Tokens
 * 
 * This file contains centralized design tokens that should be used
 * throughout the application to ensure consistency.
 */

export const colors = {
  primary: {
    50: '#E6E7F0',
    100: '#C2C4DB',
    200: '#9A9DC5',
    300: '#7276AF',
    400: '#4A509A',
    500: '#232984',
    600: '#1A2075',
    700: '#111866',
    800: '#00105A', // Main primary color
    900: '#000A47',
  },
  secondary: {
    50: '#F5FBFF',
    100: '#E8F7FF',
    200: '#DCEEFF',
    300: '#C5E7FF', // Main secondary color
    400: '#A3D5FF',
    500: '#75BEFF',
    600: '#47A6FF',
    700: '#1A8EFF', 
    800: '#0076EC',
    900: '#0061C3',
  },
  accent: {
    300: '#FFDF4D',
    400: '#FFD81A',
    500: '#FFD700', // Main accent color
    600: '#E6C200',
    700: '#CCAC00',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const typography = {
  pageTitle: "text-2xl font-bold text-primary-800",
  sectionHeader: "text-xl font-semibold text-primary-800",
  formLabel: "text-base font-medium text-primary-700",
  bodyText: "text-base font-normal text-gray-700",
  smallText: "text-sm text-gray-600",
  tableHeader: "text-sm font-medium text-gray-500 uppercase tracking-wider",
};

export const spacing = {
  cardPadding: "p-4 md:p-6",
  sectionMargin: "mb-6",
  contentGap: "gap-4",
  pageContainer: "p-4 md:p-6 lg:p-8",
};

export const layoutStyles = {
  pageContainer: "container mx-auto px-4 py-6",
  sectionContainer: "bg-white rounded-lg shadow-sm border",
  cardContent: "p-4 md:p-6",
  formGroup: "space-y-2",
  formRow: "grid grid-cols-1 md:grid-cols-2 gap-4",
  tableContainer: "overflow-x-auto rounded-md border",
};
