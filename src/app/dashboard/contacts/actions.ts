'use server';

import { revalidatePath } from 'next/cache';
import { deleteContact, updateContactReadStatus } from '@/db/services/contact';
import type { ActionState } from '@/types';

function parseId(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string') return null;
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

export async function setContactReadStatusAction(formData: FormData): Promise<ActionState> {
  try {
    const id = parseId(formData.get('id'));
    const isReadRaw = formData.get('isRead');
    const isRead = typeof isReadRaw === 'string' ? isReadRaw === 'true' : null;

    if (!id || isRead === null) {
      return { success: false, error: 'Invalid input' };
    }

    const result = await updateContactReadStatus(id, isRead);
    if (!result.success) {
      return { success: false, error: result.error || '更新に失敗しました' };
    }

    revalidatePath('/dashboard/contacts');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error in setContactReadStatusAction:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

export async function deleteContactAction(formData: FormData): Promise<ActionState> {
  try {
    const id = parseId(formData.get('id'));
    if (!id) {
      return { success: false, error: 'Invalid input' };
    }

    const result = await deleteContact(id);
    if (!result.success) {
      return { success: false, error: result.error || '削除に失敗しました' };
    }

    revalidatePath('/dashboard/contacts');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error in deleteContactAction:', error);
    return { success: false, error: '削除に失敗しました' };
  }
}
