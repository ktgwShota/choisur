import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { getSchedule } from '@/db/services/schedule';
import 'dayjs/locale/ja';
import Contents from './Contents';
import Header from './Header';

interface ResultPageProps {
  id: string;
}

export default async function ResultPage({ id }: ResultPageProps) {
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
