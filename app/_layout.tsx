/**
 * Root Layout Component for Ask Rezzy Client
 * 
 * This is the main layout component that sets up the entire application structure,
 * including providers, navigation, session management, and global configurations.
 * It serves as the entry point for the React Native/Expo application and handles
 * the initialization flow before rendering the main app content.
 * 
 * Key Responsibilities:
 * - Font loading and asset management
 * - Provider setup (React Query, Session, Theme)
 * - Session initialization with backend
 * - Global loading states and error handling
 * - Navigation configuration and routing
 * - Theme and color scheme management
 * 
 * The layout follows a hierarchical provider pattern to ensure proper context
 * availability throughout the component tree while maintaining clean separation
 * of concerns for different application layers.
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { SessionProvider, useSession } from '@/lib/context/SessionContext';
import { apiClient } from '@/config/api';

// Export error boundary for handling navigation and component errors
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Expo Router configuration for initial route setup
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// This ensures a smooth loading experience while fonts and other assets load
SplashScreen.preventAutoHideAsync();

/**
 * React Query Client Configuration
 * 
 * Creates a configured QueryClient instance for managing server state,
 * caching API responses, and handling background refetching throughout
 * the application. Uses default settings optimized for mobile usage.
 */
const queryClient = new QueryClient();

/**
 * App Initializer Component
 * 
 * This component handles the critical session initialization process that
 * must complete before the main app can function. It communicates with
 * the backend to establish a user session and manages the loading state
 * during this process.
 * 
 * Initialization Process:
 * 1. Component mounts and triggers session initialization
 * 2. Makes API call to backend /session/init endpoint
 * 3. Stores received session ID in session context
 * 4. Updates loading state to allow app rendering
 * 5. Handles any initialization errors gracefully
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render after init
 * @returns {JSX.Element} Children components (rendered after session init)
 */
function AppInitializer({ children }: { children: React.ReactNode }) {
  // Get session management functions from session context
  const { setSessionId, setIsLoading } = useSession();

  /**
   * Session Initialization Effect
   * 
   * Runs once when the component mounts to establish a session with
   * the backend server. This session ID is required for all subsequent
   * API calls including file uploads, chat, and search functionality.
   */
  useEffect(() => {
    /**
     * Async Session Initialization Function
     * 
     * Handles the actual API call to initialize a session and manages
     * the loading state throughout the process. Includes error handling
     * for network failures or backend issues.
     */
    const initializeSession = async () => {
      try {
        // Make API call to initialize session
        const { data } = await apiClient.get('/session/init');
        
        // Store session ID if received from backend
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        // Handle session init failure - app may still function with limited features
        // In production, you might want to show an error message or retry logic
      } finally {
        // Always set loading to false, even if initialization failed
        // This prevents the app from being stuck in loading state
        setIsLoading(false);
      }
    };

    // Start the session initialization process
    initializeSession();
  }, [setSessionId, setIsLoading]); // Dependencies: session management functions

  // Render children after initialization attempt (successful or failed)
  return <>{children}</>;
}

/**
 * Root Layout Component
 * 
 * The main layout component that sets up the entire application structure.
 * Handles font loading, provider setup, and renders the navigation structure
 * once all prerequisites are met.
 * 
 * @returns {JSX.Element} Complete application layout with providers and navigation
 */
export default function RootLayout() {
  // Load custom fonts including FontAwesome icons
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Custom monospace font
    ...FontAwesome.font, // FontAwesome icon font
  });

  /**
   * Font Loading Error Handler
   * 
   * If font loading fails, throw the error to be caught by the error boundary.
   * This prevents the app from rendering with missing fonts which could
   * cause layout issues or missing icons.
   */
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  /**
   * Splash Screen Management
   * 
   * Hide the splash screen once fonts are loaded and the app is ready
   * to render. This ensures a smooth transition from splash to app content.
   */
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Don't render anything until fonts are loaded
  if (!loaded) {
    return null;
  }

  // Render the complete app structure with all providers
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AppInitializer>
          <RootLayoutNav />
        </AppInitializer>
      </SessionProvider>
    </QueryClientProvider>
  );
}

/**
 * Root Layout Navigation Component
 * 
 * This component handles the navigation structure and theme setup for the app.
 * It manages the loading state during session initialization and renders the
 * appropriate navigation stack once the app is ready.
 * 
 * @returns {JSX.Element} Navigation structure with theme provider
 */
function RootLayoutNav() {
  // Get current color scheme for theme selection
  const colorScheme = useColorScheme();
  
  // Get loading state from session context
  const { isLoading } = useSession();

  /**
   * Loading State Renderer
   * 
   * Shows a loading indicator while the session is being initialized.
   * This prevents users from seeing incomplete UI or attempting to
   * use features that require session authentication.
   */
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * Main Navigation Structure
   * 
   * Renders the complete navigation stack with theme support.
   * Uses React Navigation's theme system to provide consistent
   * styling across all navigation elements.
   */
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main tab navigation - hidden header since tabs handle their own */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Modal screen with modal presentation style */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
