import { BarChart2, Calendar } from 'lucide-react';

export const SEGMENT_LINKS = [
  {
    id: 'schedule',
    label: '日程調整',
    href: '/schedule/create',
    pathPrefix: '/schedule/',
    icon: Calendar,
  },
  {
    id: 'polls',
    label: '多数決',
    href: '/polls/create',
    pathPrefix: '/polls/',
    icon: BarChart2,
  },
] as const;
