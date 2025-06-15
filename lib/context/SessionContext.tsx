/**
 * Session Context Provider for Ask Rezzy Client
 * 
 * This file implements the session management system using React Context.
 * It provides global state management for user sessions, which are required
 * for all backend communications including file uploads, chat, and search.
 * 
 * The session system ensures that:
 * - Each user gets a unique session ID from the backend
 * - All API calls are properly authenticated with the session
 * - Loading states are managed during session initialization
 * - Session state is accessible throughout the component tree
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Type definition for the Session Context
 * 
 * @interface SessionContextType
 * @property {string | null} sessionId - Unique identifier for the user session
 * @property {function} setSessionId - Function to update the session ID
 * @property {boolean} isLoading - Loading state during session initialization
 * @property {function} setIsLoading - Function to update loading state
 */
type SessionContextType = {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

// Create the Session Context with undefined default value
// This ensures that the hook will throw an error if used outside the provider
const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Session Provider Component
 * 
 * This component wraps the entire application to provide session state
 * to all child components. It manages the session ID and loading state
 * that are essential for backend communication.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component with session context
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Session ID state - null until initialized by the backend
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Loading state - true during app initialization, false once session is ready
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Create the context value object with all session-related state and functions
  const value = { sessionId, setSessionId, isLoading, setIsLoading };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

/**
 * Custom hook to access Session Context
 * 
 * This hook provides a convenient way to access session state and functions
 * from any component within the SessionProvider tree. It includes error
 * handling to ensure proper usage.
 * 
 * @throws {Error} If used outside of SessionProvider
 * @returns {SessionContextType} Session context value with state and functions
 * 
 * @example
 * const { sessionId, isLoading } = useSession();
 * if (sessionId) {
 *   // Make authenticated API calls
 * }
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  
  // Throw error if hook is used outside the provider
  // This helps catch development errors early
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}; 