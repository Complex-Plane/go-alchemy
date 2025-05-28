/**
 * Problem List Component - Category-Specific Problem Browser
 *
 * This component displays a grid of individual problems within a selected category.
 * It provides an efficient, virtualized list of problems with thumbnail previews
 * and smooth navigation to the problem-solving interface.
 *
 * @file app/problems/[category].tsx
 * @author Go Alchemy Team
 * @version 0.1.2
 * @route /problems/[category]
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SGF_FILES } from '@/assets/problems';
import { Problem } from '@/types/sgf';
import { useProblemContext } from '@/contexts/ProblemContext';
import { ProblemCard } from '@/components/ProblemCard';

/**
 * Responsive Grid Configuration
 *
 * Calculates optimal item dimensions for a 4-column grid layout
 * that adapts to different screen sizes while maintaining proper spacing.
 */
const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 56) / 4; // 56 = padding (16) * 2 + gap between items (8) * 3

/**
 * Problem List Component
 *
 * Features:
 * - Dynamic loading of problems based on category parameter
 * - 4-column responsive grid layout
 * - Virtualized rendering for performance with large problem sets
 * - Integration with problem navigation context
 * - Loading states and error handling
 *
 * Performance Optimizations:
 * - useCallback for render functions to prevent unnecessary re-renders
 * - getItemLayout for FlatList optimization
 * - Virtualization settings for memory management
 * - removeClippedSubviews for off-screen item cleanup
 *
 * @returns {React.Component} Virtualized grid of problem cards
 */
export default function ProblemList() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const { setProblemContext } = useProblemContext();

  // Get problems for the current category from the SGF files index
  const problems = category ? SGF_FILES[category]?.problems || [] : [];

  /**
   * Initialize Problem Context
   *
   * Sets up the problem navigation context with all problem IDs
   * from the current category, enabling smooth navigation between
   * problems within the category.
   */
  useEffect(() => {
    if (problems.length > 0) {
      setProblemContext(
        problems.map((p) => p.id),
        category
      );
      setIsLoading(false);
    }
  }, [problems, category, setProblemContext]);

  /**
   * Renders individual problem card
   *
   * Each card displays:
   * - Problem thumbnail/preview
   * - Problem identifier
   * - Visual feedback on touch
   *
   * @param {Object} params - Render item parameters
   * @param {Problem} params.item - Problem data object
   * @returns {React.Component} Interactive problem card
   */
  const renderItem = useCallback(
    ({ item }: { item: Problem }) => {
      const handlePress = () => {
        router.push({
          pathname: '/problems/problem/[id]' as const,
          params: { id: item.id.toString(), category }
        });
      };

      return <ProblemCard problem={item} onPress={handlePress} />;
    },
    [router, category]
  );

  /**
   * Optimized key extractor for FlatList performance
   *
   * @param {Problem} item - Problem object
   * @returns {string} Unique key for the item
   */
  const keyExtractor = useCallback((item: Problem) => item.id.toString(), []);

  /**
   * Optimized item layout calculator for FlatList virtualization
   *
   * Pre-calculating item positions improves scrolling performance
   * and enables features like scrollToIndex.
   *
   * @param {any} _ - Unused data parameter
   * @param {number} index - Item index in the list
   * @returns {Object} Layout information for the item
   */
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemWidth + styles.row.marginBottom,
      offset: (itemWidth + styles.row.marginBottom) * Math.floor(index / 4),
      index
    }),
    [itemWidth]
  );

  // Loading state display
  if (isLoading) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <FlatList
      data={problems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={4} // 4-column grid for optimal mobile viewing
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      initialNumToRender={16} // Render first 4 rows immediately
      maxToRenderPerBatch={16} // Render in batches of 4 rows
      windowSize={5} // Keep 5 screens worth of items in memory
      getItemLayout={getItemLayout} // Pre-calculated layouts for smooth scrolling
      removeClippedSubviews={true} // Remove off-screen items from memory
      accessible={true}
      accessibilityLabel={`${category} problems list`}
      accessibilityHint={`Scrollable grid of ${problems.length} problems`}
    />
  );
}

/**
 * Stylesheet for Problem List
 *
 * Defines responsive grid layout with proper spacing and alignment
 * for optimal viewing and interaction on mobile devices.
 */
const styles = StyleSheet.create({
  // Main list container with padding
  listContainer: {
    padding: 16
  },

  // Row styling for grid columns
  row: {
    justifyContent: 'flex-start', // Align items to start of each row
    marginBottom: 16 // Vertical spacing between rows
  },

  // Individual item container (used by ProblemCard)
  itemContainer: {
    width: itemWidth,
    marginRight: 8 // Horizontal spacing between items
  },

  // Problem card image container with shadow and rounded corners
  imageContainer: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },

  // Placeholder for loading/missing images
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E1E1'
  },

  // Problem card image styling
  image: {
    width: '100%',
    height: '100%'
  },

  // Problem name text styling
  name: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center'
  }
});

/**
 * Data Flow:
 *
 * 1. Component receives category parameter from route
 * 2. Loads problems from SGF_FILES index based on category
 * 3. Initializes problem context for navigation between problems
 * 4. Renders virtualized grid of problem cards
 * 5. Handles navigation to individual problem solver
 *
 * Navigation Path:
 * /problems → /problems/[category] (this component) → /problems/problem/[id]
 *
 * Context Integration:
 * - ProblemContext: Maintains list of problem IDs and current category
 * - Router: Handles navigation with type-safe parameters
 * - SGF_FILES: Static problem index with metadata and file references
 *
 * Performance Considerations:
 * - FlatList virtualization for efficient memory usage
 * - Optimized render functions prevent unnecessary re-renders
 * - Pre-calculated layouts improve scrolling performance
 * - Batch rendering reduces frame drops on large lists
 */
