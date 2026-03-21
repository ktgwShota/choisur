'use client';

import { PageLayout } from '@/components/shared/layouts/PageLayout';
import type { ParsedPoll as Poll } from '@/db/core/types';
import Contents from './Contents';
import Header from './Header';

interface ActivePageProps {
  pollData: Poll;
}

export default function ActivePage({ pollData }: ActivePageProps) {
  return <PageLayout header={<Header poll={pollData} />} contents={<Contents poll={pollData} />} />;
}
