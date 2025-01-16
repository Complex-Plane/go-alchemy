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

// Types that match @sabaki/go-board
type BoardState = Sign[][];
type StoneColor = Sign; // -1 for white, 1 for black, 0 for empty
// Additional type exports for compatibility
export type { Vertex, Sign };
export type { Board };

interface GameContextType {
  board: Board;
  boardState: BoardState;
  currentPlayer: StoneColor;
  boardSize: number;
  placeStone: (vertex: Vertex) => boolean;
  isValidMove: (vertex: Vertex) => boolean;
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
  const [board, setBoard] = useState(() => Board.fromDimensions(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(1); // Black starts

  const {
    gameTree,
    currentNode,
    setCurrentNode,
    startingNode,
    setStartingNode,
    currentComment,
    addMove
  } = useGameTree();

  // Initial setup effect
  useEffect(() => {
    if (gameTree && !isInitialized) {
      debugLog('GameContext', 'Performing initial board setup');
      let newBoard = Board.fromDimensions(boardSize);

      // Add initial setup moves
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

      setBoard(newBoard);
      setIsInitialized(true);
    }
  }, [gameTree, isInitialized]);

  // Board syncing effect
  useEffect(() => {
    if (gameTree && currentNode && isInitialized) {
      debugLog('GameContext', 'Syncing board with currentNode:', currentNode);
      let newBoard = Board.fromDimensions(boardSize);

      // Find the setup node first
      const rootNode = gameTree.root;
      let setupNode = rootNode;
      while (!setupNode.data.AW && !setupNode.data.AB) {
        if (setupNode.children.length > 0) {
          setupNode = setupNode.children[0];
        } else {
          break;
        }
      }

      // Replay setup moves
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

      // Then process moves from setup node to current node
      const moveHistory = [];
      let node = currentNode;
      while (node.id !== setupNode.id && node.parentId) {
        moveHistory.unshift(node);
        node = gameTree.get(node.parentId);
      }

      // Replay moves
      moveHistory.forEach((node) => {
        if (node.data.B) {
          const sgfVertex = node.data.B[0];
          const vertex: Vertex = sgfToVertex(sgfVertex);
          newBoard = newBoard.makeMove(1, vertex);
        } else if (node.data.W) {
          const sgfVertex = node.data.W[0];
          const vertex: Vertex = sgfToVertex(sgfVertex);
          newBoard = newBoard.makeMove(-1, vertex);
        }
      });

      setBoard(newBoard);
    }
  }, [gameTree, currentNode, isInitialized]);

  // Get the current board state in the format @sabaki/go-board uses
  const getBoardState = useCallback((): BoardState => {
    return board.signMap;
  }, [board]);

  // Check if a move is valid
  const isValidMove = useCallback(
    (vertex: Vertex): boolean => {
      return !board.analyzeMove(currentPlayer, vertex).pass;
    },
    [board]
  );

  // Place a stone and handle captures
  const placeStone = useCallback(
    (vertex: Vertex): boolean => {
      // Try to make the move
      const newBoard = board.makeMove(currentPlayer, vertex);

      // If the move was invalid, newBoard will be null
      if (newBoard === null) return false;

      // Update the board and switch players
      addMove(vertex, currentPlayer);
      setBoard(newBoard);
      setCurrentPlayer((prev) => (prev === 1 ? -1 : 1));
      return true;
    },
    [board, currentPlayer]
  );

  // if (isLoading) {
  //   return null; // or a loading indicator
  // }
  // if (!gameTree || !currentNode) {
  //   return null; // or a loading indicator
  // }

  return (
    <GameContext.Provider
      value={{
        board,
        boardState: getBoardState(),
        currentPlayer,
        boardSize,
        placeStone,
        isValidMove
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
