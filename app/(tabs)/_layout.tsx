/**
 * Tab Layout Component for Ask Rezzy Client
 * 
 * This component defines the main tab-based navigation structure for the application.
 * It provides two primary tabs: Chat and Results, with a real-time connection status
 * indicator in the chat tab header. The layout integrates with the chat system to
 * provide WebSocket connection monitoring and ensures proper context management.
 * 
 * Key Features:
 * - Two-tab navigation (Chat and Results)
 * - Real-time WebSocket connection status indicator
 * - Chat provider integration for WebSocket functionality
 * - Theme-aware tab styling and icons
 * - Cross-platform header configuration
 * 
 * The component wraps the tab navigation with a ChatProvider to ensure WebSocket
 * functionality is available throughout the tab navigation tree, particularly
 * for the connection status indicator and chat functionality.
 */

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useChat } from '@/lib/context/ChatContext';
import { SocketStatus } from '@/lib/hooks/useChatStream';
import { ChatProvider } from '@/lib/context/ChatContext';

/**
 * Connection Status Indicator Component
 * 
 * This component displays the current WebSocket connection status in the chat
 * tab header. It provides real-time visual feedback about the connection state
 * using color-coded indicators and status text.
 * 
 * Status States:
 * - Connecting: Orange indicator with "Connecting..." text
 * - Open: Green indicator with "Connected" text  
 * - Closed: Red indicator with "Disconnected" text
 * 
 * The component uses the chat context to access the current socket status
 * and updates automatically when the connection state changes.
 * 
 * @returns {JSX.Element} Connection status indicator with colored dot and text
 */
function ConnectionStatus() {
  // Get current socket status from chat context
  const { socketStatus }: { socketStatus: SocketStatus } = useChat();
  
  // Define color mapping for different connection states
  const color = {
    connecting: '#F59E0B',  // Orange/amber for connecting state
    open: '#10B981',        // Green for successful connection
    closed: '#EF4444',      // Red for disconnected state
  }[socketStatus];

  // Define text mapping for different connection states
  const statusText = {
    connecting: 'Connecting...',    // Loading state text
    open: 'Connected',              // Success state text
    closed: 'Disconnected',        // Error/offline state text
  }[socketStatus];

  return (
    <View style={{ 
      flexDirection: 'row',           // Horizontal layout for dot and text
      alignItems: 'center',           // Center items vertically
      marginRight: 15,                // Right margin for header spacing
      paddingHorizontal: 8,           // Horizontal padding inside container
      paddingVertical: 4,             // Vertical padding inside container
      borderRadius: 12,               // Rounded container background
      backgroundColor: 'rgba(0,0,0,0.05)' // Subtle background tint
    }}>
      {/* Status indicator dot */}
      <View style={{ 
        width: 8,                     // Dot width
        height: 8,                    // Dot height
        borderRadius: 4,              // Circular shape (half of width/height)
        backgroundColor: color,       // Dynamic color based on status
        marginRight: 6                // Space between dot and text
      }} />
      
      {/* Status text */}
      <Text style={{ 
        fontSize: 12,                 // Small font size for header
        color: '#666',                // Gray text color
        fontWeight: '500'             // Medium font weight
      }}>
        {statusText}
      </Text>
    </View>
  );
}

/**
 * Tab Bar Icon Component
 * 
 * A reusable component for rendering FontAwesome icons in the tab bar.
 * Provides consistent styling and sizing for all tab icons.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - FontAwesome icon name
 * @param {string} props.color - Icon color (provided by tab navigation)
 * @returns {JSX.Element} Styled FontAwesome icon
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * Tab Layout Component
 * 
 * The main tab navigation component that defines the structure and configuration
 * for the two primary app tabs. It wraps the entire tab navigation with a
 * ChatProvider to ensure WebSocket functionality is available throughout.
 * 
 * Tab Configuration:
 * - Chat Tab (index): Main chat interface with connection status
 * - Results Tab: Document search and results interface
 * 
 * The component handles theme integration, cross-platform header configuration,
 * and provides the necessary context for real-time features.
 * 
 * @returns {JSX.Element} Complete tab navigation with chat provider
 */
export default function TabLayout() {
  // Get current color scheme for theme-aware styling
  const colorScheme = useColorScheme();

  return (
    <ChatProvider>
      <Tabs
        screenOptions={{
          // Use theme-appropriate tint color for active tabs
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          
          // Disable the static render of the header on web to prevent hydration error
          // in React Navigation v6. This ensures proper SSR/client-side rendering
          headerShown: useClientOnlyValue(false, true),
        }}>
        
        {/* Chat Tab - Main conversation interface */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Chat',                                    // Tab title
            tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />, // Chat icon
            headerRight: () => <ConnectionStatus />,          // Connection status in header
          }}
        />
        
        {/* Results Tab - Document search interface */}
        <Tabs.Screen
          name="results"
          options={{
            title: 'Results',                                 // Tab title
            tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />, // List icon
          }}
        />
      </Tabs>
    </ChatProvider>
  );
}
