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

type ChatInputProps = {
  input: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  onInputChange, 
  onSubmit, 
  isLoading 
}) => {
  const { sessionId } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileUpload = async () => {
    if (!sessionId) {
      Alert.alert("Error", "Session not initialized. Please try again.");
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const formData = new FormData();
        
        const { uri, mimeType, name } = result.assets[0];

        if (Platform.OS === 'web') {
          // Convert the URI to a Blob on web
          const blob = await fetch(uri).then(r => r.blob());
          const file = new File([blob], name || 'document.pdf', { type: mimeType || 'application/pdf' });
          formData.append('file', file);
        } else {
          // React Native (iOS/Android) FormData format
          formData.append('file', {
            uri,
            name: name || 'document.pdf',
            type: mimeType || 'application/pdf',
          } as any);
        }
        formData.append('sessionId', sessionId);

        await apiClient.post('/files/upload', formData);
        
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
      
      Alert.alert(
        "Upload Failed", 
        error.response?.data?.message || "Failed to upload file. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadButtonColor = () => {
    if (uploadStatus === 'success') return '#10B981';
    if (uploadStatus === 'error') return '#EF4444';
    return '#6B7280';
  };

  const getUploadIcon = () => {
    if (uploadStatus === 'success') return 'check';
    if (uploadStatus === 'error') return 'exclamation';
    return 'paperclip';
  };

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
      
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: getUploadButtonColor() }]}
          onPress={handleFileUpload}
          disabled={isUploading || isLoading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <FontAwesome name={getUploadIcon()} size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={Platform.OS === 'web' ? "Ask Rezzy... (Enter to send, Shift+Enter for new line)" : "Ask Rezzy..."}
          placeholderTextColor="#9CA3AF"
          editable={!isLoading}
          multiline
          maxLength={1000}
        />
        
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default ChatInput; 