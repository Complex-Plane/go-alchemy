export type Stone = 0 | 1 | -1; // 0 = empty, 1 = black, -1 = white
export type BoardState = Stone[];
export type Coordinate = { x: number; y: number };
export type BoardRange = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
export type ScreenRange = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
export type BoardCoordinates = [number, number];
export type SpatialCoordinates = [number, number];
export type ScreenCoordinates = [number, number];
