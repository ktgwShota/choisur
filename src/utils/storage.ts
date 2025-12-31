'use client';

const CREATED_SCHEDULES_KEY = 'my_created_schedules';

const CREATED_POLLS_KEY = 'my_created_polls';

/**
 * 自分が作成したスケジュールの一覧をlocalStorageから取得する
 */
export function getCreatedSchedules(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CREATED_SCHEDULES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get created schedules from localStorage', e);
    return [];
  }
}

/**
 * 新しく作成したスケジュールIDをlocalStorageに保存する
 */
export function addCreatedSchedule(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const createdSchedules = getCreatedSchedules();
    if (!createdSchedules.includes(id)) {
      createdSchedules.push(id);
      localStorage.setItem(CREATED_SCHEDULES_KEY, JSON.stringify(createdSchedules));
    }
  } catch (e) {
    console.error('Failed to save created schedule to localStorage', e);
  }
}

/**
 * 自分が作成した多数決の一覧をlocalStorageから取得する
 */
export function getCreatedPolls(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CREATED_POLLS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get created polls from localStorage', e);
    return [];
  }
}

/**
 * 新しく作成した多数決IDをlocalStorageに保存する
 */
export function addCreatedPoll(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const createdPolls = getCreatedPolls();
    if (!createdPolls.includes(id)) {
      createdPolls.push(id);
      localStorage.setItem(CREATED_POLLS_KEY, JSON.stringify(createdPolls));
    }
  } catch (e) {
    console.error('Failed to save created poll to localStorage', e);
  }
}

/**
 * 指定したIDの作成者（主催者）かどうかを判定する
 */
export function checkIsOrganizer(id: string, type: 'schedule' | 'poll' = 'schedule'): boolean {
  if (type === 'poll') {
    const createdPolls = getCreatedPolls();
    return createdPolls.includes(id);
  }
  const createdSchedules = getCreatedSchedules();
  return createdSchedules.includes(id);
}
