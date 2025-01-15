import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
const GameTree = require('@sabaki/immutable-gametree');
const sgf = require('@sabaki/sgf');
import { getId } from '@/utils/getId';
import { loadSgfFromAssets } from '@/utils/sgfLoader';
import { Sign, Vertex } from '@sabaki/go-board';
import { debugLog } from '@/utils/debugLog';

interface GameTreeProviderProps {
  children: React.ReactNode;
  category?: string;
  id?: string | number;
}

const GameTreeContext = createContext<
  ReturnType<typeof useGameTreeState> | undefined
>(undefined);

function useGameTreeState(category?: string, id?: string | number) {
  const [gameTree, setGameTree] = useState<typeof GameTree | null>(null);
  const [currentNode, setCurrentNode] = useState<typeof GameTree.Node | null>(
    null
  );
  const [loadingState, setLoadingState] = useState('idle');

  useEffect(() => {
    debugLog('GameTree', 'Initial mount with category and id:', {
      category,
      id
    });
  }, []);

  // Debug function
  const logGameTreeState = useCallback(() => {
    console.group('GameTree State Debug');
    console.log('GameTree:', gameTree ? 'Initialized' : 'Null');
    console.log(
      'Current Node:',
      currentNode
        ? {
            id: currentNode.id,
            data: currentNode.data,
            children: gameTree?.get(currentNode.id).children.length
          }
        : 'Null'
    );
    console.log('Loading State:', loadingState);
    console.groupEnd();
  }, [gameTree, currentNode, loadingState]);

  useEffect(() => {
    async function loadProblem() {
      try {
        debugLog('GameTree', 'Attempting to load problem', { category, id });
        setLoadingState('loading');
        if (category && id) {
          const sgfContent = await loadSgfFromAssets(
            category as string,
            typeof id === 'string' ? parseInt(id) : id
          );
          debugLog('GameTree', 'SGF content loaded:', sgfContent);
          setLoadingState('loaded');
          load(sgfContent);
        }
      } catch (error) {
        console.error('Error loading problem:', error);
        setLoadingState('error');
      }
    }

    loadProblem();
  }, [category, id]);

  const load = useCallback(
    (sgfString: string) => {
      try {
        const rootNodes = sgf.parse(sgfString);
        debugLog('GameTree', 'Parsed root nodes:', rootNodes);

        const tree = new GameTree({ getId });
        tree.root.data = rootNodes[0].data;

        debugLog('GameTree', 'Created game tree:', tree);
        setGameTree(tree);
        setCurrentNode(tree.root);
        debugLog('GameTree', 'Set current node to root:', tree.root);
        setTimeout(logGameTreeState, 0);
      } catch (error) {
        console.error('Error parsing SGF:', error);
      }
    },
    [logGameTreeState]
  );

  const addMove = useCallback(
    (vertex: Vertex, currentPlayer: Sign) => {
      if (!gameTree || !currentNode) {
        debugLog(
          'GameTree',
          'Cannot add move: gameTree or currentNode is null'
        );
        return;
      }

      debugLog('GameTree', 'Adding move:', { vertex, currentNode });

      // Convert vertex to SGF format
      const sgfVertex =
        String.fromCharCode(97 + vertex[0]) +
        String.fromCharCode(97 + vertex[1]);

      let moveData = {};
      if (currentPlayer === 1) {
        moveData = { B: [sgfVertex] };
      } else {
        moveData = { W: [sgfVertex] };
      }

      const newGameTree = gameTree.mutate((draft: typeof GameTree) => {
        const newNode = { id: `move-${Date.now()}`, data: moveData };
        draft.appendNode(currentNode.id, newNode);
      });

      debugLog('GameTree', 'Updated game tree:', newGameTree);
      setGameTree(newGameTree);

      const newChildren = newGameTree.get(currentNode.id).children;
      if (newChildren.length > 0) {
        const newNode = newGameTree.get(newChildren[0]);
        debugLog('GameTree', 'Setting new current node:', newNode);
        setCurrentNode(newNode);
      }
    },
    [gameTree, currentNode]
  );

  const navigate = {
    forward: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate forward');
      if (!currentNode || !gameTree) return;
      const children = gameTree.get(currentNode.id).children;
      debugLog('GameTree', 'Children nodes:', children);
      if (children.length > 0) {
        const nextNode = gameTree.get(children[0]);
        debugLog('GameTree', 'Moving to next node:', nextNode);
        setCurrentNode(nextNode);
      }
    }, [currentNode, gameTree]),

    backward: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate backward');
      if (!currentNode || !gameTree) return;
      const parentId = gameTree.get(currentNode.id).parentId;
      const parent = gameTree.get(parentId);
      debugLog('GameTree', 'Parent node:', parent);
      if (parent) {
        debugLog('GameTree', 'Moving to previous node:', parent);
        setCurrentNode(parent);
      }
    }, [currentNode, gameTree]),

    first: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate to first');
      if (!gameTree) return;
      debugLog('GameTree', 'Moving to root:', gameTree.root);
      setCurrentNode(gameTree.root);
    }, [gameTree]),

    last: useCallback(() => {
      debugLog('GameTree', 'Attempting to navigate to last');
      if (!currentNode || !gameTree) return;
      let node = currentNode;
      while (gameTree.get(node.id).children.length > 0) {
        node = gameTree.get(node.id).children[0];
      }
      debugLog('GameTree', 'Moving to node:', node);
      setCurrentNode(node);
    }, [currentNode, gameTree])
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
    gameTree,
    currentNode,
    load,
    addMove,
    navigate,
    canNavigate
  };
}

export const useGameTree = () => {
  const context = useContext(GameTreeContext);
  if (!context)
    throw new Error('useGameTree must be used within a GameTreeProvider');
  return context;
};

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
