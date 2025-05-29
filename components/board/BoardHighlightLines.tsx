import React from 'react';
import { Line, G } from 'react-native-svg';
import { BoardProps } from './types';

/**
 * Render hover effect for touch interaction
 */
export const BoardHighlightLines: React.FC<BoardProps> = React.memo(({
  hoveredIntersection,
  isValidMove,
  renderRange,
  transformCoordinates
}) => {
  if (!hoveredIntersection || !isValidMove) return null;

  const color = isValidMove(hoveredIntersection) ? '#00ff00' : '#ff0000';
  const [x1, y1] = transformCoordinates([
    hoveredIntersection[0],
    renderRange.startY
  ]);
  const [x2, y2] = transformCoordinates([
    hoveredIntersection[0],
    renderRange.endY
  ]);
  const [x3, y3] = transformCoordinates([
    renderRange.startX,
    hoveredIntersection[1]
  ]);
  const [x4, y4] = transformCoordinates([
    renderRange.endX,
    hoveredIntersection[1]
  ]);

  return (
    <G>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth='2'
        opacity='0.5'
      />
      <Line
        x1={x3}
        y1={y3}
        x2={x4}
        y2={y4}
        stroke={color}
        strokeWidth='2'
        opacity='0.5'
      />
    </G>
  );
});
