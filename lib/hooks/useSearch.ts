/**
 * Document Search Hook for Ask Rezzy Client
 * 
 * This custom hook provides semantic search functionality for uploaded documents
 * using React Query for efficient data fetching and caching. It enables users
 * to search through their uploaded PDF content using natural language queries.
 * 
 * Key Features:
 * - Semantic search using vector similarity
 * - React Query integration for caching and state management
 * - Session-based search (only searches user's documents)
 * - Automatic query enabling/disabling based on prerequisites
 * - Relevance scoring for search results
 * 
 * The search functionality integrates with the backend's RAG (Retrieval-Augmented
 * Generation) system to find relevant document sections based on user queries.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/config/api';
import { useSession } from '../context/SessionContext';

/**
 * Search Type Definition (Legacy)
 * 
 * This type was originally used for different search modes but may no longer
 * be relevant with the current backend implementation. Kept for potential
 * future enhancements or backward compatibility.
 * 
 * @type SearchType
 */
type SearchType = 'question' | 'flashcard'; // This may no longer be relevant

/**
 * Search API Function
 * 
 * Performs the actual API call to search through uploaded documents.
 * Uses the configured API client to make authenticated requests to the
 * backend search endpoint.
 * 
 * @param {string} query - The search query string from the user
 * @param {string} sessionId - User's session ID for document isolation
 * @returns {Promise<any>} Promise resolving to search results from backend
 * 
 * @throws {Error} If the API request fails or returns an error
 */
const search = async (query: string, sessionId: string) => {
  // Make GET request to search endpoint with query and session parameters
  const { data } = await apiClient.get('/search', {
    params: { query, sessionId },
  });
  return data;
};

/**
 * Custom Hook for Document Search
 * 
 * This hook provides a complete search interface using React Query for
 * efficient data management. It automatically handles loading states,
 * error handling, and result caching for optimal user experience.
 * 
 * The hook integrates with the session system to ensure users only search
 * through their own uploaded documents. It uses React Query's intelligent
 * caching to avoid redundant API calls for the same search queries.
 * 
 * @param {string} query - The search query string
 * @returns {Object} React Query result object containing:
 *   - data: Search results array with text and relevance scores
 *   - isLoading: Boolean indicating if search is in progress
 *   - error: Any error that occurred during the search
 *   - isError: Boolean indicating if an error occurred
 *   - refetch: Function to manually trigger a new search
 * 
 * @example
 * const { data: results, isLoading, error } = useSearch("machine learning");
 * 
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 * 
 * if (error) {
 *   return <ErrorMessage error={error} />;
 * }
 * 
 * return (
 *   <div>
 *     {results?.map((result, index) => (
 *       <SearchResult key={index} text={result.text} score={result.score} />
 *     ))}
 *   </div>
 * );
 */
export const useSearch = (query: string) => {
  // Get session ID from session context for authenticated search
  const { sessionId } = useSession();

  return useQuery({
    // Unique query key for React Query caching
    // Includes query and sessionId to ensure proper cache isolation
    queryKey: ['search', query, sessionId],
    
    // Query function that performs the actual search
    queryFn: () => search(query, sessionId!),
    
    // Only enable the query if both query and sessionId are available
    // This prevents unnecessary API calls and ensures proper authentication
    enabled: !!query && !!sessionId, // Only run if query and sessionId exist
  });
}; 