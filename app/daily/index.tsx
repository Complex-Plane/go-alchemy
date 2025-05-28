/**
 * Daily Problems Component - Curated Daily Practice Interface
 *
 * This component provides a curated selection of Go problems for daily practice.
 * It automatically selects a variety of problems from different categories,
 * creating a balanced training session that refreshes each day.
 *
 * @file app/daily/index.tsx
 * @author Go Alchemy Team
 * @version 0.1.2
 * @route /daily
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Problem } from '@/types/sgf';
import { ProblemCard } from '@/components/ProblemCard';
import { useProblemContext } from '@/contexts/ProblemContext';
import { getDailyProblems, resetDailyProblems } from '@/utils/checkNewDay';

/**
 * Configuration for daily problem generation
 * Controls how many problems are selected from each category
 */
const PROBLEMS_PER_CATEGORY = 2;

/**
 * Type definition for categorized problem sets
 * Groups problems by their category for organized display
 */
interface DailyProblemSet {
  category: string;
  problems: Problem[];
}

/**
 * Daily Problems Component
 *
 * Features:
 * - Automatic daily problem curation from multiple categories
 * - Horizontal scrolling problem lists grouped by category
 * - Integration with problem navigation context
 * - Manual reset capability for testing and user preference
 * - Loading states and error handling
 *
 * Problem Selection Strategy:
 * - Selects PROBLEMS_PER_CATEGORY from each available category
 * - Ensures variety in daily practice sessions
 * - Problems refresh automatically each day
 * - Maintains consistent difficulty progression
 *
 * @returns {React.Component} Daily problems interface with categorized lists
 */
export default function DailyProblems() {
  const router = useRouter();
  const [dailyProblems, setDailyProblems] = useState<DailyProblemSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setProblemContext } = useProblemContext();

  /**
   * Updates daily problems and sets navigation context
   *
   * This function:
   * 1. Fetches curated daily problems across categories
   * 2. Flattens the problem list for navigation context
   * 3. Updates component state with categorized problems
   * 4. Handles loading state transitions
   */
  const updateProblems = async () => {
    try {
      const problems = await getDailyProblems(PROBLEMS_PER_CATEGORY);

      // Set problem context with all daily problem IDs for navigation
      const problemIds = problems.flatMap((set) =>
        set.problems.map((p) => p.id)
      );
      setProblemContext(problemIds);

      setDailyProblems(problems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading daily problems:', error);
      setIsLoading(false);
      // Could show error message to user here
    }
  };

  /**
   * Initialize daily problems on component mount
   *
   * Automatically loads the daily problem set when the component
   * is first rendered, ensuring fresh problems are available.
   */
  useEffect(() => {
    updateProblems();
  }, []);

  /**
   * Handles navigation to individual daily problems
   *
   * @param {Problem} problem - Problem data object
   * @param {string} category - Problem category for context
   */
  const handleProblemPress = (problem: Problem, category: string) => {
    router.push({
      pathname: '/daily/problem/[id]' as const,
      params: {
        id: problem.id.toString(),
        category
      }
    });
  };

  // Loading state with accessibility support
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size='large'
          accessibilityLabel='Loading daily problems'
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Main section header */}
      <Text h4 style={styles.sectionTitle}>
        Daily Problems
      </Text>

      {/* Development/Testing reset button */}
      <Button
        onPress={resetDailyProblems}
        title='Reset Daily Problems'
        type='outline'
        size='sm'
        containerStyle={styles.resetButton}
        accessibilityLabel='Reset daily problems'
        accessibilityHint='Generates a new set of daily problems'
      />

      {/* Render each category's problems */}
      {dailyProblems.map((set) => (
        <View key={set.category} style={styles.categoryContainer}>
          {/* Category title */}
          <Text h4 style={styles.categoryTitle}>
            {set.category.charAt(0).toUpperCase() + set.category.slice(1)}
          </Text>

          {/* Horizontal scrolling list of problems for this category */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.problemsRow}
            accessible={true}
            accessibilityLabel={`${set.category} daily problems`}
          >
            {set.problems.map((problem) => (
              <ProblemCard
                key={`${set.category}-${problem.id}`}
                problem={problem}
                onPress={() => handleProblemPress(problem, set.category)}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

/**
 * Stylesheet for Daily Problems
 *
 * Creates a clean, organized layout with proper spacing between
 * categories and smooth horizontal scrolling for problem cards.
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    padding: 16
  },

  // Loading state container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Main section title styling
  sectionTitle: {
    marginBottom: 12,
    paddingLeft: 4
  },

  // Reset button container
  resetButton: {
    marginBottom: 16,
    alignSelf: 'flex-start'
  },

  // Individual category container
  categoryContainer: {
    marginBottom: 24
  },

  // Category title styling
  categoryTitle: {
    marginBottom: 12,
    paddingLeft: 4
  },

  // Horizontal scrolling container for problems
  problemsRow: {
    flexDirection: 'row',
    paddingHorizontal: 4
  }
});

/**
 * Daily Problems Algorithm:
 *
 * The getDailyProblems utility function implements:
 * 1. Deterministic problem selection based on current date
 * 2. Even distribution across all available categories
 * 3. Difficulty progression over time
 * 4. Avoidance of recent problems to prevent repetition
 *
 * Navigation Flow:
 * /daily (this component) → /daily/problem/[id]
 *
 * The daily problems route provides an alternative entry point to
 * problem solving that emphasizes consistent daily practice over
 * category-specific study.
 *
 * Context Integration:
 * - ProblemContext: Manages navigation between daily problems
 * - Router: Handles navigation to daily problem solver
 * - Daily utilities: Manage problem curation and refresh logic
 *
 * User Experience Considerations:
 * - Horizontal scrolling prevents overwhelming users with too many options
 * - Category grouping helps users understand problem variety
 * - Visual consistency with other sections of the app
 * - Quick access to reset for users who want fresh problems
 *
 * Performance Notes:
 * - Problem selection is cached per day to avoid recalculation
 * - Lazy loading of problem metadata
 * - Efficient rendering of horizontal lists
 * - Memory-conscious image loading for problem previews
 */
