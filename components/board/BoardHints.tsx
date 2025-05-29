import React from 'react';
import { Circle } from 'react-native-svg';
import { BoardProps } from './types';
import { sgfToVertex } from '@/utils/sgfUtils';
import { transformVertex } from '@/utils/boardUtils';

/**
 * Renders hint highlighting for the next move
 */
export const BoardHints: React.FC<BoardProps> = React.memo(
  ({
    currentNode,
    range,
    transformation,
    boardSize,
    transformCoordinates,
    delta
  }) => {
    if (!currentNode?.data.LB) return null;

    const hints: React.ReactElement[] = [];
    const labels = currentNode.data.LB;

    labels.forEach((label: string) => {
      const [coordinate, type] = label.split(':');
      const [x, y] = sgfToVertex(coordinate);
      const [tx, ty] = transformVertex([x, y], transformation, boardSize);

      if (
        tx >= range.startX &&
        tx <= range.endX &&
        ty >= range.startY &&
        ty <= range.endY
      ) {
        const [cx, cy] = transformCoordinates([tx, ty]);
        const color = type === 'o' ? 'green' : type === 'x' ? 'red' : null;
        if (color) {
          hints.push(
            <Circle
              key={`hint-${tx}-${ty}`}
              cx={cx}
              cy={cy}
              r={delta * 0.2}
              fill={color}
              opacity={1}
            />
          );
        }
      }
    });

    return <>{hints}</>;
  }
);
