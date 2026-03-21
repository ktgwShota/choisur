import { and, desc, eq, like, or, sql } from 'drizzle-orm';
import { getDrizzle } from '../core/drizzle';
import { contacts } from '../core/schema';
import type { Contact, DBResult } from '../core/types';

export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const result = await db
      .insert(contacts)
      .values({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      .returning()
      .get();

    return {
      success: true,
      data: result as Contact,
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function buildContactConditions(options?: { isRead?: boolean; query?: string }) {
  const conditions = [];
  if (options?.isRead !== undefined) {
    conditions.push(eq(contacts.isRead, options.isRead));
  }

  const query = options?.query?.trim();
  if (query) {
    const pattern = `%${query}%`;
    conditions.push(
      or(
        like(contacts.name, pattern),
        like(contacts.email, pattern),
        like(contacts.subject, pattern),
        like(contacts.message, pattern)
      )
    );
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}

export async function getContacts(options?: {
  limit?: number;
  offset?: number;
  isRead?: boolean;
  query?: string;
}): Promise<DBResult<Contact[]>> {
  try {
    const db = getDrizzle();

    let query = db.select().from(contacts).orderBy(desc(contacts.createdAt)).$dynamic();

    const conditions = buildContactConditions(options);
    if (conditions) {
      query = query.where(conditions);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const result = await query;

    return {
      success: true,
      data: result as Contact[],
    };
  } catch (error) {
    console.error('Error getting contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function countContacts(options?: {
  isRead?: boolean;
  query?: string;
}): Promise<DBResult<number>> {
  try {
    const db = getDrizzle();

    let query = db.select({ count: sql<number>`count(*)` }).from(contacts).$dynamic();

    const conditions = buildContactConditions(options);
    if (conditions) {
      query = query.where(conditions);
    }

    const result = await query.get();

    return {
      success: true,
      data: result?.count ?? 0,
    };
  } catch (error) {
    console.error('Error counting contacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContact(id: number): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const contact = await db.select().from(contacts).where(eq(contacts.id, id)).get();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    return {
      success: true,
      data: contact as Contact,
    };
  } catch (error) {
    console.error('Error getting contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateContactReadStatus(
  id: number,
  isRead: boolean
): Promise<DBResult<Contact>> {
  try {
    const db = getDrizzle();

    const contact = await db
      .update(contacts)
      .set({ isRead })
      .where(eq(contacts.id, id))
      .returning()
      .get();

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found after update',
      };
    }

    return {
      success: true,
      data: contact as Contact,
    };
  } catch (error) {
    console.error('Error updating contact read status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function markAsRead(id: number): Promise<DBResult<Contact>> {
  return updateContactReadStatus(id, true);
}

export async function deleteContact(id: number): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    await db.delete(contacts).where(eq(contacts.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
