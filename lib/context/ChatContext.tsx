/**
 * Chat Context Provider for Ask Rezzy Client
 * 
 * This file implements the chat context system that wraps the WebSocket
 * functionality and provides chat state management throughout the application.
 * It acts as a bridge between the useChatStream hook and React components,
 * ensuring proper state isolation and context management.
 * 
 * The chat context provides:
 * - WebSocket connection management
 * - Real-time message streaming
 * - Chat input handling
 * - Connection status monitoring
 * - Error state management
 */

import React, { createContext, useContext } from 'react';
import { useChatStream } from '../hooks/useChatStream';

/**
 * Type definition for Chat Context
 * 
 * This type is derived from the return type of useChatStream hook,
 * ensuring type safety and consistency between the hook and context.
 * It includes all chat-related state and functions.
 */
type ChatContextType = ReturnType<typeof useChatStream>;

// Create the Chat Context with undefined default value
// This ensures proper error handling when used outside the provider
const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * Chat Provider Component
 * 
 * This component wraps chat-related components to provide WebSocket
 * functionality and chat state management. It initializes the chat
 * stream and makes all chat functionality available to child components.
 * 
 * The provider should wrap components that need access to:
 * - Chat messages and history
 * - WebSocket connection status
 * - Message sending functionality
 * - Input handling and validation
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component with chat context
 */
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize the chat stream hook which handles all WebSocket logic
  // This includes connection management, message handling, and state updates
  const chat = useChatStream();
  
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

/**
 * Custom hook to access Chat Context
 * 
 * This hook provides a convenient and type-safe way to access chat
 * functionality from any component within the ChatProvider tree.
 * It includes proper error handling to prevent misuse.
 * 
 * @throws {Error} If used outside of ChatProvider
 * @returns {ChatContextType} Chat context value with all chat functionality
 * 
 * @example
 * const { messages, sendMessage, isLoading, socketStatus } = useChat();
 * 
 * // Send a message
 * sendMessage("Hello, Rezzy!");
 * 
 * // Check connection status
 * if (socketStatus === 'open') {
 *   // WebSocket is connected and ready
 * }
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  
  // Throw error if hook is used outside the provider
  // This helps developers catch context usage errors during development
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}; 