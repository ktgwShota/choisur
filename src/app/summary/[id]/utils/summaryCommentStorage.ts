export const STORAGE_KEY_AUTHOR = 'choisur_comment_author';

function getMyCommentIdsKey(scheduleId: string) {
  return `summary_my_comment_ids_${scheduleId}`;
}

export function getMyCommentIds(scheduleId: string): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getMyCommentIdsKey(scheduleId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMyCommentId(scheduleId: string, id: number) {
  const ids = getMyCommentIds(scheduleId);
  if (ids.includes(id)) return;
  localStorage.setItem(getMyCommentIdsKey(scheduleId), JSON.stringify([...ids, id]));
}

export function removeMyCommentId(scheduleId: string, id: number) {
  const ids = getMyCommentIds(scheduleId).filter((x) => x !== id);
  localStorage.setItem(getMyCommentIdsKey(scheduleId), JSON.stringify(ids));
}
