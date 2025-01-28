import * as Haptics from 'expo-haptics';
import { BoardCoordinates } from '@/types/board';
import { useGame } from '@/contexts/GameContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useBoardInput() {
  const { placeStone, isValidMove } = useGame();
  const hapticsEnabled: boolean = useSelector(
    (state: RootState) => state.settings.hapticsEnabled
  );

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
