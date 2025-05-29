import React from 'react';
import { Image as SvgImage } from 'react-native-svg';
import { BoardProps, STONE_IMAGES } from './types';

/**
 * Renders a semi-transparent "ghost" stone showing where a stone would be placed
 */
export const BoardGhostStone: React.FC<BoardProps> = React.memo(
  ({
    hoveredIntersection,
    isValidMove,
    transformCoordinates,
    stoneSize,
    currentPlayer
  }) => {
    if (!hoveredIntersection || !isValidMove || !currentPlayer) return null;

    const [cx, cy] = transformCoordinates(hoveredIntersection);

    if (!isValidMove(hoveredIntersection)) return null;

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
  }
);
