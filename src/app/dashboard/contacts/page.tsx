import { countContacts, getContacts } from '@/db/services/contact';
import { deleteContactAction, setContactReadStatusAction } from './actions';
import ContactTable from './ContactTable';

const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'read' | 'unread';

type SearchParams = {
  q?: string | string[];
  page?: string | string[];
  status?: string | string[];
};

function parseStatus(value: SearchParams['status']): StatusFilter {
  const status = Array.isArray(value) ? value[0] : value;
  if (status === 'read' || status === 'unread') return status;
  return 'all';
}

function parseQuery(value: SearchParams['q']): string {
  const query = Array.isArray(value) ? value[0] : value;
  return query ? query.trim() : '';
}

function parsePage(value: SearchParams['page']): number {
  const page = Array.isArray(value) ? value[0] : value;
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = parseStatus(params?.status);
  const query = parseQuery(params?.q);
  const page = parsePage(params?.page);

  const isRead = status === 'read' ? true : status === 'unread' ? false : undefined;

  const [totalResult, unreadResult] = await Promise.all([
    countContacts({ isRead, query }),
    countContacts({ isRead: false }),
  ]);

  const totalCount = totalResult.success ? totalResult.data || 0 : 0;
  const unreadCount = unreadResult.success ? unreadResult.data || 0 : 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;

  const contactsResult = await getContacts({
    limit: PAGE_SIZE,
    offset,
    isRead,
    query,
  });

  return (
    <ContactTable
      contacts={contactsResult.success ? contactsResult.data || [] : []}
      totalCount={totalCount}
      unreadCount={unreadCount}
      page={safePage}
      status={status}
      query={query}
      error={contactsResult.success ? null : contactsResult.error || '取得に失敗しました'}
      setContactReadStatusAction={setContactReadStatusAction}
      deleteContactAction={deleteContactAction}
    />
  );
}
