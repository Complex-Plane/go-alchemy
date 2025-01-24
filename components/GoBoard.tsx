import React, { Profiler, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Svg, { Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { BoardRange, Coordinate } from '@/types/board';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useGame } from '@/contexts/GameContext';
import { useBoardInput } from '@/hooks/useBoardInput';
import { profilerRender } from '@/utils/profilerUtils';
import { useGameTree } from '@/contexts/GameTreeContext';
import { vertexToSgf, sgfToVertex } from '@/utils/sgfUtils';
import { transformVertex } from '@/helper/setupBoard';
import { useTransform } from '@/contexts/TransformContext';

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

  const LINE_EXTENSION = 0.5;

  const renderGrid = () => {
    const lines = [];

    // Calculate if we need to extend lines
    const isPartialBoard =
      range.endX < boardSize - 1 || range.endY < boardSize - 1;
    const extensionX = isPartialBoard ? LINE_EXTENSION * spacing : 0;
    const extensionY = isPartialBoard ? LINE_EXTENSION * spacing : 0;

    // Vertical lines
    for (let x = range.startX; x <= range.endX; x++) {
      const [x1, y1] = transformCoordinates(x, range.startY);
      const [x2, y2] = transformCoordinates(x, range.endY);
      lines.push(
        <Line
          key={`v${x}`}
          x1={x1}
          y1={Math.max(0, y1 - (range.startY > 0 ? extensionY : 0))}
          x2={x2}
          y2={y2 + (range.endY < boardSize - 1 ? extensionY : 0)}
          stroke='black'
          strokeWidth='1'
        />
      );
    }

    // Horizontal lines
    for (let y = range.startY; y <= range.endY; y++) {
      const [x1, y1] = transformCoordinates(range.startX, y);
      const [x2, y2] = transformCoordinates(range.endX, y);
      lines.push(
        <Line
          key={`h${y}`}
          x1={Math.max(0, x1 - (range.startX > 0 ? extensionX : 0))}
          y1={y1}
          x2={x2 + (range.endX < boardSize - 1 ? extensionX : 0)}
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
              <Circle
                cx={cx}
                cy={cy}
                r={spacing * 0.47}
                fill={stone === 1 ? 'black' : 'white'}
                stroke='black'
                strokeWidth={stone === -1 ? 1 : 0}
              />
              {isLastPlayedStone && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={spacing * 0.25}
                  stroke={stone === 1 ? 'white' : 'black'}
                  strokeWidth={1.5}
                  fill={stone === 1 ? 'black' : 'white'}
                />
              )}
            </G>
          );
        }
      }
    }

    return stones;
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

  const renderGhostStone = () => {
    if (!hoveredIntersection) return null;

    const { x, y } = hoveredIntersection;
    const [cx, cy] = transformCoordinates(x, y);

    return (
      <Circle
        cx={cx}
        cy={cy}
        r={spacing * 0.47}
        fill={currentPlayer === 1 ? 'black' : 'white'}
        opacity={isValidMove([x, y]) ? 0.5 : 0}
        stroke={
          isValidMove([x, y]) ? (currentPlayer === 1 ? 'black' : 'gray') : 'red'
        }
        strokeWidth={1}
      />
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
