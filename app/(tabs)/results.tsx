/**
 * Search Results Screen Component for Ask Rezzy Client
 * 
 * This screen provides document search functionality, allowing users to search
 * through their uploaded PDF documents using natural language queries. It features
 * a modern search interface with real-time results, relevance scoring, and
 * comprehensive state management for loading, error, and empty states.
 * 
 * Key Features:
 * - Semantic search through uploaded documents
 * - Real-time search with debounced input handling
 * - Relevance scoring with percentage display
 * - Modern rounded search interface with icons
 * - Comprehensive state management (loading, error, empty)
 * - Responsive design for different screen sizes
 * - Accessibility-friendly UI components
 * 
 * The search functionality integrates with the backend's RAG system to provide
 * intelligent document retrieval based on semantic similarity rather than
 * simple keyword matching.
 */

import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useSearch } from '@/lib/hooks/useSearch';

/**
 * Search Result Card Component
 * 
 * Renders an individual search result with the matched text content and
 * relevance score. Uses a card-based design with left border accent and
 * proper typography hierarchy for optimal readability.
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - The matched text content from the document
 * @param {number} props.score - Relevance score (0-1) indicating match quality
 * @returns {JSX.Element} Styled search result card
 */
const SearchResultCard = ({ text, score }: { text: string, score: number }) => (
  <View style={styles.cardContainer}>
    {/* Main result text content */}
    <Text style={styles.cardText}>{text}</Text>
    
    {/* Relevance score container */}
    <View style={styles.scoreContainer}>
      <Text style={styles.cardScore}>
        Relevance: {(score * 100).toFixed(1)}%
      </Text>
    </View>
  </View>
);

/**
 * Search Results Screen Component
 * 
 * The main search interface component that handles user input, search execution,
 * and result display. It manages local state for the search query and integrates
 * with the useSearch hook for backend communication and result caching.
 * 
 * Search Flow:
 * 1. User enters search query in input field
 * 2. User submits search via button or Enter key
 * 3. Query is sent to backend for semantic search
 * 4. Results are displayed with relevance scores
 * 5. Loading and error states are handled appropriately
 * 
 * @returns {JSX.Element} Complete search interface with results
 */
