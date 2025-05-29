import React from 'react';
import {
  Text as SvgText,
  Circle,
  G,
  Line,
  Rect,
  Polygon
} from 'react-native-svg';
import { BoardProps, Mark } from './types';
import { sgfToVertex } from '@/utils/sgfUtils';
import { transformVertex } from '@/utils/boardUtils';

/**
 * Renders board marks (labels, circles, triangles, squares, X marks)
 */
export const BoardMarksAndLabels: React.FC<BoardProps> = React.memo(
  ({
    currentNode,
    board,
    range,
    transformation,
    boardSize,
    transformCoordinates,
    delta
  }) => {
    if (!currentNode || !board) return null;

    const markups: React.ReactElement[] = [];
    const MARK_SCALE = 0.6; // Adjust size of marks relative to spacing
    const LABEL_FONT_SIZE = delta * 0.7; // Adjust font size relative to spacing

    // Handle labels (LB)
    if (currentNode?.data.LB) {
      currentNode.data.LB.forEach((label: string) => {
        const [coordinate, text] = label.split(':');
        const [x, y] = sgfToVertex(coordinate);
        const [tx, ty] = transformVertex([x, y], transformation, boardSize);

        // Skip hint labels ('x' and 'o')
        if (text === 'x' || text === 'o') return;

        if (
          tx >= range.startX &&
          tx <= range.endX &&
          ty >= range.startY &&
          ty <= range.endY
        ) {
          const [cx, cy] = transformCoordinates([tx, ty]);
          const stone = board.get(`${tx},${ty}`);

          markups.push(
            <SvgText
              key={`label-${tx}-${ty}`}
              x={cx}
              y={cy}
              textAnchor='middle'
              alignmentBaseline='central'
              fontSize={LABEL_FONT_SIZE}
              fontWeight='bold'
              fill={stone !== 0 ? (stone === 1 ? 'white' : 'black') : 'black'}
            >
              {text}
            </SvgText>
          );
        }
      });
    }

    /**
     * Render board marks (circles, triangles, squares, X marks)
     */
    const renderMark = (marks: string[] | undefined, type: Mark['type']) => {
      if (!marks) return;

      marks.forEach((coordinate: string) => {
        const [x, y] = sgfToVertex(coordinate);
        const [tx, ty] = transformVertex([x, y], transformation, boardSize);

        if (
          tx >= range.startX &&
          tx <= range.endX &&
          ty >= range.startY &&
          ty <= range.endY
        ) {
          const [cx, cy] = transformCoordinates([tx, ty]);
          const stone = board.get(`${tx},${ty}`);
          const markSize = delta * MARK_SCALE;
          const markColor =
            stone !== 0 ? (stone === 1 ? 'white' : 'black') : 'black';

          switch (type) {
            case 'CR':
              markups.push(
                <Circle
                  key={`circle-${tx}-${ty}`}
                  cx={cx}
                  cy={cy}
                  r={markSize / 2}
                  stroke={markColor}
                  strokeWidth={1.5}
                  fill='none'
                />
              );
              break;
            case 'TR':
              const triangleSize = markSize * 0.866; // height of equilateral triangle
              const trianglePoints = `
              ${cx},${cy - triangleSize / 2}
              ${cx - markSize / 2},${cy + triangleSize / 2}
              ${cx + markSize / 2},${cy + triangleSize / 2}
            `;
              markups.push(
                <Polygon
                  key={`triangle-${tx}-${ty}`}
                  points={trianglePoints}
                  stroke={markColor}
                  strokeWidth={1.5}
                  fill='none'
                />
              );
              break;
            case 'SQ':
              markups.push(
                <Rect
                  key={`square-${tx}-${ty}`}
                  x={cx - markSize / 2}
                  y={cy - markSize / 2}
                  width={markSize}
                  height={markSize}
                  stroke={markColor}
                  strokeWidth={1.5}
                  fill='none'
                />
              );
              break;
            case 'MA':
              const offset = markSize / 2;
              markups.push(
                <G key={`x-mark-${tx}-${ty}`}>
                  <Line
                    x1={cx - offset}
                    y1={cy - offset}
                    x2={cx + offset}
                    y2={cy + offset}
                    stroke={markColor}
                    strokeWidth={1.5}
                  />
                  <Line
                    x1={cx - offset}
                    y1={cy + offset}
                    x2={cx + offset}
                    y2={cy - offset}
                    stroke={markColor}
                    strokeWidth={1.5}
                  />
                </G>
              );
              break;
          }
        }
      });
    };

    // Render all mark types
    renderMark(currentNode?.data.CR, 'CR');
    renderMark(currentNode?.data.TR, 'TR');
    renderMark(currentNode?.data.SQ, 'SQ');
    renderMark(currentNode?.data.MA, 'MA');

    return <>{markups}</>;
  }
);
