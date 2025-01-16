import React, { Profiler, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { BoardRange, Coordinate } from '@/types/board';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useGame } from '@/contexts/GameContext';
import { useBoardInput } from '@/hooks/useBoardInput';
import { profilerRender } from '@/utils/profilerUtils';

interface GoBoardProps {
  size: number;
  range?: BoardRange;
}

export const GoBoard: React.FC<GoBoardProps> = ({ size, range }) => {
  const { board, currentPlayer, isValidMove } = useGame();
  const { handleMove } = useBoardInput();
  const [hoveredIntersection, setHoveredIntersection] =
    useState<Coordinate | null>(null);

  const {
    spacing,
    actualBoardSize,
    transformCoordinates,
    getNearestIntersection,
    visibleRange
  } = useBoardDimensions(size, range);

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

  const LINE_EXTENSION = 0.5;

  const renderGrid = () => {
    const lines = [];

    // Calculate if we need to extend lines
    const isPartialBoard = endX < size - 1 || endY < size - 1;
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
          y2={y2 + (endY < size - 1 ? extensionY : 0)}
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
          x1={Math.max(0, x1 - (startX > 0 ? extensionX : 0))}
          y1={y1}
          x2={x2 + (endX < size - 1 ? extensionX : 0)}
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
          stones.push(
            <Circle
              key={`${x}-${y}`}
              cx={cx}
              cy={cy}
              r={spacing * 0.47}
              fill={stone === 1 ? 'black' : 'white'}
              stroke='black'
              strokeWidth={stone === -1 ? 1 : 0}
            />
          );
        }
      }
    }

    return stones;
  };

  const renderStarPoints = () => {
    const starPoints = [];
    const starPositions =
      size === 19 ? [3, 9, 15] : size === 13 ? [3, 6, 9] : [3, size - 4];

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
          y2={actualBoardSize}
          stroke={color}
          strokeWidth='2'
          opacity='0.5'
        />
        <Line
          x1={0}
          y1={hy}
          x2={actualBoardSize}
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

  return (
    // <Profiler id='GoBoard' onRender={profilerRender}>
    <View
      style={[
        styles.container,
        { width: actualBoardSize, height: actualBoardSize }
      ]}
    >
      <Svg
        width={actualBoardSize}
        height={actualBoardSize}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderGrid()}
        {renderStarPoints()}
        {renderHighlightLines()}
        {renderStones()}
        {renderGhostStone()}
      </Svg>
    </View>
    // </Profiler>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6BA7A'
  }
});
