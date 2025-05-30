import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo
} from 'react';
const GameTree = require('@sabaki/immutable-gametree');
const sgf = require('@sabaki/sgf');
import { getId } from '@/utils/getId';
import { loadSgfFromAssets } from '@/utils/sgfLoader';
import { Sign, Vertex } from '@sabaki/go-board';
import { debugLog } from '@/utils/debugLog';
import { vertexToSgf } from '@/utils/sgfUtils';
import { useTransform } from './TransformContext';
import { SGF_FILES } from '@/assets/problems';
import { transformRange } from '@/helper/setupBoard';
import { BoardRange } from '@/types/board';

export type GameTreeType = typeof GameTree;
export type GameTreeNode = typeof GameTree.Node;

interface GameTreeProviderProps {
  children: React.ReactNode;
  category: string;
  id: string | number;
}

/**
 * GameTreeContextType - Interface for the game tree context
 *
 * @interface
 * @property {boolean} isLoading - Whether the SGF file is being loaded
 * @property {GameTreeType|null} gameTree - The immutable game tree instance
 * @property {GameTreeNode|null} currentNode - Current position in the tree
 * @property {Function} setCurrentNode - Navigate to a specific node
 * @property {GameTreeNode|null} startingNode - The initial problem position
 * @property {Function} setStartingNode - Set the starting position
 * @property {string|null} currentComment - Comment for the current node
 * @property {Function} addMove - Add a move to the tree
 * @property {Object} navigate - Navigation methods
 * @property {Object} canNavigate - Navigation availability flags
 * @property {number} boardSize - Size of the Go board
 * @property {BoardRange} range - Visible board area for partial boards
 */
type GameTreeContextType = {
  isLoading: boolean;
  gameTree: GameTreeType | null;
  currentNode: GameTreeNode | null;
  setCurrentNode: (node: GameTreeNode) => void;
  startingNode: GameTreeNode | null;
  setStartingNode: (node: GameTreeNode) => void;
  currentComment: string | null;
  addMove: (vertex: Vertex, currentPlayer: Sign) => void;
  navigate: {
    forward: () => void;
    backward: () => void;
    first: () => void;
    last: () => void;
  };
  canNavigate: {
    forward: boolean;
    backward: boolean;
  };
  boardSize: number;
  range: BoardRange;
};

const GameTreeContext = createContext<GameTreeContextType | undefined>(
  undefined
);

/**
 * useGameTree - Hook to access the game tree context
 *
 * Provides access to SGF game tree navigation and manipulation.
 * Must be used within a GameTreeProvider.
 *
 * @returns {GameTreeContextType} The game tree context
 * @throws {Error} If used outside of GameTreeProvider
 */
export const useGameTree = () => {
  const context = useContext(GameTreeContext);
  if (!context)
    throw new Error('useGameTree must be used within a GameTreeProvider');
  return context;
};

