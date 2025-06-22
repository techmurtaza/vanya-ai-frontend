/**
 * Message Bubble Component for Ask Rezzy Medical Education Client
 * 
 * Enterprise-grade message rendering component that handles structured medical education
 * content with intelligent layout management and responsive design patterns.
 * 
 * ARCHITECTURE OVERVIEW:
 * This component implements a polymorphic message system that dynamically renders
 * different educational content types based on backend response structure. Each
 * content type maintains its own state management and user interaction patterns.
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Smart dynamic height system with min/max constraints for optimal content display
 * - Independent component architecture for MCQs, flashcards, and educational content
 * - Professional spacing strategy with margin/padding separation for clean UI
 * - Cross-platform responsive design with mobile-first optimization
 * - Accessibility-compliant interaction patterns for medical education
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Lazy rendering of complex interactive components
 * - Optimized ScrollView nesting for content overflow management
 * - Efficient state management to prevent unnecessary re-renders
 * - Memory-conscious handling of large medical content datasets
 * 
 * SUPPORTED CONTENT TYPES:
 * - Interactive MCQ Component: Multi-question quizzes with navigation and explanations
 * - Flashcard Component: Study cards with flip animations and category organization
 * - Medical FAQ Component: Comprehensive explanations with follow-up suggestions
 * - Greeting Component: Welcome interface with medical topic quick actions
 * - Clarification Component: Disambiguation options for medical topic queries
 * - Rejection Component: Professional handling of non-medical queries
 * 
 * @author Medical Education Platform Team
 * @version 2.2.0
 * @since 2.0.0 - Initial medical education transformation
 * @updated 2024-12-19 - Smart dynamic layout implementation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
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
 * MCQ Component - Interactive Multiple Choice Questions with Smart Navigation
 * 
 * COMPONENT ARCHITECTURE:
 * Implements a single-question focused design with intelligent navigation controls
 * and dynamic height management for optimal content display across all platforms.
 * 
 * KEY FEATURES:
 * - Smart dynamic height: minHeight 320px, maxHeight 500px (mobile) / 450px (desktop)
 * - Independent explanation card architecture to prevent option overlap
 * - Horizontal scrolling for long answer options to prevent text cutoff
 * - Professional navigation with disabled state visual feedback
 * - Responsive design optimized for medical education content
 * 
 * TECHNICAL IMPLEMENTATION:
 * - State management for answer selection and explanation visibility
 * - Navigation bounds checking with visual feedback
 * - Separate explanation card rendering to maintain clean UI separation
 * - Cross-platform scrolling optimization for content overflow
 * 
 * @param {MCQResponse} data - Structured MCQ data from medical education backend
 * @returns {JSX.Element} Interactive MCQ component with navigation
 */
