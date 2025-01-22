import { Board } from '@/contexts/GameContext';
import { GameTreeNode } from '@/contexts/GameTreeContext';
import { BoardRange } from '@/types/board';
import { BoardTransformation, Reflection, Rotation } from '@/types/transforms';
import { sgfToVertex } from '@/utils/sgfUtils';
import GoBoard, { Sign, Vertex } from '@sabaki/go-board';

export const invertTransformation = (
  vertex: Vertex,
  boardSize: number,
  transformation: BoardTransformation
): Vertex => {
  let [x, y] = vertex;

  // Inverse rotation first (apply counter-rotation)
  for (let i = 0; i < (360 - transformation.rotation) / 90; i++) {
    [x, y] = [y, boardSize - 1 - x];
  }

  // Then inverse reflection
  switch (transformation.reflection) {
    case 'horizontal':
      x = boardSize - 1 - x;
      break;
    case 'vertical':
      y = boardSize - 1 - y;
      break;
    case 'diagonal':
      [x, y] = [y, x];
      break;
  }

  return [x, y];
};

export const setUpBoard = (
  startingNode: GameTreeNode,
  boardSize: number
): Board => {
  let newBoard = GoBoard.fromDimensions(boardSize);

  if (startingNode.data.AB) {
    startingNode.data.AB.forEach((sgfVertex: string) => {
      const vertex: Vertex = sgfToVertex(sgfVertex);
      newBoard = newBoard.makeMove(1, vertex);
    });
  }

  if (startingNode.data.AW) {
    startingNode.data.AW.forEach((sgfVertex: string) => {
      const vertex: Vertex = sgfToVertex(sgfVertex);
      newBoard = newBoard.makeMove(-1, vertex);
    });
  }

  return newBoard;
};

export const transformVertex = (
  vertex: Vertex,
  transformation: BoardTransformation,
  boardSize: number
): Vertex => {
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
};

// Transform the entire board
export const applyTransformation = (
  board: Board,
  transformation: BoardTransformation,
  boardSize: number
): Board => {
  let newBoard = GoBoard.fromDimensions(boardSize);

  // Iterate through all positions
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const originalVertex: Vertex = [x, y];
      const transformedVertex = transformVertex(
        originalVertex,
        transformation,
        boardSize
      );

      const stone = board.get(originalVertex);
      if (stone && stone !== 0) {
        newBoard = newBoard.makeMove(
          transformation.invertColors ? (-stone as Sign) : (stone as Sign),
          transformedVertex
        );
      }
    }
  }

  return newBoard;
};

// Inverse transformation
export const inverseTransformation = (
  vertex: Vertex,
  transformation: BoardTransformation,
  boardSize: number
): Vertex => {
  // Create inverse transformation
  const inverseTransform: BoardTransformation = {
    rotation: ((360 - transformation.rotation) % 360) as Rotation,
    reflection: transformation.reflection, // Reflections are self-inverse
    invertColors: transformation.invertColors
  };

  return transformVertex(vertex, inverseTransform, boardSize);
};

export const transformRange = (
  range: BoardRange,
  transformation: BoardTransformation,
  boardSize: number
): BoardRange => {
  const { startX, startY, endX, endY } = range;
  let newRange: BoardRange = { ...range };

  // Apply rotation
  switch (transformation.rotation) {
    case 90:
      newRange = {
        startX: startY,
        startY: boardSize - 1 - endX,
        endX: endY,
        endY: boardSize - 1 - startX
      };
      break;
    case 180:
      newRange = {
        startX: boardSize - 1 - endX,
        startY: boardSize - 1 - endY,
        endX: boardSize - 1 - startX,
        endY: boardSize - 1 - startY
      };
      break;
    case 270:
      newRange = {
        startX: boardSize - 1 - endY,
        startY: startX,
        endX: boardSize - 1 - startY,
        endY: endX
      };
      break;
  }

  // Apply reflection
  switch (transformation.reflection) {
    case 'horizontal':
      newRange = {
        ...newRange,
        startY: boardSize - 1 - endY,
        endY: boardSize - 1 - startY
      };
      break;
    case 'vertical':
      newRange = {
        ...newRange,
        startX: boardSize - 1 - endX,
        endX: boardSize - 1 - startX
      };
      break;
    case 'diagonal':
      newRange = {
        startX: newRange.startY,
        startY: newRange.startX,
        endX: newRange.endY,
        endY: newRange.endX
      };
      break;
  }

  return newRange;
};

export const getRandomTransformation = (): BoardTransformation => {
  const reflections: Reflection[] = [
    'none',
    'horizontal',
    'vertical',
    'diagonal'
  ];
  const rotations: Rotation[] = [0, 90, 180, 270];

  return {
    reflection: reflections[
      Math.floor(Math.random() * reflections.length)
    ] as Reflection,
    rotation: rotations[
      Math.floor(Math.random() * rotations.length)
    ] as Rotation,
    invertColors: Math.random() < 0.5
  };
};
