import { SGFProblem } from '@/types';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SGF_FILES } from '@/constants/sgfFiles';

// First, create a function to get the SGF directory path
const getSgfDirectory = (category: string) => {
  return FileSystem.documentDirectory + `sgf/${category}/`;
};

// Function to ensure the directory exists
async function ensureDirectory(directory: string) {
  const dirInfo = await FileSystem.getInfoAsync(directory);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }
}

// Function to copy assets to local filesystem on first launch
export async function copyAssetsToFs() {
  // You'll need to maintain a list of your categories
  const categories = [
    'joseki',
    'opening',
    'sabaki',
    'shape',
    'tesuji',
    'tsumego'
  ];

  for (const category of categories) {
    const directory = getSgfDirectory(category);
    await ensureDirectory(directory);

    // Copy index file
    // await FileSystem.downloadAsync(
    //   Asset.fromModule(require('../assets/sgf/index.json')).uri,
    //   directory + 'index.json'
    // );
    // console.log(`Copied ${directory} to device local memory`);
  }
}

export async function loadSgfFromAssets(
  category: string,
  filename: number
): Promise<string> {
  try {
    // const filePath = getSgfDirectory(category) + filename;
    // const fileInfo = await FileSystem.getInfoAsync(filePath);

    // if (!fileInfo.exists) {
    //   throw new Error(`SGF file not found: ${filePath}`);
    // }

    // const content = await FileSystem.readAsStringAsync(filePath);
    // return content;
    const uri = SGF_FILES[category].problems[filename].uri;
    if (!uri) {
      throw new Error(`File not found: ${category}/${filename}`);
    }

    console.log(`uri: ${uri}`);

    const asset = Asset.fromModule(uri);
    await asset.downloadAsync();

    if (asset.localUri) {
      const content = await FileSystem.readAsStringAsync(asset.localUri);
      return content;
    }
    throw new Error('Failed to get local URI for asset');
  } catch (error) {
    console.error('Error loading SGF:', error);
    throw error;
  }
}

export async function loadCategoryIndex(
  category: string
): Promise<SGFProblem[]> {
  try {
    // const indexPath = getSgfDirectory(category) + 'index.json';
    // const content = await FileSystem.readAsStringAsync(indexPath);
    // return JSON.parse(content);
    const indexData = SGF_FILES[category].index;
    return indexData as SGFProblem[];
  } catch (error) {
    console.error('Error loading index:', error);
    throw error;
  }
}
