import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getChapter(chapterId: string) {
  const chapterPath = join(process.cwd(), 'public', 'chapters', `${chapterId}.json`);
  
  try {
    const chapterContent = await readFile(chapterPath, 'utf-8');
    return JSON.parse(chapterContent);
  } catch (error) {
    console.error(`Error reading chapter ${chapterId}:`, error);
    return null;
  }
} 