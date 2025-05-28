/**
 * Problem Context Provider - Global Problem Navigation State Management
 *
 * This context manages the global state for problem navigation throughout
 * the application. It provides a centralized way to track which problems
 * are currently available, what category they belong to, and which problem
 * the user is currently viewing.
 *
 * @file contexts/ProblemContext.tsx
 * @author Go Alchemy Team
 * @version 0.1.2
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Problem Context Interface
 *
 * Defines the shape of the problem navigation state and available actions.
 * This interface ensures type safety when consuming the context.
 */
interface ProblemContextType {
  /** Array of problem IDs currently available for navigation */
  problemIds: number[];

  /** Category of the current problem set (optional for mixed sets like daily problems) */
  category?: string;

  /** Sets the problem context with a new set of problems and category */
  setProblemContext: (ids: number[], cat?: string) => void;

  /** Current index in the problemIds array */
  currentProblemIndex: number;

  /** Updates the current problem index for navigation */
  setCurrentProblemIndex: (index: number) => void;
}

/**
 * Problem Context Instance
 *
 * Creates the React context with undefined default value.
 * The undefined default ensures that the hook will throw an error
 * if used outside of a provider, preventing silent failures.
 */
const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

/**
 * Problem Provider Component
 *
 * Provides problem navigation state to all child components.
 * This should wrap any part of the app that needs access to
 * problem navigation functionality.
 *
 * Features:
 * - Maintains list of problem IDs for current session
 * - Tracks current problem category for contextual information
 * - Provides current problem index for navigation controls
 * - Resets index when new problem set is loaded
 *
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Child components to wrap with context
 * @returns {React.Component} Context provider component
 */
export const ProblemProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // State for the list of problem IDs in current context
  const [problemIds, setProblemIds] = useState<number[]>([]);

  // State for the current category (e.g., 'tsumego', 'tesuji', etc.)
  const [category, setCategory] = useState<string | undefined>();

  // State for tracking position in the current problem set
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  /**
   * Sets Problem Navigation Context
   *
   * This function initializes or updates the problem navigation context
   * with a new set of problems. It's typically called when:
   * - User navigates to a category page
   * - Daily problems are loaded
   * - A filtered set of problems is selected
   *
   * @param {number[]} ids - Array of problem IDs to make available for navigation
   * @param {string} [cat] - Optional category name for contextual information
   */
  const setProblemContext = (ids: number[], cat?: string) => {
    setProblemIds(ids);
    setCategory(cat);
    setCurrentProblemIndex(0); // Reset to first problem when context changes
  };

  /**
   * Context Value
   *
   * Provides the current state and actions to all consuming components.
   * This object is memoized by React to prevent unnecessary re-renders
   * when the provider re-renders for other reasons.
   */
  const contextValue: ProblemContextType = {
    problemIds,
    category,
    setProblemContext,
    currentProblemIndex,
    setCurrentProblemIndex
  };

  return (
    <ProblemContext.Provider value={contextValue}>
      {children}
    </ProblemContext.Provider>
  );
};

/**
 * Problem Context Hook
 *
 * Custom hook to consume the problem context. This hook provides
 * a convenient and type-safe way to access the problem navigation
 * state and actions from any component.
 *
 * @throws {Error} If used outside of a ProblemProvider
 * @returns {ProblemContextType} Current problem context state and actions
 *
 * @example
 * ```tsx
 * function ProblemNavigator() {
 *   const {
 *     problemIds,
 *     currentProblemIndex,
 *     setCurrentProblemIndex
 *   } = useProblemContext();
 *
 *   const nextProblem = () => {
 *     if (currentProblemIndex < problemIds.length - 1) {
 *       setCurrentProblemIndex(currentProblemIndex + 1);
 *     }
 *   };
 *
 *   return (
 *     <Button onPress={nextProblem} disabled={currentProblemIndex === problemIds.length - 1}>
 *       Next Problem
 *     </Button>
 *   );
 * }
 * ```
 */
export const useProblemContext = (): ProblemContextType => {
  const context = useContext(ProblemContext);

  if (!context) {
    throw new Error(
      'useProblemContext must be used within a ProblemProvider. ' +
        'Ensure that your component is wrapped with <ProblemProvider>.'
    );
  }

  return context;
};

/**
 * Usage Patterns:
 *
 * 1. Category Navigation:
 * ```tsx
 * // In category page
 * const { setProblemContext } = useProblemContext();
 * setProblemContext(categoryProblems.map(p => p.id), 'tsumego');
 * ```
 *
 * 2. Daily Problems:
 * ```tsx
 * // In daily problems page
 * const { setProblemContext } = useProblemContext();
 * const dailyProblemIds = dailyProblems.flatMap(set => set.problems.map(p => p.id));
 * setProblemContext(dailyProblemIds); // No category for mixed daily problems
 * ```
 *
 * 3. Problem Navigation:
 * ```tsx
 * // In problem solver
 * const { problemIds, currentProblemIndex, setCurrentProblemIndex } = useProblemContext();
 *
 * const goToNextProblem = () => {
 *   if (currentProblemIndex < problemIds.length - 1) {
 *     setCurrentProblemIndex(currentProblemIndex + 1);
 *     // Navigate to next problem
 *   }
 * };
 * ```
 *
 * Integration with App Architecture:
 *
 * This context is provided at the root level in _layout.js, making it
 * available to all screens and components in the application. It works
 * in conjunction with:
 *
 * - Expo Router for actual navigation between screens
 * - Problem data from SGF_FILES for problem metadata
 * - Redux store for persistent user progress and settings
 * - Game contexts for individual problem solving state
 *
 * The context serves as a bridge between the global navigation state
 * and the local problem-solving state, enabling features like:
 * - "Next Problem" and "Previous Problem" buttons
 * - Progress indicators showing position in problem set
 * - Contextual information about the current problem source
 * - Seamless navigation between related problems
 */
