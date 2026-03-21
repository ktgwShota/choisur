import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { registerVoterNameAction, submitVoteAction } from '@/app/polls/actions';
import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';
import { useToastStore } from '@/stores/useToastStore';

export interface LocalVoter {
  voterId: string;
  voterName: string;
}

const STORAGE_KEY_PREFIX = 'voterInfo_';

function getStorageKey(pollId: string): string {
  return `${STORAGE_KEY_PREFIX}${pollId}`;
}

function saveVoterToStorage(pollId: string, voter: LocalVoter): void {
  const storageKey = getStorageKey(pollId);
  localStorage.setItem(storageKey, JSON.stringify(voter));
}

function loadVoterFromStorage(pollId: string): LocalVoter | null {
  const storageKey = getStorageKey(pollId);
  const storedInfo = localStorage.getItem(storageKey);
  if (!storedInfo) return null;

  try {
    return JSON.parse(storedInfo) as LocalVoter;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

function _removeVoterFromStorage(pollId: string): void {
  const storageKey = getStorageKey(pollId);
  localStorage.removeItem(storageKey);
}

export function usePollVote(poll: Poll) {
  const pollId = poll.id;
  const [voter, setVoter] = useState<LocalVoter | null>(null);
  const [voting, setVoting] = useState<number | null>(null);
  const router = useRouter();
  const { showToast, showError } = useToastStore();

  useEffect(() => {
    const voterInfo = loadVoterFromStorage(pollId);
    if (!voterInfo) {
      setVoter(null);
      return;
    }

    const allVoters = poll.options.flatMap((option) => option.voters);
    const existingVoter = allVoters.find((v) => v.id === voterInfo.voterId);

    if (existingVoter) {
      const syncedVoter = { voterId: existingVoter.id, voterName: existingVoter.name };
      setVoter(syncedVoter);
      saveVoterToStorage(pollId, syncedVoter);
    } else {
      // 投票を取り消した後など、どの候補の voters にもいない場合でも
      // 名前は保持し、再投票時に名前入力を求めない
      setVoter(voterInfo);
      saveVoterToStorage(pollId, voterInfo);
    }
  }, [pollId, poll]);

  const vote = async (optionId: number, overrideVoter?: LocalVoter) => {
    if (voting) return;

    const currentVoter = overrideVoter || voter;
    if (!currentVoter) return;

    const option = poll.options.find((o) => o.optionId === optionId);
    const isCancelling = option?.voters.some((v) => v.id === currentVoter.voterId) ?? false;
    const isChanging =
      !isCancelling &&
      poll.options.some(
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
    const updatedVoter = { voterId, voterName: name };
    setVoter(updatedVoter);
    saveVoterToStorage(pollId, updatedVoter);

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

  const createVoter = (name: string, userId: string): LocalVoter => {
    const allVoters = poll.options.flatMap((option) => option.voters);
    const existingVoter = allVoters.find((v) => v.id === userId);
    const voterId = existingVoter ? existingVoter.id : userId;
    return { voterId, voterName: name };
  };

  const saveVoter = (voter: LocalVoter): void => {
    setVoter(voter);
    saveVoterToStorage(pollId, voter);
  };

  return {
    voter,
    setVoter: saveVoter,
    updateVoterName,
    createVoter,
    vote,
    voting,
    isVotedByUser,
  };
}
