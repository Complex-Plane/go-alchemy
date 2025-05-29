import * as Haptics from 'expo-haptics';
import { BoardCoordinates } from '@/types/board';
import { useGame } from '@/contexts/GameContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

/**
 * useBoardInput - Custom hook for handling board interaction
 *
 * This hook manages:
 * 1. Processing user touch input on the board
 * 2. Validating moves before execution
 * 3. Providing haptic feedback when enabled
 * 4. Communicating with the game context for move execution
 *
 * @returns {Object} Board input handlers
 * @returns {Function} handleMove - Function to process and execute moves
 */
export function useBoardInput() {
  const { placeStone, isValidMove } = useGame();
  const hapticsEnabled: boolean = useSelector(
    (state: RootState) => state.settings.hapticsEnabled
  );

  /**
   * Handle a move attempt at the specified board position
   *
   * @param {BoardCoordinates} point - Board coordinates to play at
   * @returns {Promise<boolean>} True if move was successful
   */
  const handleMove = async (point: BoardCoordinates): Promise<boolean> => {
    if (isValidMove(point)) {
      try {
        if (hapticsEnabled) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
      return placeStone(point);
    }
    return false;
  };

  return {
    handleMove
  };
}
