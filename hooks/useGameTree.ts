import { getId } from '@/utils/getId';
import { parseSGF } from '@/utils/sgfParser';
import { useState, useCallback } from 'react';
const GameTree = require('@sabaki/immutable-gametree');
// const sgf = require('@sabaki/sgf');
// import { parse } from '@sabaki/sgf/src/main';

interface GameTreeHook {
  gameTree: typeof GameTree | null;
  currentNode: typeof GameTree.Node | null;
  load: (sgfString: string) => void;
  addMove: (vertex: [number, number]) => void;
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
}

export function useGameTree(): GameTreeHook {
  const [gameTree, setGameTree] = useState<typeof GameTree | null>(null);
  const [currentNode, setCurrentNode] = useState<typeof GameTree.Node | null>(
    null
  );

  // const load = useCallback((sgfString: string) => {
  //   try {
  //     // Consider moving sgf.parse(sgfString) to sgf-loader which would return rootNodes
  //     const rootNodes = parseSGF(sgfString);
  //     const tree = new GameTree({ getId: () => crypto.randomUUID() });
  //     tree.root.data = rootNodes[0].data;

  //     setGameTree(tree);
  //     setCurrentNode(tree.root);
  //   } catch (error) {
  //     console.error('Error parsing SGF:', error);
  //   }
  // }, []);
  const load = useCallback((sgfString: string) => {
    try {
      const rootNodes = parseSGF(sgfString);
      let tree = new GameTree({ getId });
      tree.root.data = rootNodes[0].data;

      console.log(`Root Nodes: ${JSON.stringify(rootNodes[0])}`);
      console.log(`Tree: ${JSON.stringify(tree)}`);

      // Recursively add children
      function addChildren(parentNode: typeof GameTree.Node, sgfNode: any) {
        if (!sgfNode.children) return;

        for (const childSgfNode of sgfNode.children) {
          // const childNode = tree.appendNode(parentNode, childSgfNode.data);
          let childNode;
          tree = tree.mutate((draft: typeof GameTree) => {
            childNode = draft.appendNode(parentNode, childSgfNode.data);
          });

          addChildren(childNode, childSgfNode);
        }
      }

      addChildren(tree.root, rootNodes[0]);

      console.log(`Tree after appending nodes: ${JSON.stringify(tree)}`);

      setGameTree(tree);
      setCurrentNode(tree.root);
    } catch (error) {
      console.error('Error parsing SGF:', error);
    }
  }, []);

  // const addMove = useCallback(
  //   (vertex: [number, number]) => {
  //     if (!gameTree || !currentNode) return;

  //     const newNode = gameTree.append(currentNode, {
  //       B: vertex // Assuming black's move. Adjust accordingly for white
  //     });

  //     setCurrentNode(newNode);
  //   },
  //   [gameTree, currentNode]
  // );
  const addMove = useCallback(
    (data: any) => {
      const newGameTree = gameTree.mutate((draft: typeof GameTree) => {
        const newNode = { id: `move-${Date.now()}`, ...data };
        draft.appendNode(currentNode.id, newNode);
      });

      console.log(`newGameTree: ${newGameTree}`);

      setGameTree(newGameTree);
      const newChildren = newGameTree.get(currentNode.id).children;
      if (newChildren.length > 0) {
        setCurrentNode(newChildren[0]);
      }
    },
    [gameTree, currentNode]
  );

  const navigate = {
    forward: useCallback(() => {
      if (!currentNode || !gameTree) return;
      const children = gameTree.get(currentNode.id).children;
      if (children.length > 0) {
        setCurrentNode(children[0]);
      }
    }, [currentNode, gameTree]),

    backward: useCallback(() => {
      if (!currentNode || !gameTree) return;
      const parentId = gameTree.get(currentNode.id).parentId;
      const parent = gameTree.get(parentId);
      if (parent) {
        setCurrentNode(parent);
      }
    }, [currentNode, gameTree]),

    first: useCallback(() => {
      if (!gameTree) return;
      setCurrentNode(gameTree.root);
    }, [gameTree]),

    last: useCallback(() => {
      // TODO: probably broken. No getChildren method
      if (!currentNode || !gameTree) return;
      let node = currentNode;
      while (gameTree.get(node.id).children.length > 0) {
        node = gameTree.get(node.id).children[0];
      }
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
