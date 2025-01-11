import React, { createContext, useContext, useState, useCallback } from 'react';
import { BoardState, Stone } from '@/types/board';

interface GameContextType {
  boardState: BoardState;
  currentPlayer: Stone;
  boardSize: number;
  placeStone: (x: number, y: number) => boolean;
  isValidMove: (x: number, y: number) => boolean;
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
  const [boardState, setBoardState] = useState<BoardState>(
    new Array(boardSize * boardSize).fill(0)
  );
  const [currentPlayer, setCurrentPlayer] = useState<Stone>(1);

  const getIndex = useCallback(
    (x: number, y: number) => y * boardSize + x,
    [boardSize]
  );

  const isValidMove = useCallback(
    (x: number, y: number): boolean => {
      return boardState[getIndex(x, y)] === 0;
    },
    [boardState, getIndex]
  );

  const placeStone = (x: number, y: number): boolean => {
    if (isValidMove(x, y)) {
      setBoardState((prevState) => {
        const newState = [...prevState];
        newState[getIndex(x, y)] = currentPlayer;
        return newState;
      });
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider
      value={{
        boardState,
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
