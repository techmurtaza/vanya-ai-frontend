/**
 * Chat Screen Component for Ask Rezzy Client
 * 
 * This is the main chat interface where users interact with the AI assistant.
 * It provides a complete chat experience with message history, real-time responses,
 * file upload capabilities, and responsive UI design. The screen handles the entire
 * conversation flow from user input to AI responses with proper error handling.
 * 
 * Key Features:
 * - Real-time chat with WebSocket streaming responses
 * - Auto-scrolling message list for optimal UX
 * - Integrated file upload functionality
 * - Typing indicators during AI response generation
 * - Error handling and user feedback
 * - Cross-platform keyboard handling
 * - Responsive design for different screen sizes
 * 
 * The component uses a dual-provider pattern to ensure proper context isolation
 * and prevent context conflicts while maintaining access to chat functionality.
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';

import { ChatProvider, useChat } from '@/lib/context/ChatContext';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';

/**
 * Chat Screen Content Component
 * 
 * This component contains the actual chat interface implementation. It's separated
 * from the main ChatScreen component to ensure proper context usage and avoid
 * hook-related issues with the ChatProvider wrapper.
 * 
 * The component manages the chat UI state, handles auto-scrolling, and coordinates
 * between different chat-related components to provide a seamless user experience.
 * 
 * @returns {JSX.Element} Complete chat interface with messages, input, and indicators
 */
function ChatScreenContent() {
  // Get chat functionality from context
  const { messages, input, isLoading, error, handleInputChange, handleSubmit } = useChat();
  
  // Reference to FlatList for programmatic scrolling control
  const flatListRef = useRef<FlatList>(null);

  /**
   * Auto-scroll Effect for New Messages
   * 
   * Automatically scrolls the message list to the bottom when new messages
   * are added. This ensures users always see the latest messages without
   * manual scrolling, providing a smooth chat experience.
   * 
   * The effect uses a small delay to ensure the message has been rendered
   * before attempting to scroll, preventing scroll position issues.
   */
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure message rendering is complete
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]); // Trigger when messages array changes

  /**
   * Error Display Component
   * 
   * Renders error messages when WebSocket connection issues or other
   * chat-related errors occur. Provides user-friendly error feedback
   * with appropriate styling and positioning.
   * 
   * @returns {JSX.Element | null} Error message component or null if no error
   */
  const renderError = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90} // Offset for tab bar height
    >
      {/* Message List - Displays all chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        showsVerticalScrollIndicator={false}
        // Additional auto-scroll trigger for content size changes
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Error Display - Shows connection or chat errors */}
      {renderError()}
      
      {/* Typing Indicator - Shows when AI is generating response */}
      {isLoading && <TypingIndicator />}
      
      {/* Chat Input - Text input and file upload interface */}
      <ChatInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </KeyboardAvoidingView>
  );
}

/**
 * Main Chat Screen Component
 * 
 * The primary chat screen component that wraps the chat content with the
 * necessary ChatProvider. This ensures that the chat functionality is
 * properly initialized and available to all child components.
 * 
 * The dual-provider pattern (one in tab layout, one here) ensures proper
 * context isolation and prevents potential context conflicts while maintaining
 * access to WebSocket functionality throughout the chat interface.
 * 
 * @returns {JSX.Element} Chat screen with provider wrapper
 */
export default function ChatScreen() {
  return (
    <ChatProvider>
      <ChatScreenContent />
    </ChatProvider>
  );
}

/**
 * StyleSheet for Chat Screen Components
 * 
 * Defines the visual styling for the chat interface including layout,
 * colors, spacing, and responsive design elements. Uses a modern design
 * with proper contrast and accessibility considerations.
 */
const styles = StyleSheet.create({
  // Main container with light background
  container: {
    flex: 1,                        // Take full available height
    backgroundColor: '#F9FAFB',     // Light gray background for modern look
  },
  
  // Message list styling
  messageList: {
    flex: 1,                        // Take remaining space above input
    padding: 16,                    // Padding around message list
  },
  
  // Error message container styling
  errorContainer: {
    margin: 16,                     // Margin around error container
    padding: 12,                    // Internal padding for error message
    backgroundColor: '#FEE2E2',     // Light red background for errors
    borderRadius: 8,                // Rounded corners
    alignItems: 'center',           // Center error text horizontally
  },
  
  // Error text styling
  errorText: {
    color: '#B91C1C',               // Dark red text for error visibility
    fontWeight: '500',              // Medium font weight for emphasis
  }
}); 