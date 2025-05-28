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

// Stone image assets
const STONE_IMAGES = {
  BLACK: require('@/assets/images/black_stone.png'),
  WHITE: require('@/assets/images/white_stone.png')
} as const;

// Stone size relative to intersection spacing
const STONE_SCALE = 0.94;

/**
 * Mark type for board annotations (circles, triangles, squares, X marks)
 */
type Mark = {
  type: 'CR' | 'TR' | 'SQ' | 'MA';
  coordinate: string;
};

/**
 * Props for the GoBoard component
 */
type GoBoardProps = {
  availableWidth: number;
  availableHeight: number;
};

/**
 * GoBoard - Interactive Go game board component
 *
 * This component renders a Go board using SVG, handling:
 * - Board grid rendering with proper spacing
 * - Stone placement and display
 * - Touch/click interaction for moves
 * - Board marks and annotations
 * - Coordinate labels (optional)
 * - Hint highlighting
 * - Board transformations (rotation/mirroring)
 *
 * The board automatically adjusts its size and visible area based on:
 * - Available screen space
 * - Problem's board range (partial board support)
 * - Coordinate display settings
 *
 * Touch interaction flow:
 * 1. Touch start/move updates the hovered intersection
 * 2. Touch end places a stone if the move is valid
 * 3. The game context handles move validation and updates
 *
 * @component
 * @param {GoBoardProps} props - Component props
 * @param {number} props.availableWidth - Available width for the board
 * @param {number} props.availableHeight - Available height for the board
 * @returns {JSX.Element} The rendered Go board
 */
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

  // Get display settings from Redux store
  const showHint: boolean = useSelector(
    (state: RootState) => state.settings.showHint
  );
  const showCoordinates: boolean = useSelector(
    (state: RootState) => state.settings.showCoordinates
  );

  const paddingMin = 10;

  // Calculate board dimensions and coordinate transformations
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

  /**
   * Handle touch/mouse hover over board
   * Updates the hovered intersection for visual feedback
   */
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

  /**
   * Render the board grid lines
   * Only renders lines within the visible range for performance
   */
  const renderGrid = useCallback(() => {
    const lines = [];

    // Vertical lines
    for (let x = renderRange.startX; x <= renderRange.endX; x++) {
      const startCoord = transformCoordinates([x, renderRange.startY]);
      const endCoord = transformCoordinates([x, renderRange.endY]);
      lines.push(
        <Line
          key={`v-${x}`}
          x1={startCoord[0]}
          y1={startCoord[1]}
          x2={endCoord[0]}
          y2={endCoord[1]}
          stroke='black'
          strokeWidth={1}
        />
      );
    }

    // Horizontal lines
    for (let y = renderRange.startY; y <= renderRange.endY; y++) {
      const startCoord = transformCoordinates([renderRange.startX, y]);
      const endCoord = transformCoordinates([renderRange.endX, y]);
      lines.push(
        <Line
          key={`h-${y}`}
          x1={startCoord[0]}
          y1={startCoord[1]}
          x2={endCoord[0]}
          y2={endCoord[1]}
          stroke='black'
          strokeWidth={1}
        />
      );
    }

    return lines;
  }, [renderRange, transformCoordinates]);

  /**
   * Render star points (hoshi) on the board
   * Star points are the marked intersections on standard board positions
   */
  const renderStarPoints = useCallback(() => {
    const starPoints = getStarPoints(boardSize);
    return starPoints
      .filter(
        ([x, y]) =>
          x >= renderRange.startX &&
          x <= renderRange.endX &&
          y >= renderRange.startY &&
          y <= renderRange.endY
      )
      .map(([x, y]) => {
        const coord = transformCoordinates([x, y]);
        return (
          <Circle
            key={`star-${x}-${y}`}
            cx={coord[0]}
            cy={coord[1]}
            r={delta * 0.1}
            fill='black'
          />
        );
      });
  }, [boardSize, renderRange, transformCoordinates, delta]);

  /**
   * Render stones on the board
   * Uses image assets for realistic stone appearance
   */
  const renderStones = useCallback(() => {
    const stones = [];
    const boardState = board.signMap;

    for (let x = renderRange.startX; x <= renderRange.endX; x++) {
      for (let y = renderRange.startY; y <= renderRange.endY; y++) {
        const transformedVertex = transformVertex(
          [x, y],
          transformation,
          boardSize
        );
        const sign = boardState[transformedVertex[1]][transformedVertex[0]];

        if (sign !== 0) {
          const coord = transformCoordinates([x, y]);
          const stoneImage =
            sign === 1 ? STONE_IMAGES.BLACK : STONE_IMAGES.WHITE;

          stones.push(
            <SvgImage
              key={`stone-${x}-${y}`}
              x={coord[0] - STONE_SIZE / 2}
              y={coord[1] - STONE_SIZE / 2}
              width={STONE_SIZE}
              height={STONE_SIZE}
              href={stoneImage}
            />
          );
        }
      }
    }

    return stones;
  }, [
    board.signMap,
    renderRange,
    transformCoordinates,
    STONE_SIZE,
    transformation,
    boardSize
  ]);

  /**
   * Render board marks (circles, triangles, squares, X marks)
   * These are used for annotations and problem hints
   */
  const renderMarks = useCallback(() => {
    if (!currentNode || !currentNode.data) return null;

    const marks: Mark[] = [];

    // Collect all marks from node data
    ['CR', 'TR', 'SQ', 'MA'].forEach((markType) => {
      if (currentNode.data[markType]) {
        currentNode.data[markType].forEach((coord: string) => {
          marks.push({ type: markType as Mark['type'], coordinate: coord });
        });
      }
    });

    return marks.map((mark, index) => {
      const vertex = sgfToVertex(mark.coordinate);
      const inverseTransformedVertex = transformVertex(
        vertex,
        transformation,
        boardSize,
        true
      );

      if (
        inverseTransformedVertex[0] < renderRange.startX ||
        inverseTransformedVertex[0] > renderRange.endX ||
        inverseTransformedVertex[1] < renderRange.startY ||
        inverseTransformedVertex[1] > renderRange.endY
      ) {
        return null;
      }

      const coord = transformCoordinates(inverseTransformedVertex);

      switch (mark.type) {
        case 'CR': // Circle
          return (
            <Circle
              key={`mark-${index}`}
              cx={coord[0]}
              cy={coord[1]}
              r={STONE_SIZE * 0.3}
              fill='none'
              stroke='red'
              strokeWidth={2}
            />
          );
        case 'TR': // Triangle
          const triangleSize = STONE_SIZE * 0.3;
          const trianglePoints = [
            [coord[0], coord[1] - triangleSize],
            [coord[0] - triangleSize * 0.866, coord[1] + triangleSize * 0.5],
            [coord[0] + triangleSize * 0.866, coord[1] + triangleSize * 0.5]
          ]
            .map((p) => p.join(','))
            .join(' ');
          return (
            <Polygon
              key={`mark-${index}`}
              points={trianglePoints}
              fill='none'
              stroke='red'
              strokeWidth={2}
            />
          );
        case 'SQ': // Square
          const squareSize = STONE_SIZE * 0.5;
          return (
            <Rect
              key={`mark-${index}`}
              x={coord[0] - squareSize / 2}
              y={coord[1] - squareSize / 2}
              width={squareSize}
              height={squareSize}
              fill='none'
              stroke='red'
              strokeWidth={2}
            />
          );
        case 'MA': // X mark
          const xSize = STONE_SIZE * 0.3;
          return (
            <G key={`mark-${index}`}>
              <Line
                x1={coord[0] - xSize}
                y1={coord[1] - xSize}
                x2={coord[0] + xSize}
                y2={coord[1] + xSize}
                stroke='red'
                strokeWidth={2}
              />
              <Line
                x1={coord[0] - xSize}
                y1={coord[1] + xSize}
                x2={coord[0] + xSize}
                y2={coord[1] - xSize}
                stroke='red'
                strokeWidth={2}
              />
            </G>
          );
      }
    });
  }, [
    currentNode,
    renderRange,
    transformCoordinates,
    STONE_SIZE,
    transformation,
    boardSize
  ]);

  /**
   * Render coordinate labels around the board edge
   */
  const renderCoordinates = useCallback(() => {
    if (!showCoordinates) return null;

    const labels = [];
    const offset = delta * 0.7;

    // Column labels (A, B, C, ...)
    for (let x = renderRange.startX; x <= renderRange.endX; x++) {
      const coord = transformCoordinates([x, renderRange.startY]);
      const label = String.fromCharCode(65 + x); // A, B, C, ...

      labels.push(
        <SvgText
          key={`col-${x}`}
          x={coord[0]}
          y={coord[1] - offset}
          textAnchor='middle'
          fontSize={delta * 0.4}
          fill='black'
        >
          {label}
        </SvgText>
      );
    }

    // Row labels (1, 2, 3, ...)
    for (let y = renderRange.startY; y <= renderRange.endY; y++) {
      const coord = transformCoordinates([renderRange.startX, y]);
      const label = String(boardSize - y); // Counting from bottom

      labels.push(
        <SvgText
          key={`row-${y}`}
          x={coord[0] - offset}
          y={coord[1]}
          textAnchor='middle'
          alignmentBaseline='middle'
          fontSize={delta * 0.4}
          fill='black'
        >
          {label}
        </SvgText>
      );
    }

    return labels;
  }, [showCoordinates, renderRange, transformCoordinates, delta, boardSize]);

  /**
   * Render hint highlighting for the next move
   */
  const renderHint = useCallback(() => {
    if (
      !showHint ||
      !currentNode ||
      !currentNode.children ||
      currentNode.children.length === 0
    ) {
      return null;
    }

    const hintNode = currentNode.children[0];
    const moveData = hintNode.data.B || hintNode.data.W;

    if (!moveData || moveData.length === 0) return null;

    const hintVertex = sgfToVertex(moveData[0]);
    const inverseTransformedVertex = transformVertex(
      hintVertex,
      transformation,
      boardSize,
      true
    );

    if (
      inverseTransformedVertex[0] < renderRange.startX ||
      inverseTransformedVertex[0] > renderRange.endX ||
      inverseTransformedVertex[1] < renderRange.startY ||
      inverseTransformedVertex[1] > renderRange.endY
    ) {
      return null;
    }

    const coord = transformCoordinates(inverseTransformedVertex);

    return (
      <Circle
        cx={coord[0]}
        cy={coord[1]}
        r={STONE_SIZE * 0.4}
        fill='#00FF00'
        opacity={0.5}
      />
    );
  }, [
    showHint,
    currentNode,
    renderRange,
    transformCoordinates,
    STONE_SIZE,
    transformation,
    boardSize
  ]);

  /**
   * Render hover effect for touch interaction
   */
  const renderHoverEffect = useCallback(() => {
    if (!hoveredIntersection) return null;

    const coord = transformCoordinates(hoveredIntersection);

    return (
      <Circle
        cx={coord[0]}
        cy={coord[1]}
        r={STONE_SIZE / 2}
        fill={currentPlayer === 1 ? 'black' : 'white'}
        opacity={0.3}
      />
    );
  }, [hoveredIntersection, transformCoordinates, STONE_SIZE, currentPlayer]);

  return (
    <Profiler id='GoBoard' onRender={profilerRender}>
      <View style={styles.container}>
        <Svg
          width={availableWidth}
          height={availableHeight}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => setHoveredIntersection(null)}
        >
          {/* Board background */}
          <Rect
            x={0}
            y={0}
            width={availableWidth}
            height={availableHeight}
            fill='#DCB35C'
          />

          {/* Render board elements in order */}
          {renderGrid()}
          {renderStarPoints()}
          {renderCoordinates()}
          {renderStones()}
          {renderMarks()}
          {renderHint()}
          {renderHoverEffect()}
        </Svg>
      </View>
    </Profiler>
  );
};

/**
 * Get star point positions for a given board size
 * @param {number} boardSize - The size of the board (9, 13, or 19)
 * @returns {Array<[number, number]>} Array of star point coordinates
 */
function getStarPoints(boardSize: number): Array<[number, number]> {
  switch (boardSize) {
    case 19:
      return [
        [3, 3],
        [9, 3],
        [15, 3],
        [3, 9],
        [9, 9],
        [15, 9],
        [3, 15],
        [9, 15],
        [15, 15]
      ];
    case 13:
      return [
        [3, 3],
        [9, 3],
        [6, 6],
        [3, 9],
        [9, 9]
      ];
    case 9:
      return [
        [2, 2],
        [6, 2],
        [4, 4],
        [2, 6],
        [6, 6]
      ];
    default:
      return [];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
