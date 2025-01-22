import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import Board from '@sabaki/go-board';
import { Vertex, Sign } from '@sabaki/go-board';
import { sgfToVertex } from '@/utils/sgfUtils';
import { debugLog } from '@/utils/debugLog';
import { GameTreeNode, useGameTree } from './GameTreeContext';
import {
  applyTransformation,
  getRandomTransformation,
  invertTransformation,
  setUpBoard
} from '@/helper/setupBoard';
import { BoardTransformation } from '@/types/transforms';
import { useTransform } from './TransformContext';

// Types that match @sabaki/go-board
type BoardState = Sign[][];
type StoneColor = Sign; // -1 for white, 1 for black, 0 for empty

export type { Vertex, Sign };
export type { Board };

interface GameContextType {
  board: Board;
  boardState: BoardState;
  currentPlayer: StoneColor;
  boardSize: number;
  placeStone: (vertex: Vertex) => Promise<boolean>;
  isValidMove: (vertex: Vertex) => boolean;
  autoPlayOpponent: boolean;
  setAutoPlayOpponent: (value: boolean) => void;
  autoPlayDelay: number;
  setAutoPlayDelay: (value: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const boardSize = 19;
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(1);
  const [playerColor, setPlayerColor] = useState<Sign>(1);
  const [autoPlayOpponent, setAutoPlayOpponent] = useState(true);
  const [autoPlayDelay, setAutoPlayDelay] = useState(500);

  const { transformation } = useTransform();
  const [initialBoard, setInitialBoard] = useState(() =>
    Board.fromDimensions(boardSize)
  );
  const [board, setBoard] = useState(() => Board.fromDimensions(boardSize));
  const [originalBoard, setOriginalBoard] = useState(() =>
    Board.fromDimensions(boardSize)
  );

  const { gameTree, currentNode, startingNode, addMove, setCurrentNode } =
    useGameTree();

  // Apply color inversion to a stone color
  const applyColorInversion = useCallback(
    (color: Sign): Sign => {
      return transformation.invertColors ? (-color as Sign) : color;
    },
    [transformation.invertColors]
  );

  useEffect(() => {
    setBoard(applyTransformation(originalBoard, transformation, boardSize));
  }, [transformation]);

  // Initial setup effect
  useEffect(() => {
    if (gameTree && !isInitialized) {
      debugLog('GameContext', 'Performing initial board setup', transformation);

      const newBoard = setUpBoard(startingNode, boardSize);
      setInitialBoard(newBoard);
      setOriginalBoard(newBoard);
      setBoard(applyTransformation(newBoard, transformation, boardSize));
      setPlayerColor(applyColorInversion(playerColor));
      setCurrentPlayer(applyColorInversion(currentPlayer));
      setIsInitialized(true);
    }
  }, [gameTree, isInitialized, transformation]);

  // Sync board state with game tree
  useEffect(() => {
    if (gameTree && currentNode && isInitialized) {
      let newBoard = setUpBoard(startingNode, boardSize);

      // Get path from starting node to current node
      const path: GameTreeNode[] = [];
      let node = currentNode;
      while (node.id !== startingNode.id && node.parentId) {
        path.unshift(node);
        node = gameTree.get(node.parentId);
      }

      // Replay moves
      path.forEach((node) => {
        if (node.data.B) {
          const vertex = sgfToVertex(node.data.B[0]);
          newBoard = newBoard.makeMove(1, vertex);
        } else if (node.data.W) {
          const vertex = sgfToVertex(node.data.W[0]);
          newBoard = newBoard.makeMove(-1, vertex);
        }
      });

      setOriginalBoard(newBoard);
      setBoard(applyTransformation(newBoard, transformation, boardSize));
    }
  }, [gameTree, currentNode, isInitialized]);

  // Sync player color with current node
  useEffect(() => {
    if (currentNode) {
      if (currentNode.id === startingNode.id) {
        setCurrentPlayer(applyColorInversion(playerColor));
      } else if (currentNode.data.B) {
        setCurrentPlayer(applyColorInversion(-1));
      } else if (currentNode.data.W) {
        setCurrentPlayer(applyColorInversion(1));
      }
    }
  }, [currentNode, playerColor, transformation]);

  // Get the current board state in the format @sabaki/go-board uses
  const getBoardState = useCallback((): BoardState => {
    return board.signMap;
  }, [board]);

  const togglePlayerColor = useCallback(() => {
    setCurrentPlayer((prev) => (prev * -1) as Sign);
  }, []);

  // Check if a move is valid
  const isValidMove = useCallback(
    (transformedVertex: Vertex): boolean => {
      return !board.analyzeMove(currentPlayer, transformedVertex).pass;
    },
    [board, currentPlayer]
  );

  const placeStone = useCallback(
    async (transformedVertex: Vertex): Promise<boolean> => {
      // Convert the transformed vertex back to original coordinates
      const originalVertex = invertTransformation(
        transformedVertex,
        boardSize,
        transformation
      );

      // Make move on original board first
      const newOriginalBoard = originalBoard.makeMove(
        applyColorInversion(currentPlayer),
        originalVertex
      );

      if (newOriginalBoard === null) return false;

      // Update game tree with original coordinates
      addMove(originalVertex, applyColorInversion(currentPlayer));

      // Update both boards
      setOriginalBoard(newOriginalBoard);
      setBoard(
        applyTransformation(newOriginalBoard, transformation, boardSize)
      );

      // Handle auto-play
      if (autoPlayOpponent) {
        await playOpponentMove();
      }

      setCurrentPlayer((prev) => applyColorInversion(-prev as Sign));
      return true;
    },
    [board, originalBoard, currentPlayer, transformation, boardSize]
  );

  const playOpponentMove = useCallback(async () => {
    if (!currentNode || !gameTree) return;

    const node = gameTree.get(currentNode.id);
    if (!node || node.children.length === 0) return;

    // TODO: select random move from node.children
    const nextNode = gameTree.get(node.children[0].id);
    if (!nextNode) return;

    // Check if the next node is actually an opponent move
    const isOpponentMove =
      (applyColorInversion(playerColor) === 1 && nextNode.data.W) ||
      (applyColorInversion(playerColor) === -1 && nextNode.data.B);

    if (isOpponentMove) {
      await new Promise((resolve) => setTimeout(resolve, autoPlayDelay));
      setCurrentNode(nextNode);
    }
  }, [currentNode, gameTree, playerColor, transformation, autoPlayDelay]);

  return (
    <GameContext.Provider
      value={{
        board,
        boardState: getBoardState(),
        currentPlayer,
        boardSize,
        placeStone,
        isValidMove,
        autoPlayOpponent,
        setAutoPlayOpponent,
        autoPlayDelay,
        setAutoPlayDelay
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
