/**
 * 404 Not Found Screen Component for Ask Rezzy Client
 * 
 * This component renders when users navigate to a route that doesn't exist
 * in the application. It provides a user-friendly error message and a way
 * to navigate back to the main application, following standard UX patterns
 * for handling navigation errors.
 * 
 * Key Features:
 * - Clear error messaging for user understanding
 * - Navigation link back to the home screen
 * - Consistent styling with the rest of the application
 * - Proper screen title configuration for navigation
 * 
 * The component uses Expo Router's navigation system to provide seamless
 * recovery from navigation errors while maintaining the overall app experience.
 */

import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

/**
 * Not Found Screen Component
 * 
 * Renders a 404-style error screen when users access non-existent routes.
 * Provides clear messaging and navigation options to help users return to
 * the main application flow.
 * 
 * The component uses the themed Text and View components to ensure consistent
 * styling with the rest of the application's design system.
 * 
 * @returns {JSX.Element} 404 error screen with navigation options
 */
export default function NotFoundScreen() {
  return (
    <>
      {/* Configure the screen title in the navigation header */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      {/* Main error content container */}
      <View style={styles.container}>
        {/* Primary error message */}
        <Text style={styles.title}>This screen doesn't exist.</Text>

        {/* Navigation link back to home screen */}
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

/**
 * StyleSheet for Not Found Screen
 * 
 * Defines the layout and styling for the 404 error screen.
 * Uses centered layout with appropriate spacing and typography
 * to create a clean, user-friendly error experience.
 */
const styles = StyleSheet.create({
  // Main container with centered content
  container: {
    flex: 1,                        // Take full available height
    alignItems: 'center',           // Center content horizontally
    justifyContent: 'center',       // Center content vertically
    padding: 20,                    // Padding around content
  },
  
  // Error title styling
  title: {
    fontSize: 20,                   // Large font size for prominence
    fontWeight: 'bold',             // Bold font weight for emphasis
  },
  
  // Navigation link container styling
  link: {
    marginTop: 15,                  // Space above link
    paddingVertical: 15,            // Vertical padding for touch target
  },
  
  // Navigation link text styling
  linkText: {
    fontSize: 14,                   // Medium font size
    color: '#2e78b7',               // Blue color indicating clickable link
  },
});
