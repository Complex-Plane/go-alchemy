import React from 'react';
import { Line } from 'react-native-svg';
import { BoardProps } from './types';

/**
 * Renders the board grid lines
 * Only renders lines within the visible range for performance
 */
export const BoardGrid: React.FC<BoardProps> = React.memo(({
  renderRange,
  transformCoordinates
}) => {
  const lines = [];

  // Vertical lines
  for (let x = renderRange.startX; x <= renderRange.endX; x++) {
    const [x1, y1] = transformCoordinates([x, renderRange.startY]);
    const [x2, y2] = transformCoordinates([x, renderRange.endY]);
    lines.push(
      <Line
        key={`v${x}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke='black'
        strokeWidth='.5'
      />
    );
  }

  // Horizontal lines
  for (let y = renderRange.startY; y <= renderRange.endY; y++) {
    const [x1, y1] = transformCoordinates([renderRange.startX, y]);
    const [x2, y2] = transformCoordinates([renderRange.endX, y]);
    lines.push(
      <Line
        key={`h${y}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke='black'
        strokeWidth='1'
      />
    );
  }

  return <>{lines}</>;
});
