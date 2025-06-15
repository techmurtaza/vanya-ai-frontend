/**
 * Message Bubble Component for Ask Rezzy Client
 * 
 * This component renders individual chat messages in a visually appealing
 * bubble format. It provides different styling for user and AI assistant
 * messages to create a clear visual distinction in the conversation flow.
 * 
 * Key Features:
 * - Responsive bubble design with proper alignment
 * - Role-based styling (user vs assistant messages)
 * - Accessible color contrast and typography
 * - Rounded corners with directional indicators
 * - Optimized for both light and dark themes
 * 
 * The component follows modern chat UI patterns with user messages aligned
 * to the right and assistant messages to the left, using distinct colors
 * for immediate visual recognition.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Props interface for MessageBubble component
 * 
 * @interface MessageBubbleProps
 * @property {Object} message - The message object to display
 * @property {'user' | 'assistant'} message.role - Who sent the message
 * @property {string} message.content - The actual message text content
 */
type MessageBubbleProps = {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
};

/**
 * MessageBubble Component
 * 
 * Renders a single chat message with appropriate styling based on the sender.
 * User messages appear on the right with red background, while assistant
 * messages appear on the left with gray background.
 * 
 * The component uses conditional styling to create the proper visual hierarchy
 * and conversation flow that users expect from modern chat interfaces.
 * 
 * @param {MessageBubbleProps} props - Component props
 * @param {Object} props.message - Message object containing role and content
 * @returns {JSX.Element} Styled message bubble component
 * 
 * @example
 * <MessageBubble 
 *   message={{ 
 *     role: 'user', 
 *     content: 'What is machine learning?' 
 *   }} 
 * />
 * 
 * <MessageBubble 
 *   message={{ 
 *     role: 'assistant', 
 *     content: 'Machine learning is a subset of AI...' 
 *   }} 
 * />
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Determine if this is a user message for conditional styling
  const isUser = message.role === 'user';
  
  return (
    <View
      style={[
        styles.container,
        // Apply different alignment based on message sender
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View style={[
        styles.bubble, 
        // Apply different bubble styling based on message sender
        isUser ? styles.userBubble : styles.assistantBubble
      ]}>
        <Text style={isUser ? styles.userText : styles.assistantText}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

/**
 * StyleSheet for MessageBubble component
 * 
 * Defines the visual appearance and layout for chat message bubbles.
 * Uses a modern design with rounded corners, proper spacing, and
 * role-based color schemes for optimal user experience.
 */
const styles = StyleSheet.create({
  // Base container for each message with vertical spacing
  container: {
    marginVertical: 5,     // Vertical spacing between messages
    flexDirection: 'row',  // Horizontal layout for alignment control
  },
  
  // User message container - aligned to the right side
  userContainer: {
    justifyContent: 'flex-end', // Push user messages to the right
  },
  
  // Assistant message container - aligned to the left side
  assistantContainer: {
    justifyContent: 'flex-start', // Keep assistant messages on the left
  },
  
  // Base bubble styling shared by both user and assistant messages
  bubble: {
    maxWidth: '80%',      // Prevent messages from taking full width
    padding: 15,          // Internal padding for text readability
    borderRadius: 20,     // Rounded corners for modern appearance
  },
  
  // User message bubble - red background with custom corner radius
  userBubble: {
    backgroundColor: '#DC2626',    // Red background for user messages
    borderBottomRightRadius: 5,    // Smaller radius for speech bubble effect
  },
  
  // Assistant message bubble - light gray background with custom corner radius
  assistantBubble: {
    backgroundColor: '#F3F4F6',    // Light gray background for AI messages
    borderBottomLeftRadius: 5,     // Smaller radius for speech bubble effect
  },
  
  // Text styling for user messages - white text for contrast
  userText: {
    color: '#FFFFFF', // White text on red background
  },
  
  // Text styling for assistant messages - dark text for readability
  assistantText: {
    color: '#111827', // Almost black text on light gray background
  },
});

export default MessageBubble; 