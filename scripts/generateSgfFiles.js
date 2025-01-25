const fs = require('fs');
const path = require('path');

// Path to problems folder
const PROBLEMS_DIR = '@/assets/problems';
// Output file path
const OUTPUT_FILE = '@/assets/problems/index.ts';

// Default problem object
const defaultProblem = {
  boardSize: 19,
  range: 'FULL',
  color: 1,
  image: '@/assets/images/placeholder.png'
};

function generateProblemFiles() {
  // Create result object
  const problemFiles = {};

  // Resolve the actual problems directory path
  const actualProblemsDir = path.resolve(__dirname, '..', 'assets', 'problems');

  // Get all category directories
  const categories = fs
    .readdirSync(actualProblemsDir)
    .filter((file) =>
      fs.statSync(path.join(actualProblemsDir, file)).isDirectory()
    );

  // Process each category
  categories.forEach((category) => {
    const categoryPath = path.join(actualProblemsDir, category);

    // Get all problem directories in the category
    const problemDirs = fs
      .readdirSync(categoryPath)
      .filter((dir) => fs.statSync(path.join(categoryPath, dir)).isDirectory());

    // Create problems array
    const problems = problemDirs
      .map((problemDir, index) => {
        const problemPath = path.join(categoryPath, problemDir);
        const sgfFiles = fs
          .readdirSync(problemPath)
          .filter(
            (file) => file.endsWith('.sgf') && !file.endsWith('_annotated.sgf')
          );

        const imageFile = fs
          .readdirSync(problemPath)
          .find((file) => file.endsWith('.jpg'));

        if (sgfFiles.length === 0) return; // Skip if no SGF file found
        const sgfFile = sgfFiles[0];
        const name = sgfFile.replace('.sgf', '');

        const relativePath = path
          .join(PROBLEMS_DIR, category, problemDir)
          .replace(/\\/g, '/');

        const actualImagePath =
          imageFile &&
          path.join(__dirname, '..', relativePath.replace('@/', ''), imageFile);

        // Check for corresponding image
        const imageExists = fs.existsSync(actualImagePath);

        const relativeSgfPath = path
          .join(relativePath, `${name}_annotated.sgf`)
          .replace(/\\/g, '/');

        const relativeImagePath = imageExists
          ? path.join(relativePath, imageFile).replace(/\\/g, '/')
          : defaultProblem.image;

        return `{ 
        id: ${index},
        uri: require('${relativeSgfPath}'),
        name: '${name}',
        boardSize: ${defaultProblem.boardSize},
        range: ${defaultProblem.range},
        color: ${defaultProblem.color},
        image: require('${relativeImagePath}')
      }`;
      })
      .filter(Boolean); // Remove any null entries

    // Add category to result object
    problemFiles[category] = `{
    problems: [${problems.join(', ')}]
  }`;
  });

  // Generate output file content
  const fileContent = `import { SGFFiles } from '@/types/sgf';
 import {
  FULL,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
} from '@/constants/boardRanges';

export const SGF_FILES: SGFFiles = {
  ${Object.entries(problemFiles)
    .map(([category, content]) => `${category}: ${content}`)
    .join(',\n  ')}
};
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE.replace('@/', ''));
  const actualOutputDir = path.resolve(__dirname, '..', outputDir);
  if (!fs.existsSync(actualOutputDir)) {
    fs.mkdirSync(actualOutputDir, { recursive: true });
  }

  // Write output file
  const actualOutputFile = path.resolve(
    __dirname,
    '..',
    OUTPUT_FILE.replace('@/', '')
  );
  fs.writeFileSync(actualOutputFile, fileContent);
  console.log(`Generated ${actualOutputFile}`);
}

generateProblemFiles();
