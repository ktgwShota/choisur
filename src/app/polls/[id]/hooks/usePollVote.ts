import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { registerVoterNameAction, submitVoteAction } from '@/app/polls/actions';
import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';
import { useToastStore } from '@/stores/useToastStore';

export interface LocalVoter {
  voterId: string;
  voterName: string;
}

export function usePollVote(pollId: string, pollData?: Poll) {
  const [voter, setVoter] = useState<LocalVoter | null>(null);
  const [voting, setVoting] = useState<number | null>(null);
  const router = useRouter();
  const { showToast, showError } = useToastStore();

  useEffect(() => {
    const storageKey = `voterInfo_${pollId}`;
    const storedInfo = localStorage.getItem(storageKey);
    if (storedInfo) {
      try {
        const voterInfo: LocalVoter = JSON.parse(storedInfo);

        if (pollData) {
          const allVoters = pollData.options.flatMap((option) => option.voters);
          const existingVoter = allVoters.find((v) => v.id === voterInfo.voterId);

          if (existingVoter) {
            setVoter({ voterId: existingVoter.id, voterName: existingVoter.name });
            localStorage.setItem(
              storageKey,
              JSON.stringify({ voterId: existingVoter.id, voterName: existingVoter.name })
            );
          } else {
            localStorage.removeItem(storageKey);
            setVoter(null);
          }
        } else {
          setVoter(voterInfo);
        }
      } catch (_e) {
        localStorage.removeItem(storageKey);
        setVoter(null);
      }
    }
  }, [pollId, pollData]);

  const vote = async (optionId: number, overrideVoter?: LocalVoter) => {
    if (voting) return;

    const currentVoter = overrideVoter || voter;
    if (!currentVoter) return;

    const option = pollData?.options.find((o) => o.optionId === optionId);
    const isCancelling = option?.voters.some((v) => v.id === currentVoter.voterId) ?? false;
    const isChanging =
      !isCancelling &&
      pollData?.options.some(
        (o) => o.optionId !== optionId && o.voters.some((v) => v.id === currentVoter.voterId)
      );

    setVoting(optionId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await submitVoteAction({
        pollId,
        optionId,
        voterId: currentVoter.voterId,
        voterName: currentVoter.voterName,
      });

      if (!result.success) {
        throw new Error(
          result.error ||
            (isCancelling
              ? '投票の取り消しに失敗しました'
              : isChanging
                ? '投票先の変更に失敗しました'
                : '投票に失敗しました')
        );
      }

      const toastMessage = isCancelling
        ? '投票を取り消しました'
        : isChanging
          ? '投票先を変更しました'
          : '投票しました';
      showToast(toastMessage, 'success');
      router.refresh();
    } catch (error) {
      console.error('Error voting:', error);
      showError(error instanceof Error ? error.message : '投票に失敗しました');
    } finally {
      setVoting(null);
    }
  };

  const isVotedByUser = (option: Option) => {
    if (!voter) return false;
    return option.voters.some((v) => v.id === voter.voterId);
  };

  const updateVoterName = async (name: string, voterId: string) => {
    setVoter({ voterId, voterName: name });

    const storageKey = `voterInfo_${pollId}`;
    localStorage.setItem(storageKey, JSON.stringify({ voterId, voterName: name }));

    try {
      const result = await registerVoterNameAction({
        pollId,
        voterId,
        voterName: name,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update voter name');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating voter name:', error);
    }
  };

  return {
    voter,
    setVoter,
    updateVoterName,
    vote,
    voting,
    isVotedByUser,
  };
}
