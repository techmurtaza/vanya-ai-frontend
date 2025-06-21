/**
 * API Configuration for Ask Rezzy Medical Education Client
 * 
 * This file provides configuration for the medical education platform.
 * Since the new system uses WebSocket communication exclusively for
 * real-time medical education interactions, minimal HTTP endpoints are needed.
 * 
 * Key Features:
 * - Environment-based URL configuration
 * - WebSocket endpoint configuration
 * - Medical education backend endpoints
 */

// API base URL for medical education backend
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// WebSocket URL for medical education real-time communication
const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001/ws';

/**
 * API Configuration Object
 * 
 * Contains all endpoint configurations for the medical education platform.
 * The system primarily uses WebSocket for real-time medical education
 * interactions, with minimal HTTP endpoints for health checks.
 */
export const apiConfig = {
  // Base URLs
  baseURL: API_URL,
  wsURL: WS_URL,
  
  // HTTP Endpoints (minimal usage)
  endpoints: {
    health: '/health',
  },
  
  // WebSocket configuration
  websocket: {
    url: WS_URL,
    protocols: ['medical-education']
  }
};

/**
 * Simple HTTP client for basic requests
 * 
 * Since we only need basic HTTP functionality for health checks,
 * we use fetch API instead of a heavy HTTP library.
 */
export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Handle text responses (like "OK" from health endpoint)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return { data: await response.json() };
    } else {
      return { data: await response.text() };
    }
  }
}; 