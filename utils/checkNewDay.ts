/**
 * Daily Problems Management Utilities
 *
 * This module handles the automatic generation and caching of daily problem sets.
 * It provides functions to check if new problems are needed, generate random
 * problem selections, and manage persistent storage of daily problems.
 *
 * @file utils/checkNewDay.ts
 * @author Go Alchemy Team
 * @version 0.1.2
 */

import { SGF_FILES } from '@/assets/problems';
import { Problem } from '@/types/sgf';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys for AsyncStorage persistence
 * Used to maintain daily problem state between app sessions
 */
const LAST_REFRESH_KEY = 'lastDailyProblemRefresh';
const DAILY_PROBLEMS_KEY = 'dailyProblems';

/**
 * Interface for categorized daily problem sets
 * Groups problems by category while maintaining metadata
 */
interface DailyProblemSet {
  category: string;
  problems: Problem[];
}

/**
 * Checks if new daily problems are needed
 *
 * This function determines whether it's a new day and fresh problems
 * should be generated. It compares the stored last refresh date with
 * the current date, checking day, month, and year components.
 *
 * @returns {Promise<boolean>} True if new problems should be generated
 *
 * @example
 * ```typescript
 * const isNewDay = await checkIfNewDayNeeded();
 * if (isNewDay) {
 *   // Generate fresh daily problems
 * }
 * ```
 */
export const checkIfNewDayNeeded = async (): Promise<boolean> => {
  try {
    const lastRefresh = await AsyncStorage.getItem(LAST_REFRESH_KEY);

    // If no previous refresh recorded, definitely need new problems
    if (!lastRefresh) return true;

    const lastDate = new Date(lastRefresh);
    const currentDate = new Date();

    // Check if any date component has changed (day, month, or year)
    return (
      lastDate.getDate() !== currentDate.getDate() ||
      lastDate.getMonth() !== currentDate.getMonth() ||
      lastDate.getFullYear() !== currentDate.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if new day needed:', error);
    // If there's an error reading storage, assume new problems are needed
    return true;
  }
};

/**
 * Selects random problems from a collection
 *
 * Uses Fisher-Yates shuffle algorithm to randomly select problems
 * without replacement. This ensures fair distribution and prevents
 * the same problems from being selected repeatedly.
 *
 * @param {Problem[]} problems - Array of problems to select from
 * @param {number} count - Number of problems to select
 * @returns {Problem[]} Array of randomly selected problems
 *
 * @example
 * ```typescript
 * const tsumegpProblems = SGF_FILES.tsumego.problems;
 * const dailyTsumego = getRandomProblems(tsumegoProblems, 2);
 * ```
 */
const getRandomProblems = (problems: Problem[], count: number): Problem[] => {
  // Create a copy to avoid mutating the original array
  const shuffled = [...problems].sort(() => 0.5 - Math.random());

  // Return requested number of problems (or all if fewer available)
  return shuffled.slice(0, Math.min(count, problems.length));
};

/**
 * Gets daily problem selection for all categories
 *
 * This is the main function for daily problem management. It either
 * returns cached problems from the current day or generates a fresh
 * selection if it's a new day.
 *
 * Algorithm:
 * 1. Check if it's a new day since last refresh
 * 2. If new day: generate random problems from each category
 * 3. If same day: return cached problems from storage
 * 4. Cache new problems with current timestamp
 *
 * @param {number} numProblems - Number of problems to select per category
 * @returns {Promise<DailyProblemSet[]>} Array of problem sets by category
 *
 * @example
 * ```typescript
 * const dailyProblems = await getDailyProblems(2);
 * // Returns 2 problems from each category (tsumego, tesuji, etc.)
 * ```
 */
export const getDailyProblems = async (
  numProblems: number
): Promise<DailyProblemSet[]> => {
  try {
    const needsNewDay = await checkIfNewDayNeeded();

    if (needsNewDay) {
      console.log('Generating new daily problems...');

      // Generate fresh problems from each category
      const problems: DailyProblemSet[] = Object.entries(SGF_FILES).map(
        ([category, { problems }]) => ({
          category,
          problems: getRandomProblems(problems, numProblems)
        })
      );

      // Cache the new problems and update timestamp
      await AsyncStorage.setItem(LAST_REFRESH_KEY, new Date().toISOString());
      await AsyncStorage.setItem(DAILY_PROBLEMS_KEY, JSON.stringify(problems));

      console.log(`Generated ${problems.length} daily problem sets`);
      return problems;
    } else {
      console.log('Loading cached daily problems...');

      // Load cached problems from storage
      const stored = await AsyncStorage.getItem(DAILY_PROBLEMS_KEY);
      if (stored) {
        const parsedProblems = JSON.parse(stored) as DailyProblemSet[];
        console.log(`Loaded ${parsedProblems.length} cached problem sets`);
        return parsedProblems;
      }
    }

    // Fallback: return empty array if no problems available
    console.warn('No daily problems available, returning empty array');
    return [];
  } catch (error) {
    console.error('Error getting daily problems:', error);
    // Return empty array on error to prevent app crashes
    return [];
  }
};

/**
 * Resets daily problems cache
 *
 * This function clears stored daily problems and refresh timestamp,
 * forcing the next getDailyProblems call to generate fresh problems.
 * Useful for testing, debugging, or if users want to refresh their
 * daily problems manually.
 *
 * @returns {Promise<void>} Resolves when cache is cleared
 *
 * @example
 * ```typescript
 * // In a settings screen or debug menu
 * const handleResetDailyProblems = async () => {
 *   await resetDailyProblems();
 *   // Next call to getDailyProblems will generate fresh problems
 * };
 * ```
 */
export const resetDailyProblems = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LAST_REFRESH_KEY);
    await AsyncStorage.removeItem(DAILY_PROBLEMS_KEY);
    console.log('Daily problems cache cleared');
  } catch (error) {
    console.error('Error resetting daily problems:', error);
    throw error; // Re-throw to let caller handle the error
  }
};

/**
 * Advanced Daily Problem Features (Future Enhancements):
 *
 * 1. Difficulty Progression:
 * ```typescript
 * export const getDailyProblemsWithProgression = async (userLevel: number) => {
 *   // Select problems based on user's skill level
 *   // Gradually increase difficulty over time
 * };
 * ```
 *
 * 2. User Preferences:
 * ```typescript
 * export const getDailyProblemsWithPreferences = async (preferences: {
 *   favoriteCategories: string[];
 *   excludeCategories: string[];
 *   difficultyRange: [number, number];
 * }) => {
 *   // Customize problem selection based on user preferences
 * };
 * ```
 *
 * 3. Problem History Tracking:
 * ```typescript
 * export const getDailyProblemsExcludingRecent = async (
 *   numProblems: number,
 *   excludeDays: number = 7
 * ) => {
 *   // Avoid problems solved in the last N days
 * };
 * ```
 *
 * 4. Seasonal/Event-Based Problems:
 * ```typescript
 * export const getSeasonalDailyProblems = async () => {
 *   // Special problem sets for holidays or Go events
 * };
 * ```
 *
 * Storage Optimization:
 *
 * The current implementation stores the complete problem objects in
 * AsyncStorage. For large problem databases, consider storing only
 * problem IDs and loading full data on demand:
 *
 * ```typescript
 * // Store only IDs
 * await AsyncStorage.setItem(DAILY_PROBLEMS_KEY, JSON.stringify(problemIds));
 *
 * // Load full data when needed
 * const loadProblemData = (ids: number[]) => {
 *   return ids.map(id => findProblemById(id));
 * };
 * ```
 *
 * Error Handling:
 *
 * All functions include comprehensive error handling to ensure the app
 * continues to function even if daily problem generation fails. The
 * fallback strategy prioritizes app stability over feature completeness.
 */
