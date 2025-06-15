/**
 * Chat Input Component for Ask Rezzy Client
 * 
 * This is a comprehensive chat input component that handles both text input
 * and file upload functionality. It provides a modern, rounded design with
 * integrated file upload capabilities, status indicators, and cross-platform
 * compatibility for web and mobile platforms.
 * 
 * Key Features:
 * - Multi-line text input with platform-specific keyboard shortcuts
 * - PDF file upload with drag-and-drop support (web) and native picker (mobile)
 * - Real-time upload status feedback with visual indicators
 * - Cross-platform FormData handling for file uploads
 * - Responsive UI with loading states and error handling
 * - Enter key support for web (Enter to send, Shift+Enter for new line)
 * - Professional rounded button design with shadows
 * 
 * The component integrates with the session system for authenticated uploads
 * and provides comprehensive error handling and user feedback throughout
 * the upload and messaging process.
 */

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Text,
  Platform
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import { useSession } from '@/lib/context/SessionContext';
import { apiClient } from '@/config/api';

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
 * ChatInput Component
 * 
 * A sophisticated input component that combines text messaging with file upload
 * capabilities. It handles the complete user input experience including visual
 * feedback, error states, and cross-platform compatibility.
 * 
 * The component manages its own upload state while delegating message handling
 * to parent components through props. This separation of concerns allows for
 * flexible integration while maintaining encapsulated upload functionality.
 * 
 * @param {ChatInputProps} props - Component props
 * @returns {JSX.Element} Complete chat input interface with upload capabilities
 */
