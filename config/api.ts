/**
 * API Client Configuration for Ask Rezzy Client
 * 
 * This file configures the Axios HTTP client used for all API communications
 * with the Ask Rezzy backend server. The client handles REST API calls for
 * session initialization, file uploads, and document search functionality.
 * 
 * Key Features:
 * - Environment-based URL configuration
 * - Proper handling of multipart/form-data uploads
 * - Centralized HTTP client for consistent error handling
 */

import axios from 'axios';

// API base URL - defaults to localhost for development, can be overridden via environment variable
// This allows for easy deployment to different environments (dev, staging, production)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Configured Axios instance for API communications
 * 
 * IMPORTANT: No default Content-Type header is set here to allow proper
 * multipart/form-data handling for file uploads. Setting a global
 * 'application/json' header would break file upload functionality.
 * 
 * The client automatically handles:
 * - JSON requests/responses for regular API calls
 * - Multipart form data for file uploads
 * - Cross-platform compatibility (web, iOS, Android)
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  // headers: { // This was the problematic line that broke file uploads
  //   'Content-Type': 'application/json', // Removed to allow multipart uploads
  // },
}); 