import React from 'react';
import { Circle } from 'react-native-svg';
import { BoardProps } from './types';

/**
 * Renders star points (hoshi) on the board
 * Star points are the marked intersections on standard board positions
 */
export const BoardStarPoints: React.FC<BoardProps> = React.memo(
  ({ range, boardSize, transformCoordinates }) => {
    const starPoints = [];
    const starPositions =
      boardSize === 19
        ? [3, 9, 15]
        : boardSize === 13
        ? [3, 6, 9]
        : [3, boardSize - 4];

    for (const x of starPositions) {
      for (const y of starPositions) {
        if (
          x >= range.startX &&
          x <= range.endX &&
          y >= range.startY &&
          y <= range.endY
        ) {
          const [cx, cy] = transformCoordinates([x, y]);
          starPoints.push(
            <Circle key={`star-${x}-${y}`} cx={cx} cy={cy} r={3} fill='black' />
          );
        }
      }
    }

    return <>{starPoints}</>;
  }
);
