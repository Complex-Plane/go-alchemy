import React from 'react';
import { G, Circle, Image as SvgImage } from 'react-native-svg';
import { BoardProps, STONE_IMAGES } from './types';
import { vertexToSgf } from '@/utils/sgfUtils';

/**
 * Renders stones on the board using image assets for realistic appearance
 */
export const BoardStones: React.FC<BoardProps> = React.memo(
  ({
    renderRange,
    board,
    transformCoordinates,
    stoneSize,
    currentNode,
    delta
  }) => {
    if (!board) return null;

    const stones = [];

    for (let y = renderRange.startY; y <= renderRange.endY; y++) {
      for (let x = renderRange.startX; x <= renderRange.endX; x++) {
        const stone = board.get(`${x},${y}`);
        if (stone && stone !== 0) {
          const [cx, cy] = transformCoordinates([x, y]);
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

    return <>{stones}</>;
  }
);