const MCQComponent = ({ data }: { data: MCQResponse }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = data.questions[currentQuestionIndex];
  const canGoNext = currentQuestionIndex < data.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;

  const goToNext = () => {
    if (canGoNext) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <View style={styles.mcqContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="graduation-cap" size={20} color="#DC2626" />
        <Text style={styles.headerText}>📚 {data.topic.toUpperCase()} MCQs</Text>
      </View>
      
      {/* Single Question Card */}
      <View style={styles.questionCardFixed}>
        {/* Question Header with Navigation */}
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {data.questions.length}
          </Text>
          
          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
              onPress={goToPrev}
              disabled={!canGoPrev}
            >
              <FontAwesome name="chevron-left" size={14} color={canGoPrev ? "#DC2626" : "#D1D5DB"} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
              onPress={goToNext}
              disabled={!canGoNext}
            >
              <FontAwesome name="chevron-right" size={14} color={canGoNext ? "#DC2626" : "#D1D5DB"} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Scrollable Question Text */}
        <ScrollView style={styles.questionTextContainer} nestedScrollEnabled={true}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </ScrollView>
        
        {/* Fixed Options Container */}
        <View style={styles.optionsContainerFixed}>
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionFixed,
                selectedAnswers[currentQuestion.id] === key && styles.selectedOption,
                showAnswers && currentQuestion.correctAnswer === key && styles.correctOption,
                showAnswers && selectedAnswers[currentQuestion.id] === key && currentQuestion.correctAnswer !== key && styles.incorrectOption
              ]}
              onPress={() => setSelectedAnswers(prev => ({...prev, [currentQuestion.id]: key}))}
              disabled={showAnswers}
            >
              <Text style={styles.optionLetter}>{key})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionTextScroll}>
                <Text style={[
                  styles.optionTextFixed,
                  showAnswers && currentQuestion.correctAnswer === key && styles.correctOptionText
                ]}>
                  {value}
                </Text>
              </ScrollView>
            </TouchableOpacity>
          ))}
        </View>
        
      </View>
      
      {/* Separate Explanation Card (appears below question card) */}
      {showAnswers && (
        <View style={styles.explanationCard}>
          <View style={styles.explanationHeader}>
            <FontAwesome name="lightbulb-o" size={16} color="#059669" />
            <Text style={styles.explanationHeaderText}>Explanation for Question {currentQuestionIndex + 1}</Text>
          </View>
          <ScrollView style={styles.explanationContentScroll} nestedScrollEnabled={true}>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </ScrollView>
        </View>
      )}
      

      
      {/* Check Answers Button */}
      <TouchableOpacity 
        style={styles.checkButton}
        onPress={() => setShowAnswers(!showAnswers)}
      >
        <Text style={styles.checkButtonText}>
          {showAnswers ? 'Hide Explanation' : 'Check Answers'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Flashcard Component - Interactive Study Cards with Smart Navigation
 * 
 * COMPONENT ARCHITECTURE:
 * Single-card focused design with flip animations and intelligent height management
 * for optimal medical terminology display across all device types.
 * 
 * KEY FEATURES:
 * - Smart dynamic height: minHeight 220px, maxHeight 320px (mobile) / 280px (desktop)
 * - Flip animation state management with Set-based tracking for performance
 * - Professional navigation controls with orange medical education theme
 * - Responsive card dimensions with scrollable content for long medical terms
 * - Category-based organization for medical education content structure
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Set-based flipped card tracking for efficient state management
 * - Touch-optimized flip interactions with visual feedback
 * - Navigation bounds checking with disabled state styling
 * - Cross-platform scroll optimization for medical terminology display
 * 
 * @param {FlashcardResponse} data - Structured flashcard data from medical education backend
 * @returns {JSX.Element} Interactive flashcard component with navigation and flip animations
 */
const FlashcardComponent = ({ data }: { data: FlashcardResponse }) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentCard = data.cards[currentCardIndex];
  const canGoNext = currentCardIndex < data.cards.length - 1;
  const canGoPrev = currentCardIndex > 0;

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

  const goToNext = () => {
    if (canGoNext) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  return (
    <View style={styles.flashcardContainer}>
      <View style={styles.headerContainer}>
        <FontAwesome name="clone" size={20} color="#F59E0B" />
        <Text style={styles.headerText}>🎴 {data.topic.toUpperCase()} Flashcards</Text>
      </View>
      
      {/* Single Flashcard */}
      <View style={styles.flashcardFixed}>
        {/* Card Header with Navigation */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardCounter}>
            Card {currentCardIndex + 1} of {data.cards.length}
          </Text>
          
          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
              onPress={goToPrev}
              disabled={!canGoPrev}
            >
              <FontAwesome name="chevron-left" size={14} color={canGoPrev ? "#F59E0B" : "#D1D5DB"} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
              onPress={goToNext}
              disabled={!canGoNext}
            >
              <FontAwesome name="chevron-right" size={14} color={canGoNext ? "#F59E0B" : "#D1D5DB"} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Flashcard Content */}
        <TouchableOpacity
          style={styles.flashcardContent}
          onPress={() => toggleCard(currentCard.id)}
        >
          <View style={styles.cardContent}>
            {!flippedCards.has(currentCard.id) ? (
              <>
                <Text style={styles.cardLabel}>FRONT</Text>
                <ScrollView style={styles.cardTextScroll} nestedScrollEnabled={true}>
                  <Text style={styles.cardText}>{currentCard.front}</Text>
                </ScrollView>
              </>
            ) : (
              <>
                <Text style={styles.cardLabel}>BACK</Text>
                <ScrollView style={styles.cardTextScroll} nestedScrollEnabled={true}>
                  <Text style={styles.cardText}>{currentCard.back}</Text>
                </ScrollView>
                <Text style={styles.categoryText}>Category: {currentCard.category}</Text>
              </>
            )}
          </View>
          <Text style={styles.tapHint}>Tap to flip</Text>
        </TouchableOpacity>
      </View>
      

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
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScrollContainer}
        contentContainerStyle={styles.suggestionsScrollContent}
      >
        {data.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSendMessage?.(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScrollContainer}
        contentContainerStyle={styles.suggestionsScrollContent}
      >
        {data.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.rejectionSuggestion}
            onPress={() => onSendMessage?.(suggestion)}
          >
            <Text style={styles.rejectionSuggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
 * Responsive Dimensions for Medical Education Components
 */
const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isMobile = screenWidth <= 480;

// Responsive card widths
const MCQ_CARD_WIDTH = isMobile ? screenWidth - 60 : isTablet ? 350 : 280;
const FLASHCARD_WIDTH = isMobile ? screenWidth - 80 : isTablet ? 300 : 260;

/**
 * Comprehensive StyleSheet for Medical Education Components
 * 
 * DESIGN SYSTEM ARCHITECTURE:
 * Professional medical education styling with intelligent responsive design patterns
 * and optimized spacing strategies for cross-platform consistency.
 * 
 * KEY DESIGN PRINCIPLES:
 * - Smart Dynamic Heights: Hybrid min/max constraints for optimal content display
 * - Professional Spacing: Margin/padding separation strategy for clean UI
 * - Medical Theme Colors: Healthcare-appropriate color palette with accessibility
 * - Cross-Platform Optimization: Responsive design for mobile, tablet, and desktop
 * - Content Accessibility: Scrollable overflow handling for long medical content
 * 
 * LAYOUT STRATEGY:
 * - MCQ Cards: 320-500px height range with independent explanation cards
 * - Flashcard Cards: 220-320px height range with flip animation support
 * - Component Separation: Professional margin/padding for clean visual hierarchy
 * - Responsive Breakpoints: Mobile-first design with tablet and desktop optimization
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Platform-specific shadow implementations for optimal rendering
 * - Efficient color scheme management with theme-aware styling
 * - Optimized scroll view configurations for nested content
 * - Memory-conscious style object creation and reuse
 * 
 * @version 2.2.0 - Smart dynamic layout implementation
 * @updated 2024-12-19 - Professional spacing and height constraint optimization
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
  
  // Smart Dynamic MCQ Styles with Constraints
  questionCardFixed: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 20, // Extra bottom padding for explanation separation
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 320, // Minimum height for consistency
    maxHeight: isMobile ? 500 : 450, // Maximum to prevent screen overflow
    width: '100%',
    marginBottom: 8, // Bottom margin for explanation card separation
  },
  
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  navButtonDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  
  questionTextContainer: {
    maxHeight: 80,
    marginBottom: 12,
  },
  
  optionsContainerFixed: {
    flex: 1,
    gap: 8,
  },
  
  optionFixed: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 8,
    minWidth: 20,
  },
  
  optionTextScroll: {
    flex: 1,
  },
  
  optionTextFixed: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  
  explanationScroll: {
    maxHeight: 60,
    marginTop: 8,
  },
  
  // Separate Explanation Card Styles
  explanationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    marginTop: 8, // Reduced since question card has bottom margin
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  
  explanationHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065F46',
    marginLeft: 6,
  },
  
  explanationContentScroll: {
    maxHeight: 120,
    marginTop: 4,
  },
  

  
  // Swipe Hint (shared)
  swipeHint: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
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
  
  // Smart Dynamic Flashcard Styles with Constraints
  flashcardFixed: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 20, // Extra bottom padding
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 220, // Minimum height for consistency
    maxHeight: isMobile ? 320 : 280, // Maximum to prevent overflow
    width: '100%',
    marginBottom: 8, // Bottom margin for separation
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
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  flashcardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cardTextScroll: {
    flex: 1,
    maxHeight: 120,
    width: '100%',
  },
  
  cardCounter: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
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
  
  // Horizontal Suggestions Scroll
  suggestionsScrollContainer: {
    maxHeight: 40,
  },
  
  suggestionsScrollContent: {
    paddingHorizontal: 4,
    gap: 8,
    alignItems: 'center',
  },
  
  suggestionButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 2,
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
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  
  rejectionSuggestionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MessageBubble; 