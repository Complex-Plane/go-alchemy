import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { BoardState, BoardRange, Stone, Coordinate } from '@/types/board';
import * as Haptics from 'expo-haptics';
import { RootState } from '@/store/store';

interface BoardRendererProps {
  boardState: BoardState;
  size: number;
  range?: BoardRange;
  currentPlayer: Stone;
  onPlaceStone?: (x: number, y: number) => void;
}

export const BoardRenderer: React.FC<BoardRendererProps> = ({
  boardState,
  size = 19,
  range,
  currentPlayer = 1,
  onPlaceStone
}) => {
  const [hoveredIntersection, setHoveredIntersection] =
    useState<Coordinate | null>(null);
  const [isValidMove, setIsValidMove] = useState<boolean>(false);
  const [isTouching, setIsTouching] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const hapticsEnabled = useSelector(
    (state: RootState) => state.settings.hapticsEnabled
  );

  // Add padding to accommodate full stones at edges
  const STONE_PADDING = 0.5; // Half a spacing unit for padding
  const LINE_EXTENSION = 0.5; // How far lines extend beyond the last intersection

  // Calculate visible range
  const startX = range?.startX ?? 0;
  const startY = range?.startY ?? 0;
  const endX = range?.endX ?? size - 1;
  const endY = range?.endY ?? size - 1;
  const visibleWidth = endX - startX + 1;
  const visibleHeight = endY - startY + 1;

  // Calculate board size and spacing including padding
  const availableSize = Math.min(screenWidth, screenHeight) - 40;
  const totalVisibleWidth = visibleWidth + 2 * STONE_PADDING;
  const totalVisibleHeight = visibleHeight + 2 * STONE_PADDING;

  const spacingX = availableSize / (totalVisibleWidth - 1);
  const spacingY = availableSize / (totalVisibleHeight - 1);
  const spacing = Math.min(spacingX, spacingY);

  // Calculate the actual board size including padding
  const actualBoardSize =
    spacing * Math.max(totalVisibleWidth, totalVisibleHeight);

  // Transform coordinates from board space to screen space
  const transformCoordinates = (x: number, y: number): [number, number] => {
    return [
      (x - startX + STONE_PADDING) * spacing,
      (y - startY + STONE_PADDING) * spacing
    ];
  };

  // Transform from screen space to board space
  const inverseTransformCoordinates = (
    x: number,
    y: number
  ): [number, number] => {
    return [
      Math.round(x / spacing - STONE_PADDING) + startX,
      Math.round(y / spacing - STONE_PADDING) + startY
    ];
  };

  const getNearestIntersection = (
    touchX: number,
    touchY: number
  ): Coordinate => {
    const [x, y] = inverseTransformCoordinates(touchX, touchY);
    return {
      x: Math.max(startX, Math.min(endX, x)),
      y: Math.max(startY, Math.min(endY, y))
    };
  };

  const isValidIntersection = (x: number, y: number): boolean => {
    return boardState[y * size + x] === 0;
  };

  const handleIntersectionHover = (x: number, y: number) => {
    const intersection = getNearestIntersection(x, y);
    setHoveredIntersection(intersection);
    setIsValidMove(isValidIntersection(intersection.x, intersection.y));
  };

  const handleTouchStart = (event: any) => {
    setIsTouching(true);
    const touch = event.nativeEvent;
    handleIntersectionHover(touch.locationX, touch.locationY);
  };

  const handleTouchMove = (event: any) => {
    const touch = event.nativeEvent;
    handleIntersectionHover(touch.locationX, touch.locationY);
  };

  const handleTouchEnd = async () => {
    if (hoveredIntersection && isValidMove && onPlaceStone) {
      try {
        // Provide haptic feedback
        if (hapticsEnabled)
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Fail silently if haptics aren't available
        console.warn('Haptics not available:', error);
      } finally {
        onPlaceStone(hoveredIntersection.x, hoveredIntersection.y);
      }
    }
    setIsTouching(false);
    setHoveredIntersection(null);
  };

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
        const stone = boardState[y * size + x];
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
              strokeWidth={stone === 2 ? 1 : 0}
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
    const color = isValidMove ? '#00ff00' : '#ff0000';

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
        opacity={isValidMove ? 0.5 : 0}
        stroke={isValidMove ? (currentPlayer === 1 ? 'black' : 'gray') : 'red'}
        strokeWidth={1}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: actualBoardSize,
          height: actualBoardSize
        }
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