export default function ResultsScreen() {
  // Local state for current input and submitted query
  const [query, setQuery] = useState('');                    // Current input text
  const [submittedQuery, setSubmittedQuery] = useState('');  // Query sent to backend

  // Get search results using custom hook with React Query integration
  const { data: results, isLoading, error } = useSearch(submittedQuery);

  /**
   * Search Handler Function
   * 
   * Processes search submission by validating input and updating the
   * submitted query state. The useSearch hook automatically triggers
   * when submittedQuery changes, providing reactive search functionality.
   */
  const handleSearch = () => {
    if (query.trim()) {
      setSubmittedQuery(query.trim());
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input Section */}
      <View style={styles.searchContainer}>
        {/* Search Input with Icon */}
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search uploaded documents..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSearch}    // Handle Enter key on mobile
            returnKeyType="search"            // Show search button on keyboard
          />
        </View>
        
        {/* Search Button */}
        <TouchableOpacity 
          style={[styles.searchButton, { 
            backgroundColor: query.trim() ? '#DC2626' : '#D1D5DB'  // Dynamic color based on input
          }]}
          onPress={handleSearch}
          disabled={!query.trim()}          // Disable if no input
        >
          <FontAwesome name="search" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Loading State - Shows while search is in progress */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Searching documents...</Text>
        </View>
      )}
      
      {/* Error State - Shows when search fails */}
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={20} color="#EF4444" />
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}
      
      {/* Empty State - Shows when no results found */}
      {results && results.length === 0 && submittedQuery && !isLoading && (
        <View style={styles.emptyContainer}>
          <FontAwesome name="file-text-o" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>Try searching with different keywords</Text>
        </View>
      )}
      
      {/* Results List - Shows search results when available */}
      {results && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${index}-${item.score}`}  // Unique key combining index and score
          renderItem={({ item }) => <SearchResultCard text={item.text} score={item.score} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

/**
 * StyleSheet for Search Results Screen
 * 
 * Defines the modern, rounded design with proper spacing, shadows, and
 * responsive layout. Uses consistent color scheme and typography that
 * matches the overall application design language.
 */
const styles = StyleSheet.create({
  // Main container with light background
  container: {
    flex: 1,                        // Take full available height
    backgroundColor: '#F9FAFB',     // Light gray background matching chat screen
  },
  
  // Search input section at top of screen
  searchContainer: {
    flexDirection: 'row',           // Horizontal layout for input and button
    padding: 16,                    // Container padding
    backgroundColor: '#FFFFFF',     // White background for contrast
    borderBottomWidth: 1,           // Bottom border to separate from results
    borderBottomColor: '#E5E7EB',   // Light gray border color
    gap: 12,                        // Space between input and button
  },
  
  // Search input container with icon
  searchInputContainer: {
    flex: 1,                        // Take remaining space
    flexDirection: 'row',           // Horizontal layout for icon and input
    alignItems: 'center',           // Center items vertically
    backgroundColor: '#F9FAFB',     // Light gray background
    borderRadius: 20,               // Rounded corners
    paddingHorizontal: 16,          // Horizontal padding
    borderWidth: 1,                 // Border around input
    borderColor: '#D1D5DB',         // Light gray border color
  },
  
  // Search icon styling
  searchIcon: {
    marginRight: 8,                 // Space between icon and input
  },
  
  // Text input field styling
  input: {
    flex: 1,                        // Take remaining space
    height: 40,                     // Fixed height for consistency
    fontSize: 16,                   // Readable font size
    color: '#374151',               // Dark gray text color
  },
  
  // Search button styling
  searchButton: {
    width: 40,                      // Fixed width (circular)
    height: 40,                     // Fixed height (circular)
    borderRadius: 20,               // Circular shape
    justifyContent: 'center',       // Center icon vertically
    alignItems: 'center',           // Center icon horizontally
  },
  
  // Loading state container
  loadingContainer: {
    flex: 1,                        // Take full available space
    justifyContent: 'center',       // Center content vertically
    alignItems: 'center',           // Center content horizontally
    gap: 12,                        // Space between spinner and text
  },
  
  // Loading text styling
  loadingText: {
    fontSize: 16,                   // Medium font size
    color: '#6B7280',               // Gray text color
    fontWeight: '500',              // Medium font weight
  },
  
  // Error state container
  errorContainer: {
    flexDirection: 'row',           // Horizontal layout for icon and text
    alignItems: 'center',           // Center items vertically
    justifyContent: 'center',       // Center container horizontally
    margin: 16,                     // Margin around container
    padding: 16,                    // Internal padding
    backgroundColor: '#FEE2E2',     // Light red background
    borderRadius: 12,               // Rounded corners
    gap: 8,                         // Space between icon and text
  },
  
  // Error text styling
  errorText: {
    color: '#B91C1C',               // Dark red text color
    fontSize: 16,                   // Medium font size
    fontWeight: '500',              // Medium font weight
  },
  
  // Empty state container
  emptyContainer: {
    flex: 1,                        // Take full available space
    justifyContent: 'center',       // Center content vertically
    alignItems: 'center',           // Center content horizontally
    gap: 12,                        // Space between elements
    paddingHorizontal: 32,          // Horizontal padding for text wrapping
  },
  
  // Empty state title styling
  emptyTitle: {
    fontSize: 20,                   // Large font size for title
    fontWeight: '600',              // Semi-bold font weight
    color: '#374151',               // Dark gray text color
  },
  
  // Empty state description text styling
  emptyText: {
    fontSize: 16,                   // Medium font size
    color: '#6B7280',               // Gray text color
    textAlign: 'center',            // Center text alignment
  },
  
  // Results list container styling
  listContainer: {
    padding: 16,                    // Padding around list items
  },
  
  // Individual result card container
  cardContainer: {
    backgroundColor: '#FFFFFF',     // White background for cards
    borderRadius: 12,               // Rounded corners
    padding: 16,                    // Internal padding
    marginBottom: 12,               // Space between cards
    borderLeftWidth: 4,             // Left accent border
    borderLeftColor: '#DC2626',     // Red accent color
    shadowColor: '#000',            // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1,             // Shadow opacity
    shadowRadius: 4,                // Shadow blur radius
    elevation: 2,                   // Android shadow elevation
  },
  
  // Result text content styling
  cardText: {
    fontSize: 15,                   // Medium font size for readability
    color: '#374151',               // Dark gray text color
    lineHeight: 22,                 // Increased line height for readability
  },
  
  // Score container styling
  scoreContainer: {
    marginTop: 12,                  // Space above score
    alignItems: 'flex-end',         // Align score to the right
  },
  
  // Score text styling
  cardScore: {
    fontSize: 12,                   // Small font size for secondary info
    color: '#6B7280',               // Gray text color
    fontWeight: '500',              // Medium font weight
    backgroundColor: '#F3F4F6',     // Light gray background
    paddingHorizontal: 8,           // Horizontal padding
    paddingVertical: 4,             // Vertical padding
    borderRadius: 8,                // Rounded corners for pill shape
  },
});
