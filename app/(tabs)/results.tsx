import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useSearch } from '@/lib/hooks/useSearch';

const SearchResultCard = ({ text, score }: { text: string, score: number }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.cardText}>{text}</Text>
    <View style={styles.scoreContainer}>
      <Text style={styles.cardScore}>Relevance: {(score * 100).toFixed(1)}%</Text>
    </View>
  </View>
);

export default function ResultsScreen() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data: results, isLoading, error } = useSearch(submittedQuery);

  const handleSearch = () => {
    if (query.trim()) {
      setSubmittedQuery(query.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search uploaded documents..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={[styles.searchButton, { 
            backgroundColor: query.trim() ? '#DC2626' : '#D1D5DB' 
          }]}
          onPress={handleSearch}
          disabled={!query.trim()}
        >
          <FontAwesome name="search" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Searching documents...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={20} color="#EF4444" />
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}
      
      {results && results.length === 0 && submittedQuery && !isLoading && (
        <View style={styles.emptyContainer}>
          <FontAwesome name="file-text-o" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>Try searching with different keywords</Text>
        </View>
      )}
      
      {results && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${index}-${item.score}`}
          renderItem={({ item }) => <SearchResultCard text={item.text} score={item.score} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#374151',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  scoreContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  cardScore: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
