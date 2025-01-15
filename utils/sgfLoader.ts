import { SGFProblem } from '@/types';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SGF_FILES } from '@/constants/sgfFiles';

export async function loadSgfFromAssets(
  category: string,
  filename: number
): Promise<string> {
  try {
    const uri = SGF_FILES[category].problems[filename].uri;
    if (!uri) {
      throw new Error(`File not found: ${category}/${filename}`);
    }

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
