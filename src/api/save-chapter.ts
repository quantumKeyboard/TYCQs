import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function saveChapter(chapterId: string, content: any) {
  const chaptersDir = join(process.cwd(), 'public', 'chapters');
  
  // Ensure the chapters directory exists
  await mkdir(chaptersDir, { recursive: true });
  
  // Save the chapter file
  const filePath = join(chaptersDir, `${chapterId}.json`);
  await writeFile(filePath, JSON.stringify(content, null, 2));
  
  // Update the manifest
  const manifestPath = join(chaptersDir, 'manifest.json');
  let manifest = { chapters: [] };
  
  try {
    const manifestContent = await readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    // If manifest doesn't exist, we'll create a new one
  }
  
  // Add or update the chapter in the manifest
  const existingIndex = manifest.chapters.findIndex((c: any) => c.chapterId === chapterId);
  if (existingIndex >= 0) {
    manifest.chapters[existingIndex] = content;
  } else {
    manifest.chapters.push(content);
  }
  
  // Save the updated manifest
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
} 