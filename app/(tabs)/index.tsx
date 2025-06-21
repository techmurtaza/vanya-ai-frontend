/**
 * Medical Education Chat Screen Component for Ask Rezzy Client
 * 
 * This is the main medical education interface where users interact with the AI
 * medical education assistant. It provides a complete chat experience with 
 * structured responses including MCQs, flashcards, medical FAQs, and educational
 * content with proper error handling and responsive UI design.
 * 
 * Key Features:
 * - Real-time medical education chat with WebSocket streaming
 * - Structured JSON response handling (MCQs, flashcards, FAQs)
 * - Auto-scrolling message list for optimal UX
 * - Interactive educational components with suggestion buttons
 * - Typing indicators during AI response generation
 * - Error handling and user feedback
 * - Cross-platform keyboard handling
 * - Professional medical education theme
 * 
 * The component uses the medical education context to ensure proper functionality
 * and provides interactive educational experiences beyond simple text chat.
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';

import { ChatProvider, useChat } from '@/lib/context/ChatContext';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';

/**
 * Medical Education Chat Screen Content Component
 * 
 * This component contains the actual medical education chat interface implementation.
 * It's separated from the main ChatScreen component to ensure proper context usage
 * and handles all the medical education specific functionality including interactive
 * components for MCQs, flashcards, and educational suggestions.
 */
function ChatScreenContent() {
  // Get medical education chat functionality from context
  const { messages, input, isLoading, error, handleInputChange, handleSubmit, sendMessage } = useChat();
  
  // Reference to FlatList for programmatic scrolling control
  const flatListRef = useRef<FlatList>(null);

  /**
   * Auto-scroll Effect for New Messages
   * 
   * Automatically scrolls the message list to the bottom when new messages
   * are added. This ensures users always see the latest medical education
   * content without manual scrolling, providing a smooth learning experience.
   */
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure message rendering is complete
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  /**
   * Error Display Component
   * 
   * Renders error messages when WebSocket connection issues or other
   * medical education chat-related errors occur. Provides user-friendly
   * error feedback with appropriate medical theme styling.
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
      {/* Medical Education Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item} 
            onSendMessage={sendMessage} // Pass sendMessage for interactive components
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        showsVerticalScrollIndicator={false}
        // Additional auto-scroll trigger for content size changes
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Error Display - Shows connection or medical education errors */}
      {renderError()}
      
      {/* Typing Indicator - Shows when medical AI is generating response */}
      {isLoading && <TypingIndicator />}
      
      {/* Medical Education Chat Input */}
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
 * Main Medical Education Chat Screen Component
 * 
 * The primary medical education chat screen component that wraps the chat
 * content with the necessary ChatProvider. This ensures that the medical
 * education functionality is properly initialized and available to all
 * child components including interactive MCQs and flashcards.
 */
export default function ChatScreen() {
  return (
    <ChatProvider>
      <ChatScreenContent />
    </ChatProvider>
  );
}

/**
 * StyleSheet for Medical Education Chat Screen Components
 * 
 * Defines the visual styling for the medical education chat interface
 * including layout, colors, spacing, and responsive design elements.
 * Uses a professional medical theme with proper contrast and accessibility.
 */
const styles = StyleSheet.create({
  // Main container with medical education theme background
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light blue-gray background for medical theme
  },
  
  // Message list styling
  messageList: {
    flex: 1,
    padding: 16,
  },
  
  // Error message container styling
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FEE2E2', // Light red background for errors
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444', // Red accent border
  },
  
  // Error text styling
  errorText: {
    color: '#B91C1C', // Dark red text for error visibility
    fontWeight: '500',
    textAlign: 'center',
  }
}); 