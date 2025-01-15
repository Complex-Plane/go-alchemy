import React, { createContext, useContext, useState, useCallback } from 'react';
import Board from '@sabaki/go-board';
import { Vertex, Sign } from '@sabaki/go-board';
import { useGameTree } from '@/hooks/useGameTree';

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

  const { gameTree, currentNode, load, addMove, navigate, canNavigate } =
    useGameTree();

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
