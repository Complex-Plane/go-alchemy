import { GameTreeNode, GameTreeType } from '@/contexts/GameTreeContext';
import { sgfToVertex } from './sgfUtils';
import { Board, Vertex } from '@/contexts/GameContext';

export const applySetupMoves = (board: Board, setupNode: GameTreeNode) => {
  let newBoard = board;
  if (setupNode.data.AB) {
    setupNode.data.AB.forEach((sgfVertex: string) => {
      const vertex: Vertex = sgfToVertex(sgfVertex);
      newBoard = newBoard.makeMove(1, vertex);
    });
  }
  if (setupNode.data.AW) {
    setupNode.data.AW.forEach((sgfVertex: string) => {
      const vertex: Vertex = sgfToVertex(sgfVertex);
      newBoard = newBoard.makeMove(-1, vertex);
    });
  }
  return newBoard;
};

export const findSetupNode = (gameTree: GameTreeType) => {
  let setupNode = gameTree.root;
  while (!setupNode.data.AW && !setupNode.data.AB) {
    if (setupNode.children.length > 0) {
      setupNode = setupNode.children[0];
    } else {
      break;
    }
  }
  return setupNode;
};

export const replayMoves = (
  fromNode: GameTreeNode,
  toNode: GameTreeNode,
  startingBoard: Board
) => {
  let board = startingBoard;
  const moveHistory = [];
  let node = toNode;

  while (node.id !== fromNode.id && node.parentId) {
    moveHistory.unshift(node);
    node = gameTree.get(node.parentId);
  }

  moveHistory.forEach((node) => {
    if (node.data.B) {
      const vertex = sgfToVertex(node.data.B[0]);
      board = board.makeMove(1, vertex);
    } else if (node.data.W) {
      const vertex = sgfToVertex(node.data.W[0]);
      board = board.makeMove(-1, vertex);
    }
  });

  return board;
};
