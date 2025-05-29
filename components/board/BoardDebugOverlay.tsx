import React from 'react';
import { Rect } from 'react-native-svg';
import { BoardProps } from './types';

/**
 * Renders debug overlays showing board ranges for development
 */
export const BoardDebugOverlay: React.FC<BoardProps> = React.memo(({
  range,
  renderRange,
  transformCoordinates,
}) => {
  // Full problem range
  const [startX, startY] = transformCoordinates([range.startX, range.startY]);
  const [endX, endY] = transformCoordinates([range.endX, range.endY]);

  // Actual render range
  const [renderStartX, renderStartY] = transformCoordinates([
    renderRange.startX,
    renderRange.startY
  ]);
  const [renderEndX, renderEndY] = transformCoordinates([
    renderRange.endX,
    renderRange.endY
  ]);

  return (
    <>
      {/* Problem range */}
      <Rect
        x={startX}
        y={startY}
        width={endX - startX}
        height={endY - startY}
        stroke='blue'
        strokeWidth={4}
        fill='none'
      />
      
      {/* Render range */}
      <Rect
        x={renderStartX}
        y={renderStartY}
        width={renderEndX - renderStartX}
        height={renderEndY - renderStartY}
        stroke='red'
        strokeWidth={5}
        fill='none'
        opacity={0.5}
      />
    </>
  );
});
