import { saveChapter } from './save-chapter';
import { deleteChapter } from './delete-chapter';

export async function handleSaveChapter(req: Request) {
  const { chapterId, content } = await req.json();
  await saveChapter(chapterId, content);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleDeleteChapter(req: Request, chapterId: string) {
  await deleteChapter(chapterId);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
} 