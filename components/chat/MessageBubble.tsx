/**
 * Message Bubble Component for Ask Rezzy Medical Education Client
 * 
 * This component renders individual messages in the medical education chat interface.
 * It handles both user messages and structured AI responses including MCQs, flashcards,
 * medical FAQs, greetings, and other educational content types.
 * 
 * Key Features:
 * - Support for structured JSON responses from medical education backend
 * - Interactive MCQ component with question answering
 * - Flashcard component with flip animations
 * - Medical FAQ display with follow-up suggestions
 * - Greeting and clarification components with actionable buttons
 * - Professional medical education styling and UX
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { 
  ChatMessage, 
  MCQResponse, 
  FlashcardResponse, 
  GreetingResponse,
  MedicalFAQResponse,
  ClarificationResponse,
  RejectionResponse
} from '@/lib/hooks/useChatStream';

/**
 * Props interface for MessageBubble component
 */
type MessageBubbleProps = {
  message: ChatMessage;
  onSendMessage?: (content: string) => void;
};

/**
 * MCQ Component - Interactive Multiple Choice Questions
 */
const MCQComponent = ({ data }: { data: MCQResponse }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <View style={styles.mcqContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="graduation-cap" size={20} color="#DC2626" />
        <Text style={styles.headerText}>📚 {data.topic.toUpperCase()} MCQs</Text>
      </View>
      
      <ScrollView style={styles.questionsContainer} nestedScrollEnabled={true}>
        {data.questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
            
            <View style={styles.optionsContainer}>
              {Object.entries(question.options).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.option,
                    selectedAnswers[question.id] === key && styles.selectedOption,
                    showAnswers && question.correctAnswer === key && styles.correctOption,
                    showAnswers && selectedAnswers[question.id] === key && question.correctAnswer !== key && styles.incorrectOption
                  ]}
                  onPress={() => setSelectedAnswers(prev => ({...prev, [question.id]: key}))}
                  disabled={showAnswers}
                >
                  <Text style={[
                    styles.optionText,
                    showAnswers && question.correctAnswer === key && styles.correctOptionText
                  ]}>
                    {key}) {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {showAnswers && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationLabel}>✅ Explanation:</Text>
                <Text style={styles.explanationText}>{question.explanation}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.checkButton}
        onPress={() => setShowAnswers(!showAnswers)}
      >
        <Text style={styles.checkButtonText}>
          {showAnswers ? 'Hide Answers' : 'Check Answers'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Flashcard Component - Interactive Study Cards
 */
const FlashcardComponent = ({ data }: { data: FlashcardResponse }) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.flashcardContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="clone" size={20} color="#F59E0B" />
        <Text style={styles.headerText}>🎴 {data.topic.toUpperCase()} Flashcards</Text>
      </View>
      
      <ScrollView style={styles.cardsContainer} nestedScrollEnabled={true}>
        {data.cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.flashcard}
            onPress={() => toggleCard(card.id)}
          >
            <View style={styles.cardContent}>
              {!flippedCards.has(card.id) ? (
                <>
                  <Text style={styles.cardLabel}>FRONT</Text>
                  <Text style={styles.cardText}>{card.front}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardLabel}>BACK</Text>
                  <Text style={styles.cardText}>{card.back}</Text>
                  <Text style={styles.categoryText}>Category: {card.category}</Text>
                </>
              )}
            </View>
            <Text style={styles.tapHint}>Tap to flip</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Greeting Component - Welcome message with suggestions
 */
const GreetingComponent = ({ data, onSendMessage }: { 
  data: GreetingResponse; 
  onSendMessage?: (content: string) => void;
}) => {
  return (
    <View style={styles.greetingContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="user-md" size={20} color="#10B981" />
        <Text style={styles.headerText}>Welcome to Medical Education</Text>
      </View>
      
      <Text style={styles.greetingMessage}>{data.message}</Text>
      
      <Text style={styles.suggestionsLabel}>Try these topics:</Text>
      <View style={styles.suggestionsContainer}>
        {data.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSendMessage?.(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Medical FAQ Component
 */
const MedicalFAQComponent = ({ data, onSendMessage }: { 
  data: MedicalFAQResponse; 
  onSendMessage?: (content: string) => void;
}) => {
  return (
    <View style={styles.faqContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="info-circle" size={20} color="#3B82F6" />
        <Text style={styles.headerText}>📖 {data.topic.toUpperCase()}</Text>
      </View>
      
      <ScrollView style={styles.faqContent} nestedScrollEnabled={true}>
        <Text style={styles.faqText}>{data.content}</Text>
      </ScrollView>
      
      <View style={styles.followUpContainer}>
        <Text style={styles.followUpLabel}>Continue learning:</Text>
        {data.followUpSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.followUpButton}
            onPress={() => onSendMessage?.(suggestion)}
          >
            <Text style={styles.followUpText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Clarification Component
 */
const ClarificationComponent = ({ data, onSendMessage }: { 
  data: ClarificationResponse; 
  onSendMessage?: (content: string) => void;
}) => {
  return (
    <View style={styles.clarificationContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="question-circle" size={20} color="#8B5CF6" />
        <Text style={styles.headerText}>Need Clarification</Text>
      </View>
      
      <Text style={styles.clarificationMessage}>{data.message}</Text>
      
      <View style={styles.optionsGrid}>
        {data.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.clarificationOption}
            onPress={() => onSendMessage?.(option.action)}
          >
            <Text style={styles.clarificationOptionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Rejection Component
 */
const RejectionComponent = ({ data, onSendMessage }: { 
  data: RejectionResponse; 
  onSendMessage?: (content: string) => void;
}) => {
  return (
    <View style={styles.rejectionContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="exclamation-triangle" size={20} color="#EF4444" />
        <Text style={styles.headerText}>Medical Topics Only</Text>
      </View>
      
      <Text style={styles.rejectionMessage}>{data.message}</Text>
      
      <Text style={styles.suggestionsLabel}>Try asking about:</Text>
      <View style={styles.suggestionsContainer}>
        {data.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.rejectionSuggestion}
            onPress={() => onSendMessage?.(suggestion)}
          >
            <Text style={styles.rejectionSuggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Main Message Bubble Component
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSendMessage }) => {
  const isUser = message.role === 'user';

  const renderStructuredContent = () => {
    if (!message.responseData) return null;
    
    switch (message.responseData.type) {
      case 'greeting':
        return <GreetingComponent data={message.responseData} onSendMessage={onSendMessage} />;
      case 'mcq':
        return <MCQComponent data={message.responseData} />;
      case 'flashcard':
        return <FlashcardComponent data={message.responseData} />;
      case 'medical_faq':
        return <MedicalFAQComponent data={message.responseData} onSendMessage={onSendMessage} />;
      case 'clarification':
        return <ClarificationComponent data={message.responseData} onSendMessage={onSendMessage} />;
      case 'rejection':
        return <RejectionComponent data={message.responseData} onSendMessage={onSendMessage} />;
      default:
        return <Text>{message.responseData.message || 'Unknown response type'}</Text>;
    }
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {message.content && (
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {message.content}
          </Text>
        )}
        {renderStructuredContent()}
      </View>
    </View>
  );
};

/**
 * Comprehensive StyleSheet for Medical Education Components
 */
const styles = StyleSheet.create({
  // Main message container
  messageContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  
  userContainer: {
    alignItems: 'flex-end',
  },
  
  aiContainer: {
    alignItems: 'flex-start',
  },
  
  // Base bubble styles
  bubble: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: 12,
  },
  
  userBubble: {
    backgroundColor: '#DC2626',
    borderBottomRightRadius: 4,
  },
  
  aiBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  
  // Basic message text
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  
  userText: {
    color: '#FFFFFF',
  },
  
  aiText: {
    color: '#374151',
  },
  
  // Common header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  
  // MCQ Component Styles
  mcqContainer: {
    backgroundColor: '#FEFEFE',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    maxWidth: 350,
  },
  
  questionsContainer: {
    maxHeight: 400,
  },
  
  questionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  questionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 4,
  },
  
  questionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  
  optionsContainer: {
    gap: 6,
  },
  
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  
  selectedOption: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  
  correctOption: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  
  incorrectOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  
  optionText: {
    fontSize: 13,
    color: '#374151',
  },
  
  correctOptionText: {
    color: '#065F46',
    fontWeight: '500',
  },
  
  explanationContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  
  explanationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 4,
  },
  
  explanationText: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
  },
  
  checkButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Flashcard Component Styles
  flashcardContainer: {
    backgroundColor: '#FEFEFE',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    maxWidth: 350,
  },
  
  cardsContainer: {
    maxHeight: 400,
  },
  
  flashcard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    // Use boxShadow for web compatibility
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  
  cardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 1,
  },
  
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  categoryText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  
  tapHint: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
  },
  
  // Greeting Component Styles
  greetingContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    maxWidth: 350,
  },
  
  greetingMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  
  suggestionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  
  suggestionButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  suggestionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Medical FAQ Component Styles
  faqContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    maxWidth: 350,
  },
  
  faqContent: {
    maxHeight: 300,
  },
  
  faqText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 12,
  },
  
  followUpContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  
  followUpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  followUpButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  
  followUpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Clarification Component Styles
  clarificationContainer: {
    backgroundColor: '#FAF5FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    maxWidth: 350,
  },
  
  clarificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  
  optionsGrid: {
    gap: 8,
  },
  
  clarificationOption: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  
  clarificationOptionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Rejection Component Styles
  rejectionContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    maxWidth: 350,
  },
  
  rejectionMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  
  rejectionSuggestion: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  
  rejectionSuggestionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MessageBubble; 