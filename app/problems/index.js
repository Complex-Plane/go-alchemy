/**
 * Problems Category Browser - Main Problems Section Landing Page
 *
 * This component displays a grid of Go problem categories, allowing users
 * to browse and select different types of problems to practice. Each category
 * is presented as a visually appealing card with distinctive colors and imagery.
 *
 * @file app/problems/index.js
 * @author Go Alchemy Team
 * @version 0.1.2
 * @route /problems
 */

import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Text } from '@rneui/themed';
import { useRouter } from 'expo-router';

/**
 * Go Problem Categories Configuration
 *
 * Each category represents a different aspect of Go strategy and tactics:
 * - Tsumego: Life and death problems (capture/escape scenarios)
 * - Tesuji: Tactical problems with clever moves
 * - Shape: Good and bad shapes, efficient stone placement
 * - Opening: Whole-board opening strategy (fuseki)
 * - Sabaki: Light, flexible play in difficult situations
 * - Joseki: Standard corner sequences and variations
 */
const categories = [
  {
    key: 'tsumego',
    title: 'Tsumego',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#FF6B6B' // Red tint for life & death urgency
  },
  {
    key: 'tesuji',
    title: 'Tesuji',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#4ECDC4' // Teal for tactical brilliance
  },
  {
    key: 'shape',
    title: 'Shape',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#45B7D1' // Blue for structural concepts
  },
  {
    key: 'opening',
    title: 'Opening',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#FFBE0B' // Yellow for opening principles
  },
  {
    key: 'sabaki',
    title: 'Sabaki',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#9B5DE5' // Purple for flexible play
  },
  {
    key: 'joseki',
    title: 'Joseki',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#00F5D4' // Cyan for corner patterns
  }
];

// Calculate responsive grid dimensions
const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 48) / 2; // 48 = padding (16) * 2 + gap between items (16)

/**
 * Problems Category Browser Component
 *
 * Displays a responsive 2-column grid of problem categories.
 * Each category card features:
 * - Background image with colored tint
 * - Category name overlay
 * - Touch interaction for navigation
 * - Visual elevation and shadows
 *
 * @returns {React.Component} Grid of problem categories
 */
export default function Problems() {
  const router = useRouter();

  /**
   * Renders individual category card
   *
   * @param {Object} item - Category configuration object
   * @param {string} item.key - Category identifier for routing
   * @param {string} item.title - Display name for the category
   * @param {string} item.src - Image source for category thumbnail
   * @param {string} item.tint - Color tint overlay for category theme
   *
   * @returns {React.Component} Touchable category card
   */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`/problems/${item.key}`)}
      accessible={true}
      accessibilityLabel={`${item.title} problems category`}
      accessibilityHint={`Opens the ${item.title} problems list for practice`}
    >
      <View style={[styles.imageContainer, { backgroundColor: item.tint }]}>
        {/* Background image for visual appeal */}
        <Image source={item.src} style={styles.image} resizeMode='cover' />

        {/* Title overlay with semi-transparent background */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        numColumns={2} // 2-column grid layout
        columnWrapperStyle={styles.row} // Styling for each row
        contentContainerStyle={styles.listContainer}
        accessible={true}
        accessibilityLabel='Problem categories grid'
      />
    </View>
  );
}

/**
 * Stylesheet for Problems Category Browser
 *
 * Creates a responsive grid layout with proper spacing, shadows,
 * and visual hierarchy for the category selection interface.
 */
const styles = StyleSheet.create({
  // Main container with white background
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  // FlatList content container with padding
  listContainer: {
    padding: 16
  },

  // Row styling for 2-column layout
  row: {
    justifyContent: 'space-between',
    marginBottom: 16
  },

  // Individual category card container
  itemContainer: {
    width: itemWidth
  },

  // Image container with rounded corners and shadow
  imageContainer: {
    width: itemWidth,
    height: itemWidth, // Square aspect ratio
    borderRadius: 16,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden' // Ensures content stays within rounded corners
  },

  // Background image styling
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute' // Behind the text overlay
  },

  // Title overlay container
  titleContainer: {
    ...StyleSheet.absoluteFillObject, // Fill entire image container
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)' // Semi-transparent overlay for text visibility
  },

  // Category title text styling
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    // Text shadow for better readability over images
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

/**
 * Navigation Flow:
 *
 * /problems (this component) → /problems/[category] → /problems/problem/[id]
 *
 * This component serves as the entry point for problem selection, leading users
 * through a hierarchical navigation structure from categories to individual problems.
 *
 * Category Selection → Problem List → Problem Solver
 *
 * Each category contains multiple problems organized by difficulty and type,
 * providing a structured learning path for Go improvement.
 */
