import {
  BoardCoordinates,
  BoardRange,
  ScreenCoordinates,
  ScreenRange
} from '@/types/board';
import { useMemo } from 'react';

/**
 * Input parameters for board dimensions calculation
 */
type BoardDimensionsProps = {
  range: BoardRange;
  availableWidth: number;
  availableHeight: number;
  paddingMin: number;
  showCoordinates: boolean;
  boardSize: number;
};

/**
 * Output values from board dimensions calculation
 */
type BoardDimensionsOutput = {
  delta: number;
  renderRange: ScreenRange;
  transformCoordinates: (boardCoord: BoardCoordinates) => ScreenCoordinates;
  getNearestIntersection: (screenCoord: ScreenCoordinates) => BoardCoordinates;
};

/**
 * useBoardDimensions - Custom hook for board geometry calculations
 *
 * This hook handles:
 * 1. Calculating the spacing between board intersections
 * 2. Determining visible board area based on screen size
 * 3. Converting between board coordinates and screen coordinates
 * 4. Snapping screen positions to the nearest board intersection
 * 5. Adjusting for coordinate labels display
 *
 * @param {BoardDimensionsProps} props - Dimensions calculation parameters
 * @returns {BoardDimensionsOutput} Calculated dimensions and conversion functions
 */
export function useBoardDimensions({
  range,
  availableWidth,
  availableHeight,
  paddingMin: initialPaddingMin,
  showCoordinates,
  boardSize
}: BoardDimensionsProps): BoardDimensionsOutput {
  return useMemo(() => {
    // Adjust padding for coordinates if needed
    const paddingMin = showCoordinates
      ? initialPaddingMin + 10
      : initialPaddingMin;

    // Range of board vertices
    const nx = Math.max(range.endX - range.startX + 1, 1);
    const ny = Math.max(range.endY - range.startY + 1, 1);

    // Spacing between intersections
    const deltaX = (availableWidth - 2 * paddingMin) / nx;
    const deltaY = (availableHeight - 2 * paddingMin) / ny;
    // Use the smaller delta to maintain proper aspect ratio
    const delta = Math.min(deltaX, deltaY);

    // Padding between screen edge and top-left vertex
    // Center the board if more space is available
    const paddingX = Math.max(
      paddingMin,
      (availableWidth - delta * (nx - 1)) / 2
    );
    const paddingY = Math.max(
      paddingMin,
      (availableHeight - delta * (ny - 1)) / 2
    );

    // Calculate range for drawing lines, may extend beyond the problem range
    const renderRange: ScreenRange = {
      startX: Math.max(0, range.startX + Math.floor(-paddingX / delta)),
      endX: Math.min(
        boardSize - 1,
        range.startX + Math.ceil((availableWidth - paddingX) / delta)
      ),
      startY: Math.max(0, range.startY + Math.floor(-paddingY / delta)),
      endY: Math.min(
        boardSize - 1,
        range.startY + Math.ceil((availableHeight - paddingY) / delta)
      )
    };

    // Transform from board coordinates to screen coordinates
    const transformCoordinates = ([
      boardX,
      boardY
    ]: BoardCoordinates): ScreenCoordinates => {
      const screenX = paddingX + (boardX - range.startX) * delta;
      const screenY = paddingY + (boardY - range.startY) * delta;
      return [screenX, screenY];
    };

    // Transform from screen coordinates to nearest board intersection
    const getNearestIntersection = ([
      screenX,
      screenY
    ]: ScreenCoordinates): BoardCoordinates => {
      const boardX = Math.round((screenX - paddingX) / delta) + range.startX;
      const boardY = Math.round((screenY - paddingY) / delta) + range.startY;

      // Ensure coordinates stay within board bounds
      const clampedX = Math.max(0, Math.min(boardSize - 1, boardX));
      const clampedY = Math.max(0, Math.min(boardSize - 1, boardY));

      return [clampedX, clampedY];
    };

    return {
      delta,
      renderRange,
      transformCoordinates,
      getNearestIntersection
    };
  }, [
    range,
    availableWidth,
    availableHeight,
    showCoordinates,
    boardSize,
    initialPaddingMin
  ]);
}
