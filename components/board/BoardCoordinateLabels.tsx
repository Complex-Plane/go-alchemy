import React from 'react';
import { Text as SvgText } from 'react-native-svg';
import { BoardProps } from './types';

/**
 * Renders coordinate labels for rows and columns
 */
export const BoardCoordinateLabels: React.FC<BoardProps> = React.memo(
  ({ renderRange, transformCoordinates, delta, boardSize }) => {
    const labels = [];
    const labelOffset = delta * 0.75;
    const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // Skip 'I'

    // Column labels
    for (let x = renderRange.startX; x <= renderRange.endX; x++) {
      const [cx, _] = transformCoordinates([x, renderRange.startY]);
      const label = letters[x];

      // Top labels - only if we're at the top edge of the board
      if (renderRange.startY === 0) {
        const [_, topY] = transformCoordinates([x, renderRange.startY]);
        labels.push(
          <SvgText
            key={`top-${x}`}
            x={cx}
            y={topY - labelOffset}
            textAnchor='middle'
            fill='black'
            fontSize={delta * 0.5}
          >
            {label}
          </SvgText>
        );
      }

      // Bottom labels - only if we're at the bottom edge of the board
      if (renderRange.endY === boardSize - 1) {
        const [_, bottomY] = transformCoordinates([x, renderRange.endY]);
        labels.push(
          <SvgText
            key={`bottom-${x}`}
            x={cx}
            y={bottomY + labelOffset}
            textAnchor='middle'
            fill='black'
            fontSize={delta * 0.5}
          >
            {label}
          </SvgText>
        );
      }
    }

    // Row labels
    for (let y = renderRange.startY; y <= renderRange.endY; y++) {
      const [_, cy] = transformCoordinates([renderRange.startX, y]);
      const label = `${y + 1}`;

      // Left labels - only if we're at the left edge of the board
      if (renderRange.startX === 0) {
        const [leftX] = transformCoordinates([renderRange.startX, y]);
        labels.push(
          <SvgText
            key={`left-${y}`}
            x={leftX - labelOffset}
            y={cy}
            textAnchor='middle'
            alignmentBaseline='middle'
            fill='black'
            fontSize={delta * 0.5}
          >
            {label}
          </SvgText>
        );
      }

      // Right labels - only if we're at the right edge of the board
      if (renderRange.endX === boardSize - 1) {
        const [rightX] = transformCoordinates([renderRange.endX, y]);
        labels.push(
          <SvgText
            key={`right-${y}`}
            x={rightX + labelOffset}
            y={cy}
            textAnchor='middle'
            alignmentBaseline='middle'
            fill='black'
            fontSize={delta * 0.5}
          >
            {label}
          </SvgText>
        );
      }
    }

    return <>{labels}</>;
  }
);
