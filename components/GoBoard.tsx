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

export const GoBoard: React.FC = () => {
  const { board, currentPlayer, isValidMove } = useGame();
  const { currentNode, boardSize, range } = useGameTree();
  const { transformation } = useTransform();
  const { handleMove } = useBoardInput();
  const [hoveredIntersection, setHoveredIntersection] =
    useState<Coordinate | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(500);

  const showHint: boolean = useSelector(
    (state: RootState) => state.settings.showHint
  );
  const showCoordinates: boolean = useSelector(
    (state: RootState) => state.settings.showCoordinates
  );

  const {
    spacing,
    actualBoardWidth,
    actualBoardHeight,
    transformCoordinates,
    getNearestIntersection,
    visibleRange
  } = useBoardDimensions({
    boardSize,
    range,
    containerHeight,
    showCoordinates
  });

  const { startX, startY, endX, endY } = visibleRange;

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
    const isPartialBoard = endX < boardSize - 1 || endY < boardSize - 1;
    const extensionX = isPartialBoard ? LINE_EXTENSION * spacing : 0;
    const extensionY = isPartialBoard ? LINE_EXTENSION * spacing : 0;

    // Vertical lines
    for (let x = startX; x <= endX; x++) {
      const [x1, y1] = transformCoordinates(x, startY);
      const [x2, y2] = transformCoordinates(x, endY);
      lines.push(
        <Line
          key={`v${x}`}
          x1={x1}
          y1={Math.max(0, y1 - (startY > 0 ? extensionY : 0))}
          x2={x2}
          y2={y2 + (endY < boardSize - 1 ? extensionY : 0)}
          stroke='black'
          strokeWidth='1'
        />
      );
    }
    // for (let x = startX; x <= endX; x++) {
    //   const [x1, y1] = transformCoordinates(x, startY);
    //   const [x2, y2] = transformCoordinates(x, endY);
    //   lines.push(
    //     <Line
    //       key={`v${x}`}
    //       x1={x1}
    //       y1={y1}
    //       x2={x2}
    //       y2={y2}
    //       stroke='black'
    //       strokeWidth='1'
    //     />
    //   );
    // }

    // Horizontal lines
    for (let y = startY; y <= endY; y++) {
      const [x1, y1] = transformCoordinates(startX, y);
      const [x2, y2] = transformCoordinates(endX, y);
      lines.push(
        <Line
          key={`h${y}`}
          x1={Math.max(0, x1 - (startX > 0 ? extensionX : 0))}
          y1={y1}
          x2={x2 + (endX < boardSize - 1 ? extensionX : 0)}
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

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
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
        if (x >= startX && x <= endX && y >= startY && y <= endY) {
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
          y2={actualBoardHeight}
          stroke={color}
          strokeWidth='2'
          opacity='0.5'
        />
        <Line
          x1={0}
          y1={hy}
          x2={actualBoardWidth}
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

      if (tx >= startX && tx <= endX && ty >= startY && ty <= endY) {
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

    for (let x = startX; x <= endX; x++) {
      const [cx] = transformCoordinates(x, startY);
      const [_, topY] = transformCoordinates(startX, startY);
      const [__, bottomY] = transformCoordinates(startX, endY);
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
    const xRight = actualBoardWidth + spacing * 0.2; // Right of the board

    for (let y = startY; y <= endY; y++) {
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

  const renderCoordinates = () => {
    if (!showCoordinates) return null;

    const coordinates = [];
    const textOffset = spacing / 2;

    // Column labels (top and bottom)
    for (let x = startX; x <= endX; x++) {
      const [topX, topY] = transformCoordinates(x, startY);
      const [bottomX, bottomY] = transformCoordinates(x, endY);
      const label = getColumnLabel(x);

      coordinates.push(
        <SvgText
          key={`top-${x}`}
          x={topX}
          y={Math.max(10, topY - textOffset)}
          textAnchor='middle'
          fontSize={spacing / 2}
          fill='black'
        >
          {label}
        </SvgText>,
        <SvgText
          key={`bottom-${x}`}
          x={bottomX}
          y={bottomY + textOffset}
          textAnchor='middle'
          fontSize={spacing / 2}
          fill='black'
        >
          {label}
        </SvgText>
      );
    }

    // Row labels (left and right)
    for (let y = startY; y <= endY; y++) {
      const [leftX, leftY] = transformCoordinates(startX, y);
      const [rightX, rightY] = transformCoordinates(endX, y);
      const label = (y + 1).toString();

      coordinates.push(
        <SvgText
          key={`left-${y}`}
          x={Math.max(10, leftX - textOffset)}
          y={leftY + spacing / 8}
          textAnchor='middle'
          fontSize={spacing / 2}
          fill='black'
        >
          {label}
        </SvgText>,
        <SvgText
          key={`right-${y}`}
          x={rightX + textOffset}
          y={rightY + spacing / 8}
          textAnchor='middle'
          fontSize={spacing / 2}
          fill='black'
        >
          {label}
        </SvgText>
      );
    }

    return coordinates;
  };

  return (
    // <Profiler id='GoBoard' onRender={profilerRender}>
    <View
      style={[
        styles.container,
        { width: actualBoardWidth, height: actualBoardHeight }
      ]}
      onLayout={(event) => {
        setContainerHeight(event.nativeEvent.layout.height);
      }}
    >
      <Svg
        width={actualBoardWidth}
        height={actualBoardHeight}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <G
          transform={`translate(${showCoordinates ? spacing * 0.75 : 0}, ${
            showCoordinates ? spacing * 0.75 : 0
          })`}
        >
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
