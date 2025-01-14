const fs = require('fs');
const path = require('path');

// Path to SGF assets folder
const SGF_DIR = './assets/sgf';
// Output file path
const OUTPUT_FILE = './constants/sgfFiles.js';

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
      const relativePath = path
        .join('../assets/sgf', directory, file)
        .replace(/\\/g, '/');
      const name = file.replace('.sgf', '');
      return `{ 
        uri: require('${relativePath}'),
        name: '${name}',
        id: ${index}
      }`;
    });

    // Add category to result object
    sgfFiles[directory] = `{
    problems: [${problems.join(', ')}]
  }`;
  });

  // Generate output file content
  const fileContent = `export const SGF_FILES = {
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

// const fs = require('fs');
// const path = require('path');

// const SGF_DIR = path.join(__dirname, '../assets/sgf');
// const OUTPUT_FILE = path.join(__dirname, '../constants/sgfFiles.js');

// function generateSgfFiles() {
//   // Get all directories in the sgf folder
//   const categories = fs
//     .readdirSync(SGF_DIR)
//     .filter((file) => fs.statSync(path.join(SGF_DIR, file)).isDirectory());

//   // Create the object structure
//   const sgfFiles = {};

//   categories.forEach((category) => {
//     const categoryPath = path.join(SGF_DIR, category);
//     const sgfFiles2 = fs
//       .readdirSync(categoryPath)
//       .filter((file) => file.endsWith('.sgf'))
//       .map((file) => {
//         // Convert the file path to a relative path for require
//         const relativePath = path
//           .relative(__dirname, path.join(categoryPath, file))
//           .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes
//           .replace(/^\.\.\//, ''); // Remove leading ../

//         return `require('../${relativePath}')`;
//       });

//     sgfFiles[category] = {
//       problems: sgfFiles2
//     };
//   });

//   // Generate the file content
//   const fileContent = `// This file is auto-generated. Do not edit manually.
// export const SGF_FILES = ${JSON.stringify(sgfFiles, null, 2).replace(
//     /"require\(([^)]+)\)"/g,
//     'require($1)'
//   )}

// export default SGF_FILES;
// `;

//   // Write the file
//   fs.writeFileSync(OUTPUT_FILE, fileContent);
//   console.log('Successfully generated sgfFiles.js');
// }

// try {
//   generateSgfFiles();
// } catch (error) {
//   console.error('Error generating sgfFiles.js:', error);
//   process.exit(1);
// }
