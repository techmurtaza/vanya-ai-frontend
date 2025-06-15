/**
 * Color Theme Configuration for Ask Rezzy Client
 * 
 * This file defines the color palette used throughout the application for both
 * light and dark themes. The colors are organized to provide consistent theming
 * across all UI components and ensure proper accessibility and visual hierarchy.
 * 
 * The theme system supports automatic switching between light and dark modes
 * based on the user's system preferences.
 */

// Primary tint color for light theme - used for active states, buttons, and highlights
const tintColorLight = '#2f95dc';

// Primary tint color for dark theme - typically white or light color for contrast
const tintColorDark = '#fff';

/**
 * Exported color theme object containing light and dark mode configurations
 * 
 * Each theme contains:
 * - text: Primary text color for readability
 * - background: Main background color for screens
 * - tint: Accent color for interactive elements
 * - tabIconDefault: Inactive tab icon color
 * - tabIconSelected: Active tab icon color (uses tint color)
 */
export default {
  light: {
    text: '#000',                    // Black text for light backgrounds
    background: '#fff',              // White background
    tint: tintColorLight,           // Blue accent color
    tabIconDefault: '#ccc',         // Light gray for inactive tabs
    tabIconSelected: tintColorLight, // Blue for active tabs
  },
  dark: {
    text: '#fff',                   // White text for dark backgrounds
    background: '#000',             // Black background
    tint: tintColorDark,           // White accent color
    tabIconDefault: '#ccc',        // Gray for inactive tabs (same as light)
    tabIconSelected: tintColorDark, // White for active tabs
  },
};
