/**
 * Problem Solver Component - Interactive Go Problem Interface
 *
 * This is the core component where users solve individual Go problems.
 * It provides a full-featured Go board with interactive controls,
 * comment displays, and game tree navigation for comprehensive
 * problem-solving experience.
 *
 * @file app/problems/problem/[id].tsx
 * @author Go Alchemy Team
 * @version 0.1.2
 * @route /problems/problem/[id]
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { ControlPanel } from '@/components/ControlPanel';
import { GoBoard } from '@/components/GoBoard';
import { GameProvider } from '@/contexts/GameContext';
import { useLocalSearchParams } from 'expo-router';
import { GameTreeProvider } from '@/contexts/GameTreeContext';
import CommentDisplay from '@/components/ui/CommentDisplay';
import ToggleShowCoordinates from '@/components/ToggleShowCoordinates';
import { useDispatch } from 'react-redux';
import { resetShowHint } from '@/store/settingsSlice';
import { TransformProvider } from '@/contexts/TransformContext';
import { TransformationPanel } from '@/components/TransformPanel';
import { SGF_FILES } from '@/assets/problems';

/**
 * Problem Solver Screen Component
 *
 * Architecture:
 * - Multi-layered context providers for isolated state management
 * - Responsive layout calculation for different screen sizes
 * - Error boundary for graceful error handling
 * - Dynamic component sizing based on available screen real estate
 *
 * Context Hierarchy:
 * 1. TransformProvider: Handles board transformations (rotation, mirroring)
 * 2. GameTreeProvider: Manages SGF game tree and problem loading
 * 3. GameProvider: Handles current game state and user interactions
 *
 * Components:
 * - CommentDisplay: Shows problem descriptions and feedback
 * - GoBoard: Interactive Go board for making moves
 * - ControlPanel: Game controls (navigation, hints, restart)
 *
 * @returns {React.Component} Complete problem solving interface
 */
export default function ProblemScreen() {
  const { id, category } = useLocalSearchParams<{
    id: string;
    category: string;
  }>();
  const dispatch = useDispatch();

  /**
   * Reset hint visibility when problem changes
   *
   * This ensures that hints are hidden by default for each new problem,
   * encouraging users to try solving without assistance first.
   */
  useEffect(() => {
    dispatch(resetShowHint());
  }, [id, category, dispatch]);

  // Get screen dimensions for responsive layout
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /**
   * Dynamic Layout Calculation
   *
   * Calculates optimal space allocation for different screen components:
   * - Fixed heights for control panel and comment display
   * - Remaining space allocated to the Go board
   * - Accounts for safe area insets on different devices
   */
  const CONTROL_PANEL_HEIGHT = 150;
  const COMMENT_DISPLAY_HEIGHT = 150;

  const availableHeight =
    windowHeight -
    insets.top -
    insets.bottom -
    CONTROL_PANEL_HEIGHT -
    COMMENT_DISPLAY_HEIGHT;

  const availableWidth = windowWidth - insets.left - insets.right;

  return (
    <ErrorBoundary
      onError={(error, stackTrace) => {
        console.error('Problem screen error:', error, stackTrace);
        // Could integrate with crash reporting service here
      }}
    >
      {/* Transform Provider - Handles board rotations and mirroring */}
      <TransformProvider>
        {/* Game Tree Provider - Loads and manages SGF data */}
        <GameTreeProvider category={category} id={id}>
          {/* Game Provider - Manages current game state */}
          <GameProvider>
            <SafeAreaView style={styles.container}>
              {/* Board transformation controls (currently disabled) */}
              {/* <TransformationPanel /> */}

              {/* Problem description and move feedback */}
              <CommentDisplay />

              {/* Main Go board container with calculated dimensions */}
              <View
                style={[
                  styles.boardContainer,
                  { height: availableHeight, width: availableWidth }
                ]}
              >
                <GoBoard
                  availableWidth={availableWidth}
                  availableHeight={availableHeight}
                />
              </View>

              {/* Game controls and navigation */}
              <ControlPanel />

              {/* Coordinate display toggle (currently disabled) */}
              {/* <ToggleShowCoordinates /> */}

              {/* Debug panel for development (DEV only) */}
              {/* {__DEV__ && <DebugPanel />} */}
            </SafeAreaView>
          </GameProvider>
        </GameTreeProvider>
      </TransformProvider>
    </ErrorBoundary>
  );
}

/**
 * Stylesheet for Problem Solver
 *
 * Defines the layout structure for the problem-solving interface
 * with proper spacing and visual hierarchy.
 */
const styles = StyleSheet.create({
  // Main container taking full screen
  container: {
    flex: 1
  },

  // Go board container with calculated dimensions and visual styling
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#778', // Traditional Go board color
    borderColor: 'black',
    borderWidth: 1
  }
});

/**
 * Component Integration Details:
 *
 * GameTreeProvider:
 * - Loads SGF problem file based on category and ID parameters
 * - Parses game tree structure for navigation and validation
 * - Provides access to problem metadata and variations
 *
 * GameProvider:
 * - Manages current board position and game state
 * - Handles user moves and validation against correct solutions
 * - Tracks game history and enables undo/redo functionality
 *
 * TransformProvider:
 * - Enables board transformations for different viewing perspectives
 * - Useful for corner problems that can be viewed from multiple angles
 * - Maintains transformation state across navigation
 *
 * Layout Strategy:
 * - Fixed heights for UI controls ensure consistent interface
 * - Dynamic board sizing maximizes playing area on different devices
 * - Safe area handling prevents content from being obscured by device UI
 *
 * Error Handling:
 * - ErrorBoundary catches React errors and prevents app crashes
 * - Graceful degradation for missing or corrupted problem files
 * - User-friendly error messages and recovery options
 *
 * Performance Considerations:
 * - Lazy loading of SGF content until needed
 * - Efficient re-rendering through proper context separation
 * - Memory management for large game trees
 *
 * Navigation Context:
 * This component receives parameters from the problem navigation flow:
 * /problems → /problems/[category] → /problems/problem/[id] (this component)
 *
 * The component integrates with the broader problem context to enable:
 * - Navigation between problems in the same category
 * - Progress tracking and completion status
 * - Hint system and solution guidance
 */
