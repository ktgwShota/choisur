import { notFound } from 'next/navigation';
import { getSchedule } from '@/db/services/schedule';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import Contents from './Contents';
import Header from './Header';

interface ActivePageProps {
  id: string;
}

export default async function ActivePage({ id }: ActivePageProps) {
  const result = await getSchedule(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const schedule = result.data;

  return (
    <PageLayout
      header={<Header schedule={schedule} />}
      contents={<Contents schedule={schedule} />}
    />
  );
}