function useGameTreeState(category: string, id: string | number) {
  const [gameTree, setGameTree] = useState<typeof GameTree | null>(null);
  const [currentNode, setCurrentNode] = useState<typeof GameTree.Node | null>(
    null
  );
  const [startingNode, setStartingNode] = useState<GameTreeNode | null>(null);
  const [currentComment, setCurrentComment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { transformation, transformComment } = useTransform();

  const idx = typeof id === 'string' ? parseInt(id) : id;
  const { boardSize, range: originalRange } = SGF_FILES[category].problems[idx];

  const transformedRange = useMemo(
    () => transformRange(originalRange, transformation, boardSize),
    [originalRange, transformation, boardSize]
  );

  useEffect(() => {
    debugLog('GameTree', 'Initial mount with category and id:', {
      category,
      id
    });
  }, []);

  useEffect(() => {
    if (currentNode?.data.C) {
      setCurrentComment(transformComment(currentNode.data.C[0]));
    } else {
      setCurrentComment(null);
    }
  }, [currentNode, transformComment]);

  useEffect(() => {
    if (gameTree && !currentNode) {
      debugLog('GameTree', 'Detected null currentNode, attempting recovery');
      // Attempt to recover by setting to root or startingNode
      setCurrentNode(startingNode || gameTree.root);
    }
  }, [gameTree, currentNode, startingNode]);

  useEffect(() => {
    const loadProblem = async () => {
      try {
        // debugLog('GameTree', 'Attempting to load problem', { category, id });
        if (category && id) {
          setIsLoading(true);
          // Load sgf from assets by Category/ProblemId
          const sgfContent = await loadSgfFromAssets(category, idx);
          // debugLog('GameTree', 'SGF content loaded:', sgfContent);

          // Parse sgf to state
          const rootNodes = sgf.parse(sgfContent, { getId });
          // debugLog('GameTree', 'Parsed root nodes:', rootNodes);

          if (rootNodes.length === 0) throw new Error('Error with rootNodes');
          let tree = new GameTree({ getId, root: rootNodes[0] });

          // debugLog('GameTree', 'Created game tree:', tree);
          setGameTree(tree);

          // Set startingNode and currentNode to node with {AW, AB, A, B}
          let setupNode;
          let node = tree.root;
          while (!setupNode) {
            if (
              node.data.hasOwnProperty('AW') ||
              node.data.hasOwnProperty('AB')
            ) {
              setupNode = node;
            } else if (
              node.data.hasOwnProperty('W') ||
              node.data.hasOwnProperty('B')
            ) {
              setupNode = tree.get(node.parentId);
            }
            if (node.children.length > 0) {
              // Search next node
              node = node.children[0];
            } else {
              // Searched entire tree and didn't find any moves
              setupNode = tree.root;
            }
          }

          setCurrentNode(setupNode);
          setStartingNode(setupNode);

          // debugLog('GameTree', 'Set current node to setupNode:', setupNode);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading problem:', error);
        setIsLoading(false);
      }
    };

    loadProblem();
  }, [category, id]);

  // const playOpponentMove = useCallback(async () => {
  //     if (!currentNode || !gameTree) return;

  //     const node = gameTree.get(currentNode.id);
  //     if (!node || node.children.length === 0) return;

  //     const nextNode = gameTree.get(node.children[0].id);
  //     if (!nextNode) return;

  //     // Check if the next node is actually an opponent move
  //     const isOpponentMove =
  //       (playerColor === 1 && nextNode.data.W) ||
  //       (playerColor === -1 && nextNode.data.B);

  //     if (isOpponentMove) {
  //       await new Promise(resolve => setTimeout(resolve, autoPlayDelay));
  //       setCurrentNode(nextNode);
  //     }
  //   }, [currentNode, gameTree, playerColor, autoPlayDelay]);

  /**
   * Add a move to the game tree
   *
   * This method:
   * 1. Checks if the move matches any variation
   * 2. Navigates to the matching variation (correct move)
   * 3. Creates a new branch for incorrect moves
   * 4. Updates the current node
   *
   * @param {Vertex} vertex - The move coordinates
   * @param {Sign} currentPlayer - The player making the move
   */
  const addMove = useCallback(
    (vertex: Vertex, currentPlayer: Sign) => {
      if (!gameTree || !currentNode) {
        debugLog(
          'GameTree',
          'Cannot add move: gameTree or currentNode is null'
        );
        return;
      }

      debugLog('GameTree', 'Adding move:', { vertex, currentPlayer });

      // Convert vertex to SGF format
      const sgfVertex = vertexToSgf(vertex);

      const moveProperty = currentPlayer === 1 ? 'B' : 'W';

      // Check if the move already exists in children
      const existingChild = currentNode.children
        .map((child: GameTreeNode) => gameTree.get(child.id))
        .find(
          (child: GameTreeNode) => child.data[moveProperty]?.[0] === sgfVertex
        );

      if (existingChild) {
        setCurrentNode(existingChild);

        // if (autoPlayOpponent) {
        //   await playOpponentMove();
        // }
        return;
      }

      // If move doesn't exist, create a new node
      try {
        let newNodeId;
        const newGameTree = gameTree.mutate((draft: GameTreeType) => {
          const newNode = { [moveProperty]: [sgfVertex] };
          console.log('newNode: ', newNode);
          const draftNodeId = draft.appendNode(currentNode.id, newNode);
          newNodeId = draftNodeId;
        });

        debugLog('GameTree', 'Updated game tree:', newGameTree);
        setGameTree(newGameTree);

        // Navigate to the new node
        // const newNodeId = newGameTree.get(currentNode.id).children[0];
        const newNode = newGameTree.get(newNodeId);
        debugLog('GameTree', 'Setting new current node:', newNode);
        if (newNode) {
          setCurrentNode(newNode);
        } else {
          console.error('Error creating new node');
        }
      } catch (error) {
        debugLog('GameTree', 'Error updating game tree:', error);
      }
    },
    [gameTree, currentNode]
  );

  const isValidGameState = useCallback(() => {
    if (!gameTree || !currentNode) return false;

    try {
      const node = gameTree.get(currentNode.id);
      return !!node;
    } catch (error) {
      return false;
    }
  }, [gameTree, currentNode]);

  const isStartingNode = useCallback(
    (node: GameTreeNode) => {
      return node.id === startingNode.id;
    },
    [startingNode]
  );

  const navigate = {
    forward: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate forward');
      if (!isValidGameState()) {
        debugLog('GameTree', 'Invalid game state for forward navigation');
        return;
      }

      const node = gameTree.get(currentNode.id);
      if (!node) {
        debugLog('GameTree', 'Current node not found in game tree');
        return;
      }

      if (node.children.length > 0) {
        const nextNode = gameTree.get(node.children[0].id);
        if (nextNode) {
          setCurrentNode(nextNode);
        }
      }
    }, [isValidGameState, currentNode, gameTree]),

    backward: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate backward');
      if (!isValidGameState()) {
        debugLog('GameTree', 'Invalid game state for backward navigation');
        return;
      }
      if (isStartingNode(currentNode)) {
        debugLog('GameTree', 'Currently at startingNode');
        return;
      }

      const node = gameTree.get(currentNode.id);
      if (!node) {
        debugLog('GameTree', 'Current node not found in game tree');
        return;
      }

      const parent = gameTree.get(currentNode?.parentId);
      if (parent) {
        setCurrentNode(parent);
      }
    }, [isValidGameState, currentNode, gameTree, startingNode]),

    first: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate to setup node');
      if (!gameTree || !startingNode) return;

      const node = gameTree.get(startingNode.id);
      if (!node) {
        debugLog('GameTree', 'Starting node not found in game tree');
        return;
      }

      setCurrentNode(startingNode);
    }, [isValidGameState, gameTree, startingNode]),

    last: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate to last');
      if (!currentNode || !gameTree) return;

      let node = gameTree.get(currentNode.id);
      if (!node) {
        debugLog('GameTree', 'Current node not found in game tree');
        return;
      }
      // let node = currentNode;
      while (gameTree.get(node.id).children.length > 0) {
        node = gameTree.get(node.id).children[0];
      }
      debugLog('GameTree', 'Moving to node:', node);
      setCurrentNode(node);
    }, [isValidGameState, currentNode, gameTree])
  };

  const canNavigate = {
    forward: Boolean(
      gameTree &&
        currentNode &&
        gameTree.get(currentNode.id).children.length > 0
    ),
    backward: Boolean(gameTree && currentNode && currentNode !== gameTree.root)
  };

  return {
    isLoading,
    gameTree,
    currentNode,
    setCurrentNode,
    startingNode,
    setStartingNode,
    currentComment,
    addMove,
    navigate,
    canNavigate,
    boardSize,
    range: transformedRange
  };
}

/**
 * GameTreeProvider - Context provider for SGF game tree management
 *
 * This provider handles:
 * - Loading SGF files from the problems directory
 * - Parsing and managing the immutable game tree
 * - Navigation through the game tree (variations)
 * - Move validation against the correct solution
 * - Comment extraction for move feedback
 * - Board range calculation for partial board problems
 *
 * The game tree follows SGF (Smart Game Format) structure:
 * - Each node contains moves, comments, and board markup
 * - Variations represent different move sequences
 * - The first variation is typically the correct solution
 *
 * @component
 * @param {GameTreeProviderProps} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.category - Problem category
 * @param {string|number} props.id - Problem ID
 * @returns {JSX.Element} Provider component
 */
export const GameTreeProvider: React.FC<GameTreeProviderProps> = ({
  children,
  category,
  id
}) => {
  const value = useGameTreeState(category, id);
  return (
    <GameTreeContext.Provider value={value}>
      {children}
    </GameTreeContext.Provider>
  );
};
