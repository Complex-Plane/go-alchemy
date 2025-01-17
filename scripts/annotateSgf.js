const GameTree = require('@sabaki/immutable-gametree');
const sgf = require('@sabaki/sgf');
import { getId } from '@/utils/getId';
import { loadSgfFromAssets } from '@/utils/sgfLoader';

// Function to load SGF file and create a game tree
export async function loadSgfTree(category, id) {
  console.log('Loading sgf...');
  // Load sgf from assets by Category/ProblemId
  const sgfContent = await loadSgfFromAssets(category, id);

  // Parse sgf to state
  const rootNodes = sgf.parse(sgfContent, { getId });
  return new GameTree({ getId, root: rootNodes[0] });
}

// Function to check if a node leads to a correct solution
export function leadsToCorrect(tree, node) {
  // Check if the current node is a correct leaf
  const comment = node.data.C?.[0] ?? '';
  if (comment.toLowerCase().includes('correct')) {
    return true;
  }

  // Recursively check children
  return node.children.some((child) => {
    const childNode = tree.get(child.id);
    return leadsToCorrect(tree, childNode);
  });
}

// Function to add hint labels to a node
function addHintLabels(tree, nodeId) {
  return tree.mutate((draft) => {
    // console.log('Labeling node ', nodeId);
    const node = draft.get(nodeId);

    // Get all child moves
    const childMoves = node.children
      .map((child) => {
        const childNode = tree.get(child.id);
        const move = childNode.data.B?.[0] || childNode.data.W?.[0];
        return {
          childId: child.id,
          move
        };
      })
      .filter(({ move }) => move != null);

    // Create labels for each child move
    const labels = childMoves.map(({ childId, move }) => {
      const isCorrect = leadsToCorrect(tree, tree.get(childId));
      return `${move}:${isCorrect ? 'o' : 'x'}`;
    });
    // console.log('Labels: ', labels);

    // Add labels to the current node
    if (labels.length > 0) {
      labels.forEach((label) => draft.addToProperty(nodeId, 'LB', label));
    }
    console.log('Node data: ', nodeId, draft.get(nodeId).data);
  });
}

// Function to convert game tree back to SGF
export function treeToSgf(tree) {
  function nodeToSgf(nodeId) {
    const node = tree.get(nodeId);
    let sgfNode = ';';

    // Add properties
    for (const [property, values] of Object.entries(node.data)) {
      values.forEach((value) => {
        sgfNode += `${property}[${value}]`;
      });
    }

    // Add variations
    if (node.children.length > 0) {
      if (node.children.length === 1) {
        sgfNode += nodeToSgf(node.children[0]);
      } else {
        node.children.forEach((childId) => {
          sgfNode += `(${nodeToSgf(childId)})`;
        });
      }
    }

    return sgfNode;
  }

  return `(${nodeToSgf(tree.root.id)})`;
}

export async function processGameTree(tree) {
  console.log('Running processGameTree...');

  // Function to process each node in the tree
  function processNode(nodeId) {
    tree = addHintLabels(tree, nodeId);

    // Recursively process children
    const node = tree.get(nodeId);
    node.children.forEach((child) => {
      processNode(child.id);
    });
  }

  // Start processing from the root
  processNode(tree.root.id);

  console.log('Finished labeling tree...');

  return tree;
}

export async function processGameTreeFromFile(category, id) {
  console.log('Running processGameTree: ', category, id);
  // Load the tree
  let tree = await loadSgfTree(category, id);

  console.log('File loaded');

  // Function to process each node in the tree
  function processNode(nodeId) {
    // console.log('Processing node ', nodeId);
    // Add hint labels to this node
    tree = addHintLabels(tree, nodeId);

    // Recursively process children
    const node = tree.get(nodeId);
    node.children.forEach((child) => {
      processNode(child.id);
    });
  }

  // Start processing from the root
  processNode(tree.root.id);
  // tree = addHintLabels(tree, tree.root.id);

  console.log('Finished labeling tree...');

  // Convert back to SGF
  const newTree = treeToSgf(tree);
  console.log(newTree);
  return newTree;
}
