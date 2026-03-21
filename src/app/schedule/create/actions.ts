'use server';

import type { DateOption } from '@/db/core/types';
import { createSchedule } from '@/db/services/schedule';
import type { ActionState } from '@/types';

type CreateScheduleInput = {
  title: string;
  dates: DateOption[];
  endDate: string | null;
  endTime: string | null;
};

export async function createScheduleAction(
  input: CreateScheduleInput
): Promise<ActionState<{ id: string; organizerToken: string }>> {
  try {
    if (!input.title) {
      return { success: false, error: 'Title is required' };
    }

    if (!input.dates || input.dates.length === 0) {
      return { success: false, error: 'At least one date is required' };
    }

    let endDateTime: string | null = null;
    if (input.endDate) {
      const endTime = input.endTime || '23:59';
      endDateTime = new Date(`${input.endDate}T${endTime}`).toISOString();
    }

    const result = await createSchedule({
      title: input.title,
      dates: input.dates,
      endDateTime: endDateTime,
      createdBy: 'user',
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error || 'Failed to create schedule' };
    }

    return {
      success: true,
      data: { id: result.data.id, organizerToken: result.data.organizerToken },
    };
  } catch (error) {
    console.error('Error in createScheduleAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
