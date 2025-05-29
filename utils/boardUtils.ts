import Board from '@sabaki/go-board';
import { BoardCoordinates } from '@/types/board';
import { BoardTransformation } from '@/types/transforms';

/**
 * Transform a vertex based on transformation type
 *
 * @param vertex The coordinates to transform
 * @param transformation The transformation to apply
 * @param boardSize The size of the board for mirroring
 * @returns Transformed coordinates
 */
export function transformVertex(
  vertex: BoardCoordinates,
  transformation: BoardTransformation,
  boardSize: number
): BoardCoordinates {
  let [x, y] = vertex;

  // Apply rotation
  switch (transformation.rotation) {
    case 90:
      [x, y] = [y, boardSize - 1 - x];
      break;
    case 180:
      [x, y] = [boardSize - 1 - x, boardSize - 1 - y];
      break;
    case 270:
      [x, y] = [boardSize - 1 - y, x];
      break;
  }

  // Apply reflection
  switch (transformation.reflection) {
    case 'horizontal':
      y = boardSize - 1 - y;
      break;
    case 'vertical':
      x = boardSize - 1 - x;
      break;
    case 'diagonal':
      [x, y] = [y, x];
      break;
  }

  return [x, y];
}

/**
 * Convert coordinates to string key for Map storage
 */
export function coordToKey(coord: BoardCoordinates): string {
  return `${coord[0]},${coord[1]}`;
}

/**
 * Convert string key to coordinates
 */
export function keyToCoord(key: string): BoardCoordinates {
  const [x, y] = key.split(',').map(Number);
  return [x, y];
}

/**
 * Get star point positions for a board of given size
 */
export function getStarPoints(boardSize: number): BoardCoordinates[] {
  const starPositions =
    boardSize === 19
      ? [3, 9, 15]
      : boardSize === 13
      ? [3, 6, 9]
      : [3, boardSize - 4];

  const points: BoardCoordinates[] = [];

  for (const x of starPositions) {
    for (const y of starPositions) {
      points.push([x, y]);
    }
  }

  return points;
}

/**
 * Converts a @sabaki/go-board Board instance into a Map<string, number>.
 * Keys are in the format "x,y" and values are:
 *  1 for black stones
 * -1 for white stones
 *  0 for empty
 *
 * @param board - The Board instance
 * @returns Map<string, number> representing the board state
 */
export function convertBoardToMap(board: Board): Map<string, number> {
  const boardMap = new Map<string, number>();
  const size = board.width; // or board.height, they're the same for Go

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = board.get([x, y]); // 1 (black), -1 (white), 0 (empty)
      boardMap.set(`${x},${y}`, value || 0);
    }
  }

  return boardMap;
}
