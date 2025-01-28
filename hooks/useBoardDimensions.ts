import {
  BoardCoordinates,
  BoardRange,
  ScreenCoordinates,
  ScreenRange
} from '@/types/board';
import { useMemo } from 'react';

type BoardDimensionsProps = {
  range: BoardRange;
  availableWidth: number;
  availableHeight: number;
  paddingMin: number;
  showCoordinates: boolean;
  boardSize: number;
};

type BoardDimensionsOutput = {
  delta: number;
  paddingX: number;
  paddingY: number;
  renderRange: ScreenRange;
  transformCoordinates: ([
    boardX,
    boardY
  ]: BoardCoordinates) => ScreenCoordinates;
  getNearestIntersection: ([
    screenX,
    screenY
  ]: ScreenCoordinates) => BoardCoordinates;
};

export function useBoardDimensions({
  range,
  availableWidth,
  availableHeight,
  paddingMin,
  showCoordinates,
  boardSize
}: BoardDimensionsProps): BoardDimensionsOutput {
  return useMemo(() => {
    // Range of board vertices
    const nx = Math.max(range.endX - range.startX + 1, 1);
    const ny = Math.max(range.endY - range.startY + 1, 1);
    paddingMin = showCoordinates ? paddingMin + 10 : paddingMin;

    // Spacing between intersections
    const deltaX = (availableWidth - 2 * paddingMin) / nx;
    const deltaY = (availableHeight - 2 * paddingMin) / ny;
    const delta = Math.min(deltaX, deltaY);

    // Padding between screen and top-left vertex
    const paddingX = Math.max(
      paddingMin,
      (availableWidth - delta * (nx - 1)) / 2
    );
    const paddingY = Math.max(
      paddingMin,
      (availableHeight - delta * (ny - 1)) / 2
    );

    // Range for drawing lines on board. May extend beyond `range`
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

    // console.log('availableWidth: ', availableWidth);
    // console.log('availableHeight: ', availableHeight);
    // console.log('nx: ', nx);
    // console.log('ny: ', ny);
    // console.log('deltaX: ', deltaX);
    // console.log('deltaY: ', deltaY);
    // console.log('delta: ', delta);
    // console.log('paddingMin: ', paddingMin);
    // console.log('paddingX: ', paddingX);
    // console.log('paddingY: ', paddingY);
    // console.log('range: ', range);
    // console.log('renderRange: ', renderRange);

    // Transform from board coordinates to screen coordinates
    const transformCoordinates = ([
      boardX,
      boardY
    ]: BoardCoordinates): ScreenCoordinates => {
      const screenX = paddingX + (boardX - range.startX) * delta;
      const screenY = paddingY + (boardY - range.startY) * delta;
      return [screenX, screenY];
    };

    // Transform from screen coordinates to board coordinates
    const getNearestIntersection = ([
      screenX,
      screenY
    ]: ScreenCoordinates): BoardCoordinates => {
      const boardX = Math.round((screenX - paddingX) / delta) + range.startX;
      const boardY = Math.round((screenY - paddingY) / delta) + range.startY;
      return [boardX, boardY];
    };

    return {
      delta,
      paddingX,
      paddingY,
      renderRange,
      transformCoordinates,
      getNearestIntersection
    };
  }, [range, availableWidth, availableHeight, showCoordinates]);
}
