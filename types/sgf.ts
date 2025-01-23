import { BoardRange } from './board';

export type Problem = {
  uri: string;
  image: string;
  name: string;
  boardSize: number;
  range: BoardRange;
  id: number;
};

export type SGFCategory = {
  problems: Problem[];
};

export type SGFFiles = {
  [key: string]: SGFCategory;
};

export const FULL: BoardRange = {
  startX: 0,
  startY: 0,
  endX: 18,
  endY: 18
};

export const TOP_RIGHT: BoardRange = {
  startX: 9,
  startY: 0,
  endX: 18,
  endY: 9
};

export const TOP_LEFT: BoardRange = {
  startX: 0,
  startY: 0,
  endX: 9,
  endY: 9
};

export const BOTTOM_LEFT: BoardRange = {
  startX: 0,
  startY: 9,
  endX: 9,
  endY: 18
};

export const BOTTOM_RIGHT: BoardRange = {
  startX: 9,
  startY: 9,
  endX: 18,
  endY: 18
};
