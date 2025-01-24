import { BoardRange, Coordinate } from '@/types/board';
import { useMemo } from 'react';

type BoardDimensionsProps = {
  range: BoardRange;
  availableWidth: number;
  availableHeight: number;
  showCoordinates: boolean;
};

export function useBoardDimensions({
  range,
  availableWidth,
  availableHeight,
  showCoordinates
}: BoardDimensionsProps) {
  return useMemo(() => {
    // Constants
    const STONE_PADDING = 0.5;
    const COORDINATE_PADDING = showCoordinates ? 0.75 : 0;

    // Calculate visible board area
    const visibleWidth = range.endX - range.startX + 1;
    const visibleHeight = range.endY - range.startY + 1;

    // Add padding to visible dimensions
    const totalWidth = visibleWidth + 2 * STONE_PADDING;
    const totalHeight = visibleHeight + 2 * STONE_PADDING;

    // Calculate spacing that fits within available space
    const spacingByWidth =
      (availableWidth - 2 * COORDINATE_PADDING) / totalWidth;
    const spacingByHeight =
      (availableHeight - 2 * COORDINATE_PADDING) / totalHeight;
    const spacing = Math.min(spacingByWidth, spacingByHeight);

    // Calculate actual board dimensions
    const boardWidth = spacing * totalWidth;
    const boardHeight = spacing * totalHeight;

    // Calculate total dimensions including coordinate padding
    const totalBoardWidth = boardWidth + 2 * COORDINATE_PADDING * spacing;
    const totalBoardHeight = boardHeight + 2 * COORDINATE_PADDING * spacing;

    // Transform functions
    const transformCoordinates = (x: number, y: number): [number, number] => {
      const coordPadding = COORDINATE_PADDING * spacing;
      return [
        (x - range.startX + STONE_PADDING) * spacing + coordPadding,
        (y - range.startY + STONE_PADDING) * spacing + coordPadding
      ];
    };

    const getNearestIntersection = (
      touchX: number,
      touchY: number
    ): Coordinate => {
      const coordPadding = COORDINATE_PADDING * spacing;
      const x =
        Math.round((touchX - coordPadding) / spacing - STONE_PADDING) +
        range.startX;
      const y =
        Math.round((touchY - coordPadding) / spacing - STONE_PADDING) +
        range.startY;

      return {
        x: Math.max(range.startX, Math.min(range.endX, x)),
        y: Math.max(range.startY, Math.min(range.endY, y))
      };
    };

    return {
      spacing,
      boardWidth,
      boardHeight,
      totalBoardWidth,
      totalBoardHeight,
      transformCoordinates,
      getNearestIntersection
    };
  }, [range, availableWidth, availableHeight, showCoordinates]);
}
