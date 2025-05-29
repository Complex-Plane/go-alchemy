import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Svg, { G } from 'react-native-svg';
import { BoardCoordinates } from '@/types/board';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useGame } from '@/contexts/GameContext';
import { useBoardInput } from '@/hooks/useBoardInput';
import { useGameTree } from '@/contexts/GameTreeContext';
import { useTransform } from '@/contexts/TransformContext';

// Import sub-components
import { BoardGrid } from './board/BoardGrid';
import { BoardStarPoints } from './board/BoardStarPoints';
import { BoardHighlightLines } from './board/BoardHighlightLines';
import { BoardStones } from './board/BoardStones';
import { BoardHints } from './board/BoardHints';
import { BoardMarksAndLabels } from './board/BoardMarksAndLabels';
import { BoardGhostStone } from './board/BoardGhostStone';
import { BoardCoordinateLabels } from './board/BoardCoordinateLabels';
import { BoardDebugOverlay } from './board/BoardDebugOverlay';
import { BoardProps } from './board/types';
import { convertBoardToMap } from '@/utils/boardUtils';

// Constants
const DEBUG_RANGES = false; // Set to false by default in production
const STONE_SCALE = 0.94;
const PADDING_MIN = 10;

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
 * @component
 * @param {GoBoardProps} props - Component props
 */
export const GoBoard: React.FC<GoBoardProps> = React.memo(
  ({ availableWidth, availableHeight }) => {
    const { board, currentPlayer, isValidMove } = useGame();
    const { currentNode, boardSize, range } = useGameTree();
    const { transformation } = useTransform();
    const { handleMove } = useBoardInput();
    const [hoveredIntersection, setHoveredIntersection] =
      useState<BoardCoordinates | null>(null);

    // Convert board from Array to Map for faster lookup time
    const boardMap = convertBoardToMap(board);

    // Get display settings from Redux store
    const showHint = useSelector((state: RootState) => state.settings.showHint);
    const showCoordinates = useSelector(
      (state: RootState) => state.settings.showCoordinates
    );

    // Calculate board dimensions and coordinate transformations
    const { delta, renderRange, transformCoordinates, getNearestIntersection } =
      useBoardDimensions({
        range,
        availableWidth,
        availableHeight,
        paddingMin: PADDING_MIN,
        showCoordinates,
        boardSize
      });

    const stoneSize = delta * STONE_SCALE;

    /**
     * Handle touch/mouse hover over board
     * Updates the hovered intersection for visual feedback
     */
    const handleIntersectionHover = useCallback(
      (x: number, y: number) => {
        const intersection = getNearestIntersection([x, y]);
        setHoveredIntersection(intersection);
      },
      [getNearestIntersection]
    );

    const handleTouchStart = useCallback(
      (event: any) => {
        const touch = event.nativeEvent;
        handleIntersectionHover(touch.locationX, touch.locationY);
      },
      [handleIntersectionHover]
    );

    const handleTouchMove = useCallback(
      (event: any) => {
        const touch = event.nativeEvent;
        handleIntersectionHover(touch.locationX, touch.locationY);
      },
      [handleIntersectionHover]
    );

    const handleTouchEnd = useCallback(async () => {
      if (hoveredIntersection) {
        await handleMove(hoveredIntersection);
      }
      setHoveredIntersection(null);
    }, [hoveredIntersection, handleMove]);

    // Common props to pass to subcomponents
    const boardProps: BoardProps = {
      delta,
      renderRange,
      transformCoordinates,
      board: boardMap,
      currentNode,
      boardSize,
      transformation,
      range,
      stoneSize,
      currentPlayer,
      isValidMove,
      hoveredIntersection
    };

    return (
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
            <BoardGrid {...boardProps} />
            <BoardStarPoints {...boardProps} />
            {hoveredIntersection && <BoardHighlightLines {...boardProps} />}
            <BoardStones {...boardProps} />
            {showHint && <BoardHints {...boardProps} />}
            <BoardMarksAndLabels {...boardProps} />
            {hoveredIntersection && <BoardGhostStone {...boardProps} />}
            {showCoordinates && <BoardCoordinateLabels {...boardProps} />}
            {DEBUG_RANGES && <BoardDebugOverlay {...boardProps} />}
          </G>
        </Svg>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6BA7A'
  }
});