const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  onInputChange, 
  onSubmit, 
  isLoading 
}) => {
  // Get session ID from context for authenticated file uploads
  const { sessionId } = useSession();
  
  // Local state management for file upload functionality
  const [isUploading, setIsUploading] = useState(false);                    // Upload in progress
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Upload result

  /**
   * File Upload Handler
   * 
   * Handles the complete file upload process including file selection,
   * FormData preparation, API communication, and user feedback. Supports
   * both web and mobile platforms with appropriate file handling for each.
   * 
   * Upload Process:
   * 1. Validate session availability
   * 2. Open platform-appropriate file picker
   * 3. Prepare FormData with cross-platform compatibility
   * 4. Upload file to backend with session authentication
   * 5. Provide user feedback and handle errors
   */
  const handleFileUpload = async () => {
    // Ensure session is initialized before attempting upload
    if (!sessionId) {
      Alert.alert("Error", "Session not initialized. Please try again.");
      return;
    }
    
    // Set upload state and reset status
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      // Open document picker with PDF filter
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',      // Only allow PDF files
        copyToCacheDirectory: true,   // Copy to cache for reliable access
      });

      // Process selected file if user didn't cancel
      if (result.canceled === false) {
        // Create FormData for multipart upload
        const formData = new FormData();
        
        // Extract file information from picker result
        const { uri, mimeType, name } = result.assets[0];

        /**
         * Cross-Platform File Handling
         * 
         * Web and mobile platforms handle files differently:
         * - Web: Convert URI to Blob, then create File object
         * - Mobile: Use URI directly with file metadata
         */
        if (Platform.OS === 'web') {
          // Web platform: Convert URI to Blob for proper upload
          const blob = await fetch(uri).then(r => r.blob());
          const file = new File([blob], name || 'document.pdf', { 
            type: mimeType || 'application/pdf' 
          });
          formData.append('file', file);
        } else {
          // Mobile platforms: Use URI with metadata
          formData.append('file', {
            uri,
            name: name || 'document.pdf',
            type: mimeType || 'application/pdf',
          } as any); // Type assertion needed for React Native FormData
        }
        
        // Add session ID for backend authentication
        formData.append('sessionId', sessionId);

        // Upload file to backend
        await apiClient.post('/files/upload', formData);
        
        // Show success feedback
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000); // Auto-hide after 3 seconds
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      
      // Show error feedback
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000); // Auto-hide after 3 seconds
      
      // Display detailed error message to user
      Alert.alert(
        "Upload Failed", 
        error.response?.data?.message || "Failed to upload file. Please try again."
      );
    } finally {
      // Always reset upload loading state
      setIsUploading(false);
    }
  };

  /**
   * Get Upload Button Color Based on Status
   * 
   * Returns appropriate color for upload button based on current upload status.
   * Provides visual feedback for success, error, and default states.
   * 
   * @returns {string} Hex color code for button background
   */
  const getUploadButtonColor = () => {
    if (uploadStatus === 'success') return '#10B981'; // Green for success
    if (uploadStatus === 'error') return '#EF4444';   // Red for error
    return '#6B7280';                                  // Gray for default
  };

  /**
   * Get Upload Button Icon Based on Status
   * 
   * Returns appropriate FontAwesome icon name based on upload status.
   * Provides visual feedback for different upload states.
   * 
   * @returns {string} FontAwesome icon name
   */
  const getUploadIcon = () => {
    if (uploadStatus === 'success') return 'check';        // Checkmark for success
    if (uploadStatus === 'error') return 'exclamation';    // Exclamation for error
    return 'paperclip';                                     // Paperclip for default
  };

  /**
   * Keyboard Event Handler for Web Platform
   * 
   * Handles Enter key behavior on web platform:
   * - Enter alone: Send message
   * - Shift+Enter: Insert new line
   * 
   * This provides familiar desktop chat application behavior for web users.
   * 
   * @param {Object} e - Keyboard event object
   */
  const handleKeyPress = (e: any) => {
    // Only handle keyboard events on web platform
    if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      
      // Send message if input is not empty and not currently loading
      if (input.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Upload Status Bar - Shows success/error feedback */}
      {uploadStatus !== 'idle' && (
        <View style={[styles.statusBar, { 
          backgroundColor: uploadStatus === 'success' ? '#D1FAE5' : '#FEE2E2' 
        }]}>
          <Text style={[styles.statusText, { 
            color: uploadStatus === 'success' ? '#065F46' : '#991B1B' 
          }]}>
            {uploadStatus === 'success' ? '✓ File uploaded successfully!' : '✗ Upload failed'}
          </Text>
        </View>
      )}
      
      {/* Main Input Row - Contains upload button, text input, and send button */}
      <View style={styles.inputRow}>
        {/* File Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: getUploadButtonColor() }]}
          onPress={handleFileUpload}
          disabled={isUploading || isLoading} // Disable during upload or AI response
        >
          {isUploading ? (
            // Show loading spinner during upload
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            // Show status-appropriate icon
            <FontAwesome name={getUploadIcon()} size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        {/* Text Input Field */}
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={Platform.OS === 'web' ? 
            "Ask Rezzy... (Enter to send, Shift+Enter for new line)" : 
            "Ask Rezzy..."
          }
          placeholderTextColor="#9CA3AF"
          editable={!isLoading}        // Disable input during AI response
          multiline                    // Allow multiple lines
          maxLength={1000}            // Reasonable character limit
        />
        
        {/* Send Message Button */}
        <TouchableOpacity
          style={[styles.sendButton, { 
            backgroundColor: input.trim() && !isLoading ? '#DC2626' : '#D1D5DB' 
          }]}
          onPress={onSubmit}
          disabled={!input.trim() || isLoading} // Disable if empty or loading
        >
          {isLoading ? (
            // Show loading spinner during AI response
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            // Show send icon
            <FontAwesome name="send" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * StyleSheet for ChatInput component
 * 
 * Defines the modern, rounded design with proper spacing, shadows, and
 * responsive layout. Uses platform-specific styling where appropriate
 * for optimal native appearance on each platform.
 */
const styles = StyleSheet.create({
  // Main container with border and background
  container: {
    backgroundColor: '#FFFFFF',      // White background
    borderTopWidth: 1,              // Top border to separate from chat
    borderTopColor: '#E5E7EB',      // Light gray border color
  },
  
  // Status bar for upload feedback
  statusBar: {
    paddingHorizontal: 16,          // Horizontal padding
    paddingVertical: 8,             // Vertical padding
    alignItems: 'center',           // Center text horizontally
  },
  
  // Status text styling
  statusText: {
    fontSize: 14,                   // Medium font size
    fontWeight: '500',              // Medium font weight
  },
  
  // Input row containing all interactive elements
  inputRow: {
    flexDirection: 'row',           // Horizontal layout
    padding: 12,                    // Container padding
    alignItems: 'flex-end',         // Align items to bottom (for multiline input)
    gap: 8,                         // Space between elements
  },
  
  // Upload button styling with platform-specific shadows
  uploadButton: {
    width: 40,                      // Fixed width
    height: 40,                     // Fixed height (circular)
    borderRadius: 20,               // Circular shape
    justifyContent: 'center',       // Center icon vertically
    alignItems: 'center',           // Center icon horizontally
    ...Platform.select({
      ios: {
        // iOS shadow styling
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // Android elevation for shadow
        elevation: 2,
      },
    }),
  },
  
  // Text input field styling
  input: {
    flex: 1,                        // Take remaining space
    borderWidth: 1,                 // Border around input
    borderColor: '#D1D5DB',         // Light gray border
    borderRadius: 20,               // Rounded corners
    paddingHorizontal: 16,          // Horizontal padding
    paddingVertical: 12,            // Vertical padding
    fontSize: 16,                   // Readable font size
    maxHeight: 100,                 // Limit height for multiline
    backgroundColor: '#F9FAFB',     // Light gray background
  },
  
  // Send button styling with platform-specific shadows
  sendButton: {
    width: 40,                      // Fixed width
    height: 40,                     // Fixed height (circular)
    borderRadius: 20,               // Circular shape
    justifyContent: 'center',       // Center icon vertically
    alignItems: 'center',           // Center icon horizontally
    ...Platform.select({
      ios: {
        // iOS shadow styling
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // Android elevation for shadow
        elevation: 2,
      },
    }),
  },
});

export default ChatInput; 