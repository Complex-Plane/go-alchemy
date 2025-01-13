import * as Haptics from 'expo-haptics';
import { Coordinate } from '@/types/board';
import { useGame } from '@/contexts/GameContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useBoardInput() {
  const { placeStone, isValidMove } = useGame();
  const hapticsEnabled: boolean = useSelector(
    (state: RootState) => state.settings.hapticsEnabled
  );

  const handleMove = async (point: Coordinate): Promise<boolean> => {
    const { x, y } = point;
    if (isValidMove([x, y])) {
      try {
        if (hapticsEnabled) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
      return placeStone([x, y]);
    }
    return false;
  };

  return {
    handleMove
  };
}
