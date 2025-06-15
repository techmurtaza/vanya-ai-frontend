/**
 * Typing Indicator Component for Ask Rezzy Client
 * 
 * This component provides a visual indication that the AI assistant is
 * currently processing and generating a response. It displays three animated
 * dots that bounce in sequence to create an engaging loading animation.
 * 
 * Key Features:
 * - Smooth animated dots with staggered timing
 * - Native animation performance using React Native Animated API
 * - Infinite loop animation that runs until component unmounts
 * - Consistent styling with chat message bubbles
 * - Accessible visual feedback for AI response generation
 * 
 * The animation creates a professional and polished user experience by
 * providing clear feedback during AI response generation periods.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/**
 * TypingIndicator Component
 * 
 * Renders three animated dots that bounce up and down in sequence to indicate
 * that the AI is typing/generating a response. The animation uses React Native's
 * Animated API for smooth, performant animations that run on the native thread.
 * 
 * Animation Flow:
 * 1. Three dots are created with individual Animated.Value references
 * 2. Each dot animates with a staggered delay (0ms, 150ms, 300ms)
 * 3. Animation sequence: fade up -> fade down -> repeat infinitely
 * 4. Loop continues until component unmounts
 * 
 * @returns {JSX.Element} Animated typing indicator with three bouncing dots
 * 
 * @example
 * {isLoading && <TypingIndicator />}
 */
const TypingIndicator = () => {
  // Create animated values for each dot's vertical position
  // Using useRef to persist values across re-renders and avoid recreation
  const dot1 = useRef(new Animated.Value(0)).current; // First dot animation value
  const dot2 = useRef(new Animated.Value(0)).current; // Second dot animation value  
  const dot3 = useRef(new Animated.Value(0)).current; // Third dot animation value

  /**
   * Effect Hook for Animation Setup
   * 
   * Sets up the infinite animation loop when the component mounts.
   * The animation creates a wave-like effect by staggering the timing
   * of each dot's bounce animation.
   */
  useEffect(() => {
    /**
     * Create Animation Sequence for Individual Dot
     * 
     * Creates a complete animation sequence for a single dot including
     * delay, up movement, and down movement with smooth transitions.
     * 
     * @param {Animated.Value} dot - The animated value for the dot
     * @param {number} delay - Delay in milliseconds before animation starts
     * @returns {Animated.CompositeAnimation} Complete animation sequence
     */
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.sequence([
        // Initial delay to create staggered effect
        Animated.delay(delay),
        
        // Animate dot upward (bounce up)
        Animated.timing(dot, {
          toValue: 1,              // Target value (will be interpolated to -5px)
          duration: 300,           // Animation duration in milliseconds
          useNativeDriver: true,   // Use native driver for better performance
        }),
        
        // Animate dot downward (bounce down)
        Animated.timing(dot, {
          toValue: 0,              // Return to original position
          duration: 300,           // Animation duration in milliseconds
          useNativeDriver: true,   // Use native driver for better performance
        }),
      ]);
    };

    // Create infinite loop animation with all three dots
    const loop = Animated.loop(
      // Run all three dot animations in parallel with different delays
      Animated.parallel([
        animate(dot1, 0),     // First dot starts immediately
        animate(dot2, 150),   // Second dot starts after 150ms
        animate(dot3, 300),   // Third dot starts after 300ms
      ])
    );

    // Start the animation loop
    loop.start();
    
    // Cleanup function to stop animation when component unmounts
    return () => loop.stop();
  }, [dot1, dot2, dot3]); // Dependencies: animated values

  /**
   * Create Dot Style with Animation Transform
   * 
   * Generates the animated style object for a dot by interpolating
   * the animated value to create the vertical bounce effect.
   * 
   * @param {Animated.Value} dot - The animated value for the dot
   * @returns {Object} Style object with animated transform
   */
  const createDotStyle = (dot: Animated.Value) => ({
    transform: [
      {
        // Interpolate animated value to vertical translation
        translateY: dot.interpolate({
          inputRange: [0, 1],    // Input range: 0 (down) to 1 (up)
          outputRange: [0, -5],  // Output range: 0px to -5px (upward movement)
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {/* First animated dot */}
      <Animated.View style={[styles.dot, createDotStyle(dot1)]} />
      
      {/* Second animated dot */}
      <Animated.View style={[styles.dot, createDotStyle(dot2)]} />
      
      {/* Third animated dot */}
      <Animated.View style={[styles.dot, createDotStyle(dot3)]} />
    </View>
  );
};

/**
 * StyleSheet for TypingIndicator component
 * 
 * Defines the layout and appearance of the typing indicator container
 * and individual dots. Uses consistent spacing and colors that match
 * the overall chat interface design.
 */
const styles = StyleSheet.create({
  // Container for the three dots with horizontal layout
  container: {
    flexDirection: 'row',        // Arrange dots horizontally
    alignItems: 'center',        // Center dots vertically
    justifyContent: 'flex-start', // Align dots to the left (like assistant messages)
    padding: 15,                 // Padding to match message bubble spacing
  },
  
  // Individual dot styling
  dot: {
    width: 8,                    // Dot width
    height: 8,                   // Dot height  
    borderRadius: 4,             // Make dots circular (half of width/height)
    backgroundColor: '#A1A1AA',  // Gray color for subtle appearance
    marginHorizontal: 3,         // Horizontal spacing between dots
  },
});

export default TypingIndicator; 