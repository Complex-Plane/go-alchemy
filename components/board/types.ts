import { BoardCoordinates, BoardRange } from '@/types/board';
import { GameTreeNode } from '@/contexts/GameTreeContext';
import { BoardTransformation } from '@/types/transforms';
import { Board } from '@/contexts/GameContext';

/**
 * Common properties shared by board sub-components
 */
export interface BoardProps {
  delta: number;
  renderRange: BoardRange;
  transformCoordinates: (coordinate: BoardCoordinates) => [number, number];
  board?: Map<string, number>;
  currentNode?: GameTreeNode | null;
  boardSize: number;
  transformation: BoardTransformation;
  range: BoardRange;
  stoneSize: number;
  currentPlayer?: number;
  isValidMove?: (coordinate: BoardCoordinates) => boolean;
  hoveredIntersection?: BoardCoordinates | null;
}

/**
 * Mark type for board annotations (circles, triangles, squares, X marks)
 */
export type Mark = {
  type: 'CR' | 'TR' | 'SQ' | 'MA';
  coordinate: string;
};

// Stone image assets
export const STONE_IMAGES = {
  BLACK: require('@/assets/images/black_stone.png'),
  WHITE: require('@/assets/images/white_stone.png')
} as const;
