'use client';

type OrganizerType = 'schedule' | 'poll';

function organizerTokenKey(id: string, type: OrganizerType): string {
  return `organizer_token_${type}_${id}`;
}

/**
 * 作成時にサーバーから受け取った主催者トークンを保存する
 */
export function saveOrganizerToken(id: string, type: OrganizerType, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(organizerTokenKey(id, type), token);
  } catch (e) {
    console.error('Failed to save organizer token to localStorage', e);
  }
}

/**
 * 主催者操作時に Server Action へ渡すトークンを取得する
 */
export function getOrganizerToken(id: string, type: OrganizerType): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(organizerTokenKey(id, type));
  } catch (e) {
    console.error('Failed to get organizer token from localStorage', e);
    return null;
  }
}

/**
 * 指定したIDの作成者（主催者）かどうかを判定する
 */
export function checkIsOrganizer(id: string, type: OrganizerType = 'schedule'): boolean {
  return !!getOrganizerToken(id, type);
}
