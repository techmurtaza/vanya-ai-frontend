/**
 * WebSocket Medical Education Hook for Ask Rezzy Client
 * 
 * This custom hook manages real-time communication with the Ask Rezzy medical
 * education backend using WebSocket technology. It handles structured JSON
 * responses for medical conversations, MCQs, flashcards, and educational content.
 * 
 * Key Features:
 * - Real-time WebSocket connection with automatic reconnection
 * - Structured JSON response handling for medical education content
 * - Connection status monitoring and error handling
 * - Message history management with proper state updates
 * - Support for greeting, MCQ, flashcard, and medical FAQ responses
 * 
 * The hook integrates with the session system to ensure authenticated communication
 * and provides a complete medical education chat experience.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from '../context/SessionContext';

/**
 * Chat Message Interface
 * 
 * Represents a single message in the medical education chat conversation.
 * Messages can be from either the user or the AI assistant with structured data.
 */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  responseType?: string;
  responseData?: any;
  timestamp: Date;
};

/**
 * WebSocket Connection Status
 * 
 * Represents the current state of the WebSocket connection.
 * Used for UI feedback and connection management.
 */
export type SocketStatus = 'connecting' | 'open' | 'closed';

/**
 * Structured Response Types from Medical Education Backend
 */
export interface GreetingResponse {
  type: 'greeting';
  message: string;
  suggestions: string[];
}

export interface MCQResponse {
  type: 'mcq';
  topic: string;
  totalQuestions: number;
  questions: Array<{
    id: number;
    question: string;
    options: { A: string; B: string; C: string; D: string; };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  }>;
}

export interface FlashcardResponse {
  type: 'flashcard';
  topic: string;
  totalCards: number;
  cards: Array<{
    id: number;
    front: string;
    back: string;
    category: string;
  }>;
}

export interface MedicalFAQResponse {
  type: 'medical_faq';
  topic: string;
  content: string;
  followUpSuggestions: string[];
}

export interface ClarificationResponse {
  type: 'clarification';
  message: string;
  topic: string;
  options: Array<{
    label: string;
    action: string;
  }>;
}

export interface RejectionResponse {
  type: 'rejection';
  message: string;
  suggestions: string[];
}

export type StructuredResponse = 
  | GreetingResponse 
  | MCQResponse 
  | FlashcardResponse 
  | MedicalFAQResponse 
  | ClarificationResponse 
  | RejectionResponse;

// WebSocket server URL for medical education backend
const WS_URL = 'ws://localhost:3001/ws';

/**
 * Custom Hook for Medical Education WebSocket Communication
 * 
 * This hook provides complete medical education chat functionality including 
 * WebSocket connection management, structured JSON response handling, and 
 * user input processing for medical conversations.
 */
export const useChatStream = () => {
  // Get session ID from session context
  const { sessionId } = useSession();
  
  // Chat state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('closed');
  
  // WebSocket reference for connection management
  const socketRef = useRef<WebSocket | null>(null);
  
  /**
   * WebSocket Connection Function
   * 
   * Establishes a WebSocket connection to the medical education backend
   * with the current session ID. Handles structured JSON responses for
   * medical education content.
   */
  const connect = useCallback(() => {
    if (!sessionId) {
      console.log('No sessionId available yet, waiting...');
      return;
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to medical education backend with sessionId:', sessionId);
    setSocketStatus('connecting');
    
    // Create WebSocket connection with session ID
    const ws = new WebSocket(`${WS_URL}?sessionId=${sessionId}`);
    socketRef.current = ws;

    /**
     * WebSocket Open Event Handler
     */
    ws.onopen = () => {
      console.log('Medical education WebSocket connection established.');
      setError(null);
      setSocketStatus('open');
    };

    /**
     * WebSocket Message Event Handler
     * 
     * Processes structured JSON responses from the medical education backend.
     * Handles different response types: greeting, MCQ, flashcard, medical FAQ, etc.
     */
    ws.onmessage = (event) => {
      try {
        console.log('📨 Received WebSocket message:', event.data);
        const message = JSON.parse(event.data);
        console.log('📨 Parsed message:', message);
        
        switch (message.type) {
          case 'response':
            // Handle structured JSON responses
            console.log('✅ Processing response of type:', message.data.type);
            setIsLoading(false);
            
            const aiMessage: ChatMessage = {
              id: `ai-${Date.now()}`,
              role: 'assistant',
              responseType: message.data.type,
              responseData: message.data,
              timestamp: new Date()
            };
            
            console.log('💬 Adding AI message to chat:', aiMessage);
            setMessages(prev => [...prev, aiMessage]);
            break;
            
          case 'error':
            // Handle backend errors
            setError(new Error(message.message));
            setIsLoading(false);
            break;
            
          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (parseError) {
        console.error('Failed to parse WebSocket message:', parseError);
        setError(new Error('Failed to parse server response'));
        setIsLoading(false);
      }
    };

    /**
     * WebSocket Error Event Handler
     */
    ws.onerror = (e) => {
      console.error('Medical education WebSocket error:', e);
      setError(new Error('Medical education connection failed.'));
      setIsLoading(false);
      setSocketStatus('closed');
    };
    
    /**
     * WebSocket Close Event Handler
     */
    ws.onclose = () => {
      console.log('Medical education WebSocket connection closed.');
      setSocketStatus('closed');
    };

  }, [sessionId]);

  /**
   * Effect Hook for Connection Management
   */
  useEffect(() => {
    connect();
    
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  /**
   * Send Message Function
   * 
   * Sends a user message to the medical education AI backend via WebSocket.
   * Adds the user message to chat history and transmits it for processing.
   */
  const sendMessage = useCallback((messageContent: string) => {
    console.log('📤 Attempting to send message:', messageContent);
    console.log('🔌 WebSocket state:', socketRef.current?.readyState);
    
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('❌ Medical education WebSocket is not connected.');
      console.log('🔌 Current socket status:', socketStatus);
      return;
    }
    
    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    console.log('💬 Adding user message to chat:', userMessage);
    // Add to chat history
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    // Send to backend
    const payload = {
      type: 'chat',
      content: messageContent
    };
    console.log('📤 Sending payload to backend:', payload);
    socketRef.current.send(JSON.stringify(payload));
  }, []);

  /**
   * Input Change Handler
   */
  const handleInputChange = (text: string) => {
    setInput(text);
  };

  /**
   * Submit Handler
   */
  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return {
    messages,
    input,
    error,
    isLoading,
    socketStatus,
    handleInputChange,
    handleSubmit,
    sendMessage
  };
}; 