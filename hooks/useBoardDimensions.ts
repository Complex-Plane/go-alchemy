import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { BoardRange, Coordinate } from '@/types/board';

type BoardDimensionsProps = {
  boardSize: number;
  range: BoardRange;
  containerHeight: number;
  showCoordinates: boolean;
};

export function useBoardDimensions({
  boardSize,
  range,
  containerHeight,
  showCoordinates
}: BoardDimensionsProps) {
  const { width: screenWidth } = useWindowDimensions();

  return useMemo(() => {
    const STONE_PADDING = 0.5;
    const SCREEN_PADDING = 0;
    const COORDINATE_PADDING = showCoordinates ? 5 : 0; // Additional padding when showing coordinates

    // Calculate visible range
    const startX = range?.startX ?? 0;
    const startY = range?.startY ?? 0;
    const endX = range?.endX ?? boardSize - 1;
    const endY = range?.endY ?? boardSize - 1;
    const visibleWidth = endX - startX + 1;
    const visibleHeight = endY - startY + 1;

    // Calculate board dimensions
    const availableWidth =
      screenWidth - (SCREEN_PADDING + COORDINATE_PADDING) * 2;
    const availableHeight =
      containerHeight - (SCREEN_PADDING + COORDINATE_PADDING) * 2;

    const totalVisibleWidth = visibleWidth + 2 * STONE_PADDING;
    const totalVisibleHeight = visibleHeight + 2 * STONE_PADDING;

    // Calculate spacing based on both width and height constraints
    const spacingByWidth = availableWidth / totalVisibleWidth;
    const spacingByHeight = availableHeight / totalVisibleHeight;
    const spacing = Math.min(spacingByWidth, spacingByHeight);

    // Calculate actual board dimensions
    const actualBoardWidth = spacing * totalVisibleWidth;
    const actualBoardHeight = spacing * totalVisibleHeight;

    // Calculate offsets to center the board
    const horizontalOffset =
      (availableWidth - actualBoardWidth) / 2 +
      SCREEN_PADDING +
      COORDINATE_PADDING;
    const verticalOffset =
      (availableHeight - actualBoardHeight) / 2 +
      SCREEN_PADDING +
      COORDINATE_PADDING;

    console.log('screenWidth: ', screenWidth);
    // console.log('screenHeight: ', screenHeight);
    console.log('startX: ', startX);
    console.log('startY: ', startY);
    console.log('endX: ', endX);
    console.log('endY: ', endY);
    console.log('visibleWidth: ', visibleWidth);
    console.log('visibleHeight: ', visibleHeight);
    console.log('availableWidth: ', availableWidth);
    console.log('availableHeight: ', availableHeight);
    console.log('totalVisibleWidth: ', totalVisibleWidth);
    console.log('totalVisibleHeight: ', totalVisibleHeight);
    console.log('spacingByWidth: ', spacingByWidth);
    console.log('spacingByHeight: ', spacingByHeight);
    console.log('spacing: ', spacing);
    console.log('actualBoardWidth: ', actualBoardWidth);
    console.log('actualBoardHeight: ', actualBoardHeight);
    console.log('horizontalOffset: ', horizontalOffset);
    console.log('verticalOffset: ', verticalOffset);

    function transformCoordinates(x: number, y: number): [number, number] {
      return [
        (x - startX + STONE_PADDING) * spacing + horizontalOffset,
        (y - startY + STONE_PADDING) * spacing + verticalOffset
      ];
    }

    function getNearestIntersection(
      touchX: number,
      touchY: number
    ): Coordinate {
      const adjustedX = touchX - horizontalOffset;
      const adjustedY = touchY - verticalOffset;

      const x = Math.round(adjustedX / spacing - STONE_PADDING) + startX;
      const y = Math.round(adjustedY / spacing - STONE_PADDING) + startY;

      return {
        x: Math.max(startX, Math.min(endX, x)),
        y: Math.max(startY, Math.min(endY, y))
      };
    }

    return {
      spacing,
      actualBoardWidth,
      actualBoardHeight,
      horizontalOffset,
      verticalOffset,
      transformCoordinates,
      getNearestIntersection,
      visibleRange: { startX, startY, endX, endY }
    };
  }, [screenWidth, containerHeight, boardSize, range, showCoordinates]);
}
