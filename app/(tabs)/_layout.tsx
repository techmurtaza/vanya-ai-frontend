/**
 * Tab Layout Component for Ask Rezzy Medical Education Client
 * 
 * This component defines the main navigation structure for the medical education
 * application. It provides the main medical education chat interface with a 
 * real-time connection status indicator in the header. The layout integrates
 * with the medical education chat system to provide WebSocket connection
 * monitoring and ensures proper context management.
 * 
 * Key Features:
 * - Single tab navigation for medical education chat
 * - Real-time WebSocket connection status indicator
 * - Medical education chat provider integration for WebSocket functionality
 * - Theme-aware styling with medical education colors
 * - Cross-platform header configuration
 * 
 * The component wraps the navigation with a ChatProvider to ensure WebSocket
 * functionality is available throughout the navigation tree, particularly
 * for the connection status indicator and medical education chat functionality.
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
 * Medical Education Connection Status Indicator Component
 * 
 * This component displays the current WebSocket connection status in the medical
 * education chat tab header. It provides real-time visual feedback about the
 * connection state using color-coded indicators and status text specific to
 * the medical education platform.
 * 
 * Status States:
 * - Connecting: Orange indicator with "Connecting to Medical AI..." text
 * - Open: Green indicator with "Medical AI Connected" text  
 * - Closed: Red indicator with "Medical AI Disconnected" text
 * 
 * The component uses the medical education chat context to access the current
 * socket status and updates automatically when the connection state changes.
 */
function ConnectionStatus() {
  // Get current socket status from medical education chat context
  const { socketStatus }: { socketStatus: SocketStatus } = useChat();
  
  // Define color mapping for different connection states
  const color = {
    connecting: '#F59E0B',  // Orange/amber for connecting state
    open: '#10B981',        // Green for successful connection
    closed: '#EF4444',      // Red for disconnected state
  }[socketStatus];

  // Define text mapping for different connection states with medical context
  const statusText = {
    connecting: 'Connecting to Medical AI...',    // Loading state text
    open: 'Medical AI Connected',                 // Success state text
    closed: 'Medical AI Disconnected',           // Error/offline state text
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
 * Provides consistent styling and sizing for medical education tab icons.
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * Medical Education Tab Layout Component
 * 
 * The main tab navigation component that defines the structure and configuration
 * for the medical education application. It wraps the entire tab navigation with
 * a ChatProvider to ensure WebSocket functionality is available throughout.
 * 
 * Tab Configuration:
 * - Medical Education Chat Tab: Main medical education interface with connection status
 * 
 * The component handles theme integration, cross-platform header configuration,
 * and provides the necessary context for real-time medical education features.
 */
export default function TabLayout() {
  // Get current color scheme for theme-aware styling
  const colorScheme = useColorScheme();

  return (
    <ChatProvider>
      <Tabs
        screenOptions={{
          // Use theme-appropriate tint color for active tabs with medical theme
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          
          // Disable the static render of the header on web to prevent hydration error
          // in React Navigation v6. This ensures proper SSR/client-side rendering
          headerShown: useClientOnlyValue(false, true),
        }}>
        
        {/* Medical Education Chat Tab - Main medical education interface */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Medical Education',                              // Updated tab title
            tabBarIcon: ({ color }) => <TabBarIcon name="user-md" color={color} />, // Medical icon
            headerRight: () => <ConnectionStatus />,                 // Medical AI connection status
          }}
        />
      </Tabs>
    </ChatProvider>
  );
}
