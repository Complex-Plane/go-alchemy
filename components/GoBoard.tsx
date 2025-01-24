import React, { Profiler, useState } from 'react';
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
import { BoardRange, Coordinate } from '@/types/board';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useGame } from '@/contexts/GameContext';
import { useBoardInput } from '@/hooks/useBoardInput';
import { profilerRender } from '@/utils/profilerUtils';
import { useGameTree } from '@/contexts/GameTreeContext';
import { vertexToSgf, sgfToVertex } from '@/utils/sgfUtils';
import { transformVertex } from '@/helper/setupBoard';
import { useTransform } from '@/contexts/TransformContext';

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
    useState<Coordinate | null>(null);

  const showHint: boolean = useSelector(
    (state: RootState) => state.settings.showHint
  );
  const showCoordinates: boolean = useSelector(
    (state: RootState) => state.settings.showCoordinates
  );

  const {
    spacing,
    totalBoardWidth,
    totalBoardHeight,
    transformCoordinates,
    getNearestIntersection
  } = useBoardDimensions({
    range,
    availableWidth,
    availableHeight,
    showCoordinates
  });

  const handleIntersectionHover = (x: number, y: number) => {
    const intersection = getNearestIntersection(x, y);
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

  const getColumnLabel = (col: number): string => {
    if (col >= 8) col++; // Skip 'I'
    return String.fromCharCode(65 + col); // 65 is 'A' in ASCII
  };

  // const renderCoordinates = (type: string, index: number) => {
  //   const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // Skip 'I'
  //   if (type === 'row') return `${index + 1}`;
  //   if (type === 'col') return letters[index];
  // };

  const renderGrid = () => {
    const lines = [];
    const [rangeStartX, rangeStartY] = transformCoordinates(
      range.startX,
      range.startY
    );
    const [rangeEndX, rangeEndY] = transformCoordinates(range.endX, range.endY);

    // Calculate how many lines we can fit in the available space
    const maxLinesLeft = Math.floor(rangeStartX / spacing);
    const maxLinesRight = Math.floor((totalBoardWidth - rangeEndX) / spacing);
    const maxLinesTop = Math.floor(rangeStartY / spacing);
    const maxLinesBottom = Math.floor((totalBoardHeight - rangeEndY) / spacing);

    // Calculate actual start and end coordinates
    const startX = Math.max(0, range.startX - maxLinesLeft);
    const endX = Math.min(boardSize - 1, range.endX + maxLinesRight);
    const startY = Math.max(0, range.startY - maxLinesTop);
    const endY = Math.min(boardSize - 1, range.endY + maxLinesBottom);

    // Vertical lines
    for (let x = startX; x <= endX; x++) {
      const [x1, y1] = transformCoordinates(x, startY);
      const [x2, y2] = transformCoordinates(x, endY);
      lines.push(
        <Line
          key={`v${x}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke='black'
          strokeWidth='1'
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y++) {
      const [x1, y1] = transformCoordinates(startX, y);
      const [x2, y2] = transformCoordinates(endX, y);
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
  };

  const renderStones = () => {
    const stones = [];
    const stoneSize = spacing * STONE_SCALE;

    for (let y = range.startY; y <= range.endY; y++) {
      for (let x = range.startX; x <= range.endX; x++) {
        const stone = board.get([x, y]);
        if (stone !== 0) {
          const [cx, cy] = transformCoordinates(x, y);
          const isLastPlayedStone =
            currentNode?.data.B?.[0] === vertexToSgf([x, y]) ||
            currentNode?.data.W?.[0] === vertexToSgf([x, y]);

          stones.push(
            <G key={`${x}-${y}`}>
              <SvgImage
                x={cx - stoneSize / 2}
                y={cy - stoneSize / 2}
                width={stoneSize}
                height={stoneSize}
                href={stone === 1 ? STONE_IMAGES.BLACK : STONE_IMAGES.WHITE}
              />
              {isLastPlayedStone && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={spacing * 0.25}
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

    const { x, y } = hoveredIntersection;
    const [cx, cy] = transformCoordinates(x, y);
    const stoneSize = spacing * STONE_SCALE;

    if (!isValidMove([x, y])) return null;

    return (
      <SvgImage
        x={cx - stoneSize / 2}
        y={cy - stoneSize / 2}
        width={stoneSize}
        height={stoneSize}
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
          const [cx, cy] = transformCoordinates(x, y);
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

    const { x, y } = hoveredIntersection;
    const [hx, hy] = transformCoordinates(x, y);
    const color = isValidMove([x, y]) ? '#00ff00' : '#ff0000';

    return (
      <G>
        <Line
          x1={hx}
          y1={0}
          x2={hx}
          y2={totalBoardHeight}
          stroke={color}
          strokeWidth='2'
          opacity='0.5'
        />
        <Line
          x1={0}
          y1={hy}
          x2={totalBoardWidth}
          y2={hy}
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
        const [cx, cy] = transformCoordinates(tx, ty);
        const color = type === 'o' ? 'green' : type === 'x' ? 'red' : null;
        if (color) {
          hints.push(
            <Circle
              key={`hint-${tx}-${ty}`}
              cx={cx}
              cy={cy}
              r={spacing * 0.2}
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
    const labelOffset = spacing * 0.75;

    for (let x = range.startX; x <= range.endX; x++) {
      const [cx] = transformCoordinates(x, range.startY);
      const [_, topY] = transformCoordinates(range.startX, range.startY);
      const [__, bottomY] = transformCoordinates(range.startX, range.endY);
      const label = getColumnLabel(x);

      labels.push(
        <SvgText
          key={`top-${x}`}
          x={cx}
          y={topY - labelOffset}
          textAnchor='middle'
          fill='black'
          fontSize={spacing * 0.5}
        >
          {label}
        </SvgText>,
        <SvgText
          key={`bottom-${x}`}
          x={cx}
          y={bottomY + labelOffset}
          textAnchor='middle'
          fill='black'
          fontSize={spacing * 0.5}
        >
          {label}
        </SvgText>
      );
    }

    return labels;
  };

  const renderRowLabels = () => {
    if (!showCoordinates) return null;

    const labels = [];
    const xLeft = -spacing * 0.2; // Left of the board
    const xRight = totalBoardWidth + spacing * 0.2; // Right of the board

    for (let y = range.startY; y <= range.endY; y++) {
      const [, cy] = transformCoordinates(0, y);
      const label = (y + 1).toString();

      labels.push(
        <SvgText
          key={`left-${y}`}
          x={xLeft}
          y={cy}
          textAnchor='middle'
          alignmentBaseline='middle'
          fill='black'
          fontSize={spacing * 0.5}
        >
          {label}
        </SvgText>,
        <SvgText
          key={`right-${y}`}
          x={xRight}
          y={cy}
          textAnchor='middle'
          alignmentBaseline='middle'
          fill='black'
          fontSize={spacing * 0.5}
        >
          {label}
        </SvgText>
      );
    }

    return labels;
  };

  const renderLabelsAndMarks = () => {
    const markups: React.ReactElement[] = [];
    const MARK_SCALE = 0.6; // Adjust size of marks relative to spacing
    const LABEL_FONT_SIZE = spacing * 0.4; // Adjust font size relative to spacing

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
          const [cx, cy] = transformCoordinates(tx, ty);
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
          const [cx, cy] = transformCoordinates(tx, ty);
          const stone = board.get([tx, ty]);
          const markSize = spacing * MARK_SCALE;
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

  return (
    <Profiler id='GoBoard' onRender={profilerRender}>
      <View
        style={[
          styles.container,
          {
            width: totalBoardWidth,
            height: totalBoardHeight
          }
        ]}
      >
        <Svg
          width={totalBoardWidth}
          height={totalBoardHeight}
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
          </G>
        </Svg>
      </View>
    </Profiler>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6BA7A'
  }
});
