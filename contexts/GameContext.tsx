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

/**
 * GameContextType - Interface for the game context
 *
 * @interface
 * @property {Board} board - The current Go board instance
 * @property {BoardState} boardState - 2D array representing stone positions
 * @property {StoneColor} currentPlayer - Current player to move (1 for black, -1 for white)
 * @property {number} boardSize - Size of the board (usually 19)
 * @property {Function} placeStone - Function to place a stone at a vertex
 * @property {Function} isValidMove - Check if a move is valid
 * @property {boolean} autoPlayOpponent - Whether to auto-play opponent moves
 * @property {Function} setAutoPlayOpponent - Toggle auto-play
 * @property {number} autoPlayDelay - Delay for auto-play moves in ms
 * @property {Function} setAutoPlayDelay - Set auto-play delay
 */
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

/**
 * useGame - Hook to access the game context
 *
 * Provides access to the current game state and methods for interacting
 * with the Go board. Must be used within a GameProvider.
 *
 * @returns {GameContextType} The game context
 * @throws {Error} If used outside of GameProvider
 */
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

/**
 * GameProvider - Context provider for Go game state and logic
 *
 * This provider manages:
 * - Go board state and game rules
 * - Move validation and execution
 * - Board transformations (rotation/mirroring)
 * - Synchronization with the game tree
 * - Auto-play functionality for opponent moves
 *
 * The provider integrates with:
 * - GameTreeContext: For SGF tree navigation
 * - TransformContext: For board transformations
 *
 * Board transformations are applied to support:
 * - Pattern recognition from different angles
 * - Color inversion for playing as white
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const boardSize = 19;
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(1);
  const [playerColor, setPlayerColor] = useState<Sign>(1);
  const [autoPlayOpponent, setAutoPlayOpponent] = useState(false);
  const [autoPlayDelay, setAutoPlayDelay] = useState(500);

  // Get transformation settings
  const { transformation } = useTransform();

  // Board state management
  // - initialBoard: Starting position from SGF
  // - originalBoard: Current position without transformations
  // - board: Current position with transformations applied
  const [initialBoard, setInitialBoard] = useState(() =>
    Board.fromDimensions(boardSize)
  );
  const [board, setBoard] = useState(() => Board.fromDimensions(boardSize));
  const [originalBoard, setOriginalBoard] = useState(() =>
    Board.fromDimensions(boardSize)
  );

  // Access game tree navigation
  const { gameTree, currentNode, startingNode, addMove, setCurrentNode } =
    useGameTree();

  // Apply color inversion to a stone color
  const applyColorInversion = useCallback(
    (color: Sign): Sign => {
      return transformation.invertColors ? (-color as Sign) : color;
    },
    [transformation.invertColors]
  );

  // Update board when transformation changes
  useEffect(() => {
    setBoard(applyTransformation(originalBoard, transformation, boardSize));
  }, [transformation]);

  /**
   * Initial board setup from SGF
   * Sets up the starting position when a problem is loaded
   */
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

  /**
   * Update board state when navigating the game tree
   * Synchronizes the board with the current node in the SGF tree
   */
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
    (vertex: Vertex): boolean => {
      return !board.analyzeMove(currentPlayer, vertex).pass;
    },
    [board, currentPlayer]
  );

  /**
   * Place a stone at the specified vertex
   *
   * This method:
   * 1. Transforms the vertex to board coordinates
   * 2. Validates the move
   * 3. Updates the board state
   * 4. Checks for correct/incorrect moves against the SGF tree
   * 5. Triggers auto-play for opponent if enabled
   *
   * @param {Vertex} vertex - The intersection to place a stone
   * @returns {Promise<boolean>} True if move was successful
   */
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
        originalVertex,
        {
          preventSuicide: true,
          preventOverwrite: true,
          preventKo: true
        }
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
      if (autoPlayOpponent && currentNode?.children?.length > 0) {
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
