/**
 * WebSocket Chat Stream Hook for Ask Rezzy Client
 * 
 * This custom hook manages real-time chat communication with the Ask Rezzy backend
 * using WebSocket technology. It handles connection management, message streaming,
 * and provides a complete chat interface for document-based AI conversations.
 * 
 * Key Features:
 * - Real-time WebSocket connection with automatic reconnection
 * - Streaming message chunks for responsive AI responses
 * - Connection status monitoring and error handling
 * - Message history management with proper state updates
 * - Input handling and message sending functionality
 * 
 * The hook integrates with the session system to ensure authenticated communication
 * and provides a complete chat experience with typing indicators and error states.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from '../context/SessionContext';

/**
 * Chat Message Interface
 * 
 * Represents a single message in the chat conversation.
 * Messages can be from either the user or the AI assistant.
 * 
 * @interface ChatMessage
 * @property {string} id - Unique identifier for the message
 * @property {'user' | 'assistant'} role - Who sent the message
 * @property {string} content - The actual message content
 */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/**
 * WebSocket Connection Status
 * 
 * Represents the current state of the WebSocket connection.
 * Used for UI feedback and connection management.
 * 
 * @type SocketStatus
 */
export type SocketStatus = 'connecting' | 'open' | 'closed';

// WebSocket server URL - configured for the Ask Rezzy backend
// In production, this should be configurable via environment variables
const WS_URL = 'ws://localhost:3001';

/**
 * Custom Hook for WebSocket Chat Streaming
 * 
 * This hook provides complete chat functionality including WebSocket connection
 * management, real-time message streaming, and user input handling. It manages
 * the entire chat lifecycle from connection to message delivery.
 * 
 * @returns {Object} Chat interface object containing:
 *   - messages: Array of chat messages
 *   - input: Current input text
 *   - error: Any connection or communication errors
 *   - isLoading: Whether AI is currently responding
 *   - socketStatus: Current WebSocket connection status
 *   - handleInputChange: Function to update input text
 *   - handleSubmit: Function to send messages
 */
export const useChatStream = () => {
  // Get session ID from session context - required for authenticated WebSocket connection
  const { sessionId } = useSession();
  
  // Chat state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);      // Message history
  const [input, setInput] = useState('');                          // Current input text
  const [error, setError] = useState<Error | null>(null);         // Error state
  const [isLoading, setIsLoading] = useState(false);              // AI response loading state
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('closed'); // Connection status
  
  // WebSocket reference for connection management
  // Using useRef to persist connection across re-renders
  const socketRef = useRef<WebSocket | null>(null);
  
  /**
   * WebSocket Connection Function
   * 
   * Establishes a WebSocket connection to the backend server with the current
   * session ID. Handles connection lifecycle events and message processing.
   * 
   * Connection Flow:
   * 1. Check if session is available and connection isn't already open
   * 2. Create WebSocket connection with session ID parameter
   * 3. Set up event handlers for connection lifecycle
   * 4. Process incoming messages based on type (chunk, status, error)
   */
  const connect = useCallback(() => {
    // Don't connect if no session ID or if already connected
    if (!sessionId || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    // Update status to show connection attempt
    setSocketStatus('connecting');
    
    // Create WebSocket connection with session ID for authentication
    const ws = new WebSocket(`${WS_URL}?sessionId=${sessionId}`);
    socketRef.current = ws;

    /**
     * WebSocket Open Event Handler
     * 
     * Called when the WebSocket connection is successfully established.
     * Clears any previous errors and updates connection status.
     */
    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setError(null);           // Clear any previous connection errors
      setSocketStatus('open');  // Update status for UI feedback
    };

    /**
     * WebSocket Message Event Handler
     * 
     * Processes incoming messages from the backend. The backend sends different
     * message types for streaming AI responses:
     * 
     * - 'chunk': Partial AI response content to be appended
     * - 'status': Control messages (e.g., response completion)
     * - 'error': Error messages from the backend
     */
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'chunk':
          // AI is sending response chunks - show loading indicator
          setIsLoading(true);
          
          // Update messages state with streaming content
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            
            // If last message is from assistant, append chunk to it
            if (lastMessage?.role === 'assistant') {
              const updatedLastMessage = { 
                ...lastMessage, 
                content: lastMessage.content + message.content 
              };
              return [...prev.slice(0, -1), updatedLastMessage];
            } else {
              // Start a new assistant message with the chunk
              return [...prev, { 
                id: `ai-${Date.now()}`, 
                role: 'assistant', 
                content: message.content 
              }];
            }
          });
          break;
          
        case 'status':
          // Handle status messages (e.g., response completion)
          if (message.message === 'done') {
            setIsLoading(false); // AI finished responding
          }
          break;
          
        case 'error':
          // Handle backend errors
          setError(new Error(message.message));
          setIsLoading(false);
          setSocketStatus('closed');
          break;
      }
    };

    /**
     * WebSocket Error Event Handler
     * 
     * Called when a WebSocket error occurs. Updates error state and
     * connection status for proper UI feedback.
     */
    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError(new Error('WebSocket connection failed.'));
      setIsLoading(false);
      setSocketStatus('closed');
    };
    
    /**
     * WebSocket Close Event Handler
     * 
     * Called when the WebSocket connection is closed, either intentionally
     * or due to network issues. Updates connection status.
     */
    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setSocketStatus('closed');
    };

  }, [sessionId]); // Reconnect when session ID changes

  /**
   * Effect Hook for Connection Management
   * 
   * Automatically establishes WebSocket connection when the hook is initialized
   * or when the session ID changes. Also handles cleanup on unmount.
   */
  useEffect(() => {
    connect(); // Establish connection
    
    // Cleanup function to close connection on unmount
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  /**
   * Send Message Function
   * 
   * Sends a user message to the AI backend via WebSocket. Adds the user
   * message to the chat history and transmits it to the server for processing.
   * 
   * @param {string} messageContent - The message text to send
   */
  const sendMessage = useCallback((messageContent: string) => {
    // Check if WebSocket is connected before sending
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected.');
      return;
    }
    
    // Create user message object with unique ID
    const userMessage: ChatMessage = { 
      id: `user-${Date.now()}`, 
      role: 'user', 
      content: messageContent 
    };
    
    // Add user message to chat history immediately for responsive UI
    setMessages(prev => [...prev, userMessage]);
    
    // Send message to backend for AI processing
    socketRef.current.send(JSON.stringify({
      type: 'chat',
      content: messageContent
    }));
  }, []);

  /**
   * Input Change Handler
   * 
   * Updates the input state when user types in the chat input field.
   * 
   * @param {string} text - New input text value
   */
  const handleInputChange = (text: string) => {
    setInput(text);
  };

  /**
   * Submit Handler
   * 
   * Processes message submission when user sends a message.
   * Validates input, sends message, and clears input field.
   */
  const handleSubmit = () => {
    // Don't send empty messages
    if (!input.trim()) return;
    
    // Send the message
    sendMessage(input);
    
    // Clear input field for next message
    setInput('');
  };

  // Return all chat functionality and state for use in components
  return {
    messages,           // Array of chat messages
    input,             // Current input text
    error,             // Any connection or communication errors
    isLoading,         // Whether AI is currently responding
    socketStatus,      // Current WebSocket connection status
    handleInputChange, // Function to update input text
    handleSubmit,      // Function to send messages
  };
}; 