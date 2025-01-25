import { BoardRange } from './board';

export type Problem = {
  id: number;
  uri: string;
  name: string;
  boardSize: number;
  range: BoardRange;
  color: number;
  image: string;
};

export type SGFCategory = {
  problems: Problem[];
};

export type SGFFiles = {
  [key: string]: SGFCategory;
};
