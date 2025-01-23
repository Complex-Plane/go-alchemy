const fs = require('fs');
const path = require('path');

// Path to SGF assets folder
const SGF_DIR = './assets/sgf';
// Output file path
const OUTPUT_FILE = './assets/sgf/index.ts';

function generateSgfFiles() {
  // Create result object
  const sgfFiles = {};

  // Get all directories in SGF folder
  const directories = fs
    .readdirSync(SGF_DIR)
    .filter((file) => fs.statSync(path.join(SGF_DIR, file)).isDirectory());

  // Process each directory
  directories.forEach((directory) => {
    // Get all SGF files in the directory
    const files = fs
      .readdirSync(path.join(SGF_DIR, directory))
      .filter((file) => file.endsWith('.sgf'));

    // Create problems array with require statements
    const problems = files.map((file, index) => {
      const relativePath =
        './' + path.join(directory, file).replace(/\\/g, '/');
      const name = file.replace('.sgf', '');
      // const imagePath = path
      //   .join('../images', directory, name, '.jpg')
      //   .replace(/\\/g, '/');
      const imagePath = '../images/tesuji_thumbnail.jpg';
      return `{ 
        uri: require('${relativePath}'),
        image: require('${imagePath}'),
        name: '${name}',
        boardSize: 19,
        range: TOP_RIGHT,
        id: ${index}
      }`;
    });

    // Add category to result object
    sgfFiles[directory] = `{
    problems: [${problems.join(', ')}]
  }`;
  });

  // Generate output file content
  const fileContent = `import {
  SGFFiles,
  FULL,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
} from '@/types/sgf';

export const SGF_FILES: SGFFiles = {
  ${Object.entries(sgfFiles)
    .map(([category, content]) => `${category}: ${content}`)
    .join(',\n  ')}
};
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output file
  fs.writeFileSync(OUTPUT_FILE, fileContent);
  console.log(`Generated ${OUTPUT_FILE}`);
}

generateSgfFiles();
