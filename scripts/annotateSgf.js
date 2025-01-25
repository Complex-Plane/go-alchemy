const fs = require('fs');
const path = require('path');
const GameTree = require('@sabaki/immutable-gametree');
const sgf = require('@sabaki/sgf');

let getId = (
  (id) => () =>
    id++
)(0);

const PROBLEMS_DIR = path.resolve(__dirname, '../assets/problems');

// Function to check if a node leads to a correct solution
function leadsToCorrect(tree, node) {
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

    // Add labels to the current node
    if (labels.length > 0) {
      labels.forEach((label) => draft.addToProperty(nodeId, 'LB', label));
    }
  });
}

function processNode(tree, nodeId) {
  tree = addHintLabels(tree, nodeId);
  const node = tree.get(nodeId);
  node.children.forEach((child) => {
    tree = processNode(tree, child.id);
  });
  return tree;
}

async function processAllSGFFiles() {
  // Get all category directories
  const categories = fs
    .readdirSync(PROBLEMS_DIR)
    .filter((file) => fs.statSync(path.join(PROBLEMS_DIR, file)).isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(PROBLEMS_DIR, category);

    // Get all problem directories in the category
    const problemDirs = fs
      .readdirSync(categoryPath)
      .filter((dir) => fs.statSync(path.join(categoryPath, dir)).isDirectory());

    for (const problemDir of problemDirs) {
      const problemPath = path.join(categoryPath, problemDir);

      // Find SGF file
      const sgfFiles = fs
        .readdirSync(problemPath)
        .filter(
          (file) => file.endsWith('.sgf') && !file.endsWith('_annotated.sgf')
        );

      if (sgfFiles.length === 0) {
        console.warn(`No SGF file found in ${problemPath}`);
        continue;
      }

      const sgfFile = sgfFiles[0]; // Assume only one non-annotated SGF per problem
      const sgfPath = path.join(problemPath, sgfFile);

      console.log(`Processing: ${category} - ${problemDir} - ${sgfFile}`);

      try {
        // Read and parse SGF file
        const sgfContent = fs.readFileSync(sgfPath, 'utf8');
        const rootNodes = sgf.parse(sgfContent, { getId });
        let tree = new GameTree({ getId, root: rootNodes[0] });

        // Process the game tree
        tree = processNode(tree, tree.root.id);

        // Convert back to SGF
        const newSgf = sgf.stringify(tree.root);

        // Determine output path
        const baseName = path.basename(sgfFile, '.sgf');
        const outputPath = path.join(problemPath, `${baseName}_annotated.sgf`);

        // Write the annotated SGF
        fs.writeFileSync(outputPath, newSgf);
        console.log(`Saved annotated file: ${outputPath}`);
      } catch (error) {
        console.error(
          `Error processing ${category} - ${problemDir} - ${sgfFile}:`,
          error
        );
      }
    }
  }
}

// Run the process
processAllSGFFiles()
  .then(() => {
    console.log('Finished processing all problems');
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
