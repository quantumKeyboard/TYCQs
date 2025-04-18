import { unlink, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function deleteChapter(chapterId: string) {
  const chaptersDir = join(process.cwd(), 'public', 'chapters');
  
  // Delete the chapter file
  const filePath = join(chaptersDir, `${chapterId}.json`);
  await unlink(filePath);
  
  // Update the manifest
  const manifestPath = join(chaptersDir, 'manifest.json');
  const manifestContent = await readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestContent);
  
  // Remove the chapter from the manifest
  manifest.chapters = manifest.chapters.filter((c: any) => c.chapterId !== chapterId);
  
  // Save the updated manifest
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
} 