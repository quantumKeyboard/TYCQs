import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getChapters() {
  const manifestPath = join(process.cwd(), 'public', 'chapters', 'manifest.json');
  
  try {
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    return manifest.chapters;
  } catch (error) {
    console.error('Error reading chapters manifest:', error);
    return [];
  }
} 