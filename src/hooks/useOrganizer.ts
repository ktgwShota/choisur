'use client';

import { useEffect, useState } from 'react';
import { checkIsOrganizer } from '@/utils/storage';

type OrganizerType = 'schedule' | 'poll';

interface UseOrganizerProps {
  id: string | null;
  type: OrganizerType;
}

export function useOrganizer({ id, type }: UseOrganizerProps) {
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    if (id) {
      setIsOrganizer(checkIsOrganizer(id, type));
    }
  }, [id, type]);

  const checkOrganizerAccess = (onAuthorized: () => void, onError?: () => void) => {
    if (!id) return;

    const hasOrganizerFlag = checkIsOrganizer(id, type);

    if (hasOrganizerFlag) {
      onAuthorized();
      return;
    }

    onError?.();
  };

  return {
    isOrganizer,
    checkOrganizerAccess,
  };
}
