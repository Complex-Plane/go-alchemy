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
  const [board, setBoard] = useState(() => Board.fromDimensions(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(1);
  const [playerColor, setPlayerColor] = useState<Sign>(1);
  const [autoPlayOpponent, setAutoPlayOpponent] = useState(true);
  const [autoPlayDelay, setAutoPlayDelay] = useState(500);

  const { gameTree, currentNode, startingNode, addMove, setCurrentNode } =
    useGameTree();

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
      debugLog('GameContext', 'Syncing board with currentNode:');
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
          setCurrentPlayer(-1 as Sign);
          const sgfVertex = node.data.B[0];
          const vertex: Vertex = sgfToVertex(sgfVertex);
          newBoard = newBoard.makeMove(1, vertex);
        } else if (node.data.W) {
          setCurrentPlayer(-1 as Sign);
          const sgfVertex = node.data.W[0];
          const vertex: Vertex = sgfToVertex(sgfVertex);
          newBoard = newBoard.makeMove(-1, vertex);
        }
      });

      setBoard(newBoard);
    }
  }, [gameTree, currentNode, isInitialized]);

  // Sync player color with current node
  useEffect(() => {
    if (currentNode) {
      // If resetting to initial node, set color to playerColor
      if (currentNode.id === startingNode.id) {
        setCurrentPlayer(playerColor);
      }
      // If the last move was black (B), next move should be white
      else if (currentNode.data.B) {
        setCurrentPlayer(-1);
      }
      // If the last move was white (W), next move should be black
      else if (currentNode.data.W) {
        setCurrentPlayer(1);
      }
    }
  }, [currentNode]);

  // Get the current board state in the format @sabaki/go-board uses
  const getBoardState = useCallback((): BoardState => {
    return board.signMap;
  }, [board]);

  const togglePlayerColor = useCallback(() => {
    setCurrentPlayer((prev) => (prev * -1) as Sign);
  }, []);

  // Check if a move is valid
  const isValidMove = useCallback(
    (vertex: Vertex): boolean => {
      return !board.analyzeMove(currentPlayer, vertex).pass;
    },
    [board]
  );

  const playOpponentMove = useCallback(async () => {
    if (!currentNode || !gameTree) return;

    const node = gameTree.get(currentNode.id);
    if (!node || node.children.length === 0) return;

    const nextNode = gameTree.get(node.children[0].id);
    if (!nextNode) return;

    // Check if the next node is actually an opponent move
    const isOpponentMove =
      (playerColor === 1 && nextNode.data.W) ||
      (playerColor === -1 && nextNode.data.B);

    if (isOpponentMove) {
      await new Promise((resolve) => setTimeout(resolve, autoPlayDelay));
      setCurrentNode(nextNode);
    }
  }, [currentNode, gameTree, playerColor, autoPlayDelay]);

  // Place a stone and handle captures
  const placeStone = useCallback(
    async (vertex: Vertex): Promise<boolean> => {
      // Try to make the move
      const newBoard = board.makeMove(currentPlayer, vertex);

      // If the move was invalid, newBoard will be null
      if (newBoard === null) return false;

      // Update the board and switch players
      addMove(vertex, currentPlayer);
      if (autoPlayOpponent) {
        console.log('Autoplaying opponent move');
        // TODO: fix
        // await playOpponentMove();
      }
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
