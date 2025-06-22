/**
 * Chat Input Component for Ask Rezzy Medical Education Client
 * 
 * ENTERPRISE-GRADE INPUT INTERFACE:
 * Professional medical education input component with intelligent keyboard handling
 * and optimized user experience patterns for healthcare learning environments.
 * 
 * DESIGN PHILOSOPHY:
 * Streamlined medical education interface focusing on direct AI conversation
 * without document upload complexity. Emphasizes accessibility, professional
 * medical aesthetics, and cross-platform consistency for healthcare education.
 * 
 * TECHNICAL FEATURES:
 * - Platform-specific keyboard shortcuts with intelligent event handling
 * - Medical-themed visual design with healthcare-appropriate color schemes
 * - Responsive multi-line input with character limits for optimal performance
 * - Loading state management with visual feedback during AI processing
 * - Cross-platform compatibility with consistent behavior across devices
 * 
 * KEYBOARD INTERACTION PATTERNS:
 * - Web Platform: Enter to send, Shift+Enter for new line
 * - Mobile Platforms: Native keyboard handling with medical education optimization
 * - Accessibility: Full keyboard navigation support for healthcare professionals
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Efficient event handling with minimal re-render triggers
 * - Optimized placeholder text for platform-specific user guidance
 * - Memory-conscious state management for input text processing
 * - Network-aware loading states to prevent duplicate submissions
 * 
 * @author Medical Education Platform Team
 * @version 2.2.0
 * @since 2.0.0 - Initial medical education transformation
 * @updated 2024-12-19 - Enhanced keyboard handling and accessibility
 */

import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Platform
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Props interface for ChatInput component
 * 
 * @interface ChatInputProps
 * @property {string} input - Current input text value
 * @property {function} onInputChange - Callback when input text changes
 * @property {function} onSubmit - Callback when message is submitted
 * @property {boolean} isLoading - Whether AI is currently processing a response
 */
type ChatInputProps = {
  input: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

/**
 * Simplified Chat Input Component
 * 
 * Clean medical education chat interface without file upload complexity.
 * Focuses on text-based medical conversations and interactions.
 */
const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  onInputChange, 
  onSubmit, 
  isLoading 
}) => {
  /**
   * Keyboard Event Handler for Web Platform
   * 
   * Handles Enter key behavior on web platform:
   * - Enter alone: Send message
   * - Shift+Enter: Insert new line
   */
  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      
      if (input.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Input Row */}
      <View style={styles.inputRow}>
        {/* Medical Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="stethoscope" size={18} color="#DC2626" />
        </View>
        
        {/* Text Input Field */}
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={Platform.OS === 'web' ? 
            "Ask about medical topics, request MCQs or flashcards... (Enter to send)" : 
            "Ask about medical topics, request MCQs or flashcards..."
          }
          placeholderTextColor="#9CA3AF"
          editable={!isLoading}
          multiline
          maxLength={1000}
        />
        
        {/* Send Message Button */}
        <TouchableOpacity
          style={[styles.sendButton, { 
            backgroundColor: input.trim() && !isLoading ? '#DC2626' : '#D1D5DB' 
          }]}
          onPress={onSubmit}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <FontAwesome name="send" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

/**
 * StyleSheet for Medical Education Chat Input
 * 
 * Modern, professional styling appropriate for medical education platform.
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  
  // Input row layout
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  
  // Medical icon container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  
  // Text input styling
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#F9FAFB',
  },
  
  // Send button styling
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 