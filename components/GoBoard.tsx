import React, { Profiler, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Svg, {
  Line,
  Circle,
  G,
  Text as SvgText,
  Image as SvgImage,
  Rect,
  Polygon
} from 'react-native-svg';
import { BoardCoordinates, BoardRange, Coordinate } from '@/types/board';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useGame } from '@/contexts/GameContext';
import { useBoardInput } from '@/hooks/useBoardInput';
import { profilerRender } from '@/utils/profilerUtils';
import { useGameTree } from '@/contexts/GameTreeContext';
import { vertexToSgf, sgfToVertex } from '@/utils/sgfUtils';
import { transformVertex } from '@/helper/setupBoard';
import { useTransform } from '@/contexts/TransformContext';

const DEBUG_RANGES = true;

const STONE_IMAGES = {
  BLACK: require('@/assets/images/black_stone.png'),
  WHITE: require('@/assets/images/white_stone.png')
} as const;
const STONE_SCALE = 0.94;

type Mark = {
  type: 'CR' | 'TR' | 'SQ' | 'MA';
  coordinate: string;
};

type GoBoardProps = {
  availableWidth: number;
  availableHeight: number;
};

export const GoBoard: React.FC<GoBoardProps> = ({
  availableWidth,
  availableHeight
}) => {
  const { board, currentPlayer, isValidMove } = useGame();
  const { currentNode, boardSize, range } = useGameTree();
  const { transformation } = useTransform();
  const { handleMove } = useBoardInput();
  const [hoveredIntersection, setHoveredIntersection] =
    useState<BoardCoordinates | null>(null);

  const showHint: boolean = useSelector(
    (state: RootState) => state.settings.showHint
  );
  const showCoordinates: boolean = useSelector(
    (state: RootState) => state.settings.showCoordinates
  );

  const paddingMin = 10;

  const { delta, renderRange, transformCoordinates, getNearestIntersection } =
    useBoardDimensions({
      range,
      availableWidth,
      availableHeight,
      paddingMin,
      showCoordinates,
      boardSize
    });

  const STONE_SIZE = delta * STONE_SCALE;

  const handleIntersectionHover = (x: number, y: number) => {
    const intersection = getNearestIntersection([x, y]);
    setHoveredIntersection(intersection);
  };

  const handleTouchStart = (event: any) => {
    const touch = event.nativeEvent;
    handleIntersectionHover(touch.locationX, touch.locationY);
  };

  const handleTouchMove = (event: any) => {
    const touch = event.nativeEvent;
    handleIntersectionHover(touch.locationX, touch.locationY);
  };

  const handleTouchEnd = async () => {
    if (hoveredIntersection) {
      await handleMove(hoveredIntersection);
    }
    setHoveredIntersection(null);
  };

  const renderGrid = useCallback(() => {
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

    return lines;
  }, [delta, renderRange, transformation]);

  const renderStones = () => {
    const stones = [];

    for (let y = renderRange.startY; y <= renderRange.endY; y++) {
      for (let x = renderRange.startX; x <= renderRange.endX; x++) {
        const stone = board.get([x, y]);
        if (stone && stone !== 0) {
          const [cx, cy] = transformCoordinates([x, y]);
          const isLastPlayedStone =
            currentNode?.data.B?.[0] === vertexToSgf([x, y]) ||
            currentNode?.data.W?.[0] === vertexToSgf([x, y]);

          stones.push(
            <G key={`${x}-${y}`}>
              <SvgImage
                x={cx - STONE_SIZE / 2}
                y={cy - STONE_SIZE / 2}
                width={STONE_SIZE}
                height={STONE_SIZE}
                href={stone === 1 ? STONE_IMAGES.BLACK : STONE_IMAGES.WHITE}
              />
              {isLastPlayedStone && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={delta * 0.25}
                  stroke={stone === 1 ? 'white' : 'black'}
                  strokeWidth={1.5}
                  fill='none'
                />
              )}
            </G>
          );
        }
      }
    }

    return stones;
  };

  const renderGhostStone = () => {
    if (!hoveredIntersection) return null;

    const [cx, cy] = transformCoordinates(hoveredIntersection);

    if (!isValidMove(hoveredIntersection)) return null;

    return (
      <SvgImage
        x={cx - STONE_SIZE / 2}
        y={cy - STONE_SIZE / 2}
        width={STONE_SIZE}
        height={STONE_SIZE}
        href={currentPlayer === 1 ? STONE_IMAGES.BLACK : STONE_IMAGES.WHITE}
        opacity={0.5}
      />
    );
  };

  const renderStarPoints = () => {
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

    return starPoints;
  };

  const renderHighlightLines = () => {
    if (!hoveredIntersection) return null;

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
  };

  const renderHints = () => {
    if (!showHint || !currentNode?.data.LB) return null;

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

    return hints;
  };

  const renderColumnLabels = () => {
    if (!showCoordinates) return null;

    const labels = [];
    const labelOffset = delta * 0.75;
    const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // Skip 'I'

    // Only render labels for columns within renderRange
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

    return labels;
  };

  const renderRowLabels = () => {
    if (!showCoordinates) return null;

    const labels = [];
    const labelOffset = delta * 0.75;

    // Only render labels for rows within renderRange
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

    return labels;
  };

  const renderLabelsAndMarks = () => {
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
          const stone = board.get([tx, ty]);

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

    // Helper function to render marks
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
          const stone = board.get([tx, ty]);
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

    return markups;
  };

  const renderRangeDebug = () => {
    const [startX, startY] = transformCoordinates([range.startX, range.startY]);
    const [endX, endY] = transformCoordinates([range.endX, range.endY]);

    return (
      <Rect
        x={startX}
        y={startY}
        width={endX - startX}
        height={endY - startY}
        stroke='blue'
        strokeWidth={4}
        fill='none'
      />
    );
  };

  const renderRenderRangeDebug = () => {
    const [startX, startY] = transformCoordinates([
      renderRange.startX,
      renderRange.startY
    ]);
    const [endX, endY] = transformCoordinates([
      renderRange.endX,
      renderRange.endY
    ]);

    return (
      <Rect
        x={startX}
        y={startY}
        width={endX - startX}
        height={endY - startY}
        stroke='red'
        strokeWidth={5}
        fill='none'
        opacity={0.5}
      />
    );
  };

  return (
    // <Profiler id='GoBoard' onRender={profilerRender}>
    <View
      style={[
        styles.container,
        {
          width: availableWidth,
          height: availableHeight
        }
      ]}
    >
      <Svg
        width={availableWidth}
        height={availableHeight}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <G>
          {renderGrid()}
          {renderStarPoints()}
          {renderHighlightLines()}
          {renderStones()}
          {renderHints()}
          {renderLabelsAndMarks()}
          {renderGhostStone()}
          {renderColumnLabels()}
          {renderRowLabels()}
          {DEBUG_RANGES && renderRangeDebug()}
          {DEBUG_RANGES && renderRenderRangeDebug()}
        </G>
      </Svg>
    </View>
    // </Profiler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6BA7A'
  }
});
