import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import Board from '@sabaki/go-board';
import { Vertex, Sign } from '@sabaki/go-board';
import { useGameTree } from '@/hooks/useGameTree';
import { sgfToVertex } from '@/utils/sgfUtils';
import { debugLog } from '@/utils/debugLog';

// Types that match @sabaki/go-board
type BoardState = Sign[][];
type StoneColor = Sign; // -1 for white, 1 for black, 0 for empty

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
  const [board, setBoard] = useState(() => Board.fromDimensions(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(1); // Black starts

  const { gameTree, currentNode, addMove } = useGameTree();

  // Sync board with gameTree
  useEffect(() => {
    if (gameTree && currentNode) {
      debugLog('GameContext', 'Syncing board with currentNode:', currentNode);
      let newBoard = Board.fromDimensions(boardSize);

      // Process move history to rebuild board
      const moveHistory = [];
      let node = currentNode;
      while (node.parentId) {
        moveHistory.unshift(node);
        node = gameTree.get(node.parentId);
      }

      // Add initial setup moves
      if (gameTree.root.data.AB) {
        gameTree.root.data.AB.forEach((sgfVertex: string) => {
          const vertex = [
            sgfVertex.charCodeAt(0) - 97,
            sgfVertex.charCodeAt(1) - 97
          ];
          moveHistory.unshift({ data: { B: [sgfVertex] } });
        });
      }
      if (gameTree.root.data.AW) {
        gameTree.root.data.AW.forEach((sgfVertex: string) => {
          const vertex = [
            sgfVertex.charCodeAt(0) - 97,
            sgfVertex.charCodeAt(1) - 97
          ];
          moveHistory.unshift({ data: { W: [sgfVertex] } });
        });
      }

      // Replay moves
      moveHistory.forEach((node) => {
        if (node.data.B) {
          const sgfVertex = node.data.B[0];
          const vertex: Vertex = [
            sgfVertex.charCodeAt(0) - 97,
            sgfVertex.charCodeAt(1) - 97
          ];
          newBoard = newBoard.makeMove(1, vertex);
        } else if (node.data.W) {
          const sgfVertex = node.data.W[0];
          const vertex: Vertex = [
            sgfVertex.charCodeAt(0) - 97,
            sgfVertex.charCodeAt(1) - 97
          ];
          newBoard = newBoard.makeMove(-1, vertex);
        }
      });

      debugLog('GameContext', 'Updated board state:', newBoard.signMap);
      setBoard(newBoard);
    }
  }, [gameTree, currentNode]);

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
      addMove(vertex);
      setBoard(newBoard);
      setCurrentPlayer((prev) => (prev === 1 ? -1 : 1));
      return true;
    },
    [board, currentPlayer]
  );

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

// Additional type exports for compatibility
export type { Vertex, Sign };
export type { Board };
