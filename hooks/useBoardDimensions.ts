import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { BoardRange, Coordinate } from '@/types/board';

export function useBoardDimensions(size: number, range?: BoardRange) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return useMemo(() => {
    const STONE_PADDING = 0.5;

    // Calculate visible range
    const startX = range?.startX ?? 0;
    const startY = range?.startY ?? 0;
    const endX = range?.endX ?? size - 1;
    const endY = range?.endY ?? size - 1;
    const visibleWidth = endX - startX + 1;
    const visibleHeight = endY - startY + 1;

    // Calculate board dimensions
    const availableSize = Math.min(screenWidth, screenHeight) - 40;
    const totalVisibleWidth = visibleWidth + 2 * STONE_PADDING;
    const totalVisibleHeight = visibleHeight + 2 * STONE_PADDING;

    const spacing = Math.min(
      availableSize / (totalVisibleWidth - 1),
      availableSize / (totalVisibleHeight - 1)
    );

    const actualBoardSize =
      spacing * Math.max(totalVisibleWidth, totalVisibleHeight);

    function transformCoordinates(x: number, y: number): [number, number] {
      return [
        (x - startX + STONE_PADDING) * spacing,
        (y - startY + STONE_PADDING) * spacing
      ];
    }

    function getNearestIntersection(
      touchX: number,
      touchY: number
    ): Coordinate {
      const x = Math.round(touchX / spacing - STONE_PADDING) + startX;
      const y = Math.round(touchY / spacing - STONE_PADDING) + startY;
      return {
        x: Math.max(startX, Math.min(endX, x)),
        y: Math.max(startY, Math.min(endY, y))
      };
    }

    return {
      spacing,
      actualBoardSize,
      transformCoordinates,
      getNearestIntersection,
      visibleRange: { startX, startY, endX, endY }
    };
  }, [screenWidth, screenHeight, size, range]);
}
