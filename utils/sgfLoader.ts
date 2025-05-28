import { SGFProblem } from '@/types';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SGF_FILES } from '@/assets/problems';

/**
 * Load SGF content from the assets directory
 *
 * This function handles loading SGF (Smart Game Format) files that are
 * bundled with the app. It uses Expo's asset system to:
 * 1. Locate the SGF file in the bundle
 * 2. Download it to local storage if needed
 * 3. Read and return the file contents
 *
 * SGF files are organized by category and indexed in SGF_FILES.
 * Each problem has a unique ID within its category.
 *
 * @async
 * @param {string} category - The problem category (e.g., 'beginner', 'intermediate')
 * @param {number} filename - The problem ID/filename within the category
 * @returns {Promise<string>} The raw SGF content as a string
 * @throws {Error} If the file cannot be found or loaded
 *
 * @example
 * const sgfContent = await loadSgfFromAssets('beginner', 1);
 * // Returns: "(;GM[1]FF[4]CA[UTF-8]..."
 */
export async function loadSgfFromAssets(
  category: string,
  filename: number
): Promise<string> {
  try {
    // Get the asset URI from the pre-generated index
    const uri = SGF_FILES[category].problems[filename].uri;
    if (!uri) {
      throw new Error(`File not found: ${category}/${filename}`);
    }

    // Create an asset object and ensure it's downloaded
    const asset = Asset.fromModule(uri);
    await asset.downloadAsync();

    // Read the file contents
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
