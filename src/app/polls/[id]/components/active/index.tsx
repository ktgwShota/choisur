'use client';

import { useEffect, useState } from 'react';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import { useTutorialStore } from '@/stores/useTutorialStore';
import { usePollVote } from '../../hooks/usePollVote';
import Contents from './Contents';
import Header from './Header';

const DIALOG_MODE = {
  CAST_VOTE: 'castVote',
  EDIT_VOTER_NAME: 'editVoterName',
} as const;

type DialogState =
  | { mode: typeof DIALOG_MODE.CAST_VOTE; optionId: number }
  | { mode: typeof DIALOG_MODE.EDIT_VOTER_NAME };

interface ActivePageProps {
  pollData: Poll;
}

export default function ActivePage({ pollData }: ActivePageProps) {
  const { setupTutorial } = useTutorialStore();
  const { voter, setVoter, updateVoterName, vote } = usePollVote(pollData.id, pollData);

  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  useEffect(() => {
    setupTutorial(
      [
        {
          elementId: 'option-title-1',
          title: '候補リスト',
          description: `クリックすると店舗の詳細が表示されます。※外部サイトに遷移します`,
          position: 'bottom',
        },
        {
          elementId: 'poll-settings-button',
          title: 'メニュー',
          description: `投票者名の変更や投票受付の早期終了など、各種設定ができます。※一部機能は権限が必要です`,
          position: 'bottom',
        },
      ],
      'tutorial-poll-settings-button'
    );
  }, [setupTutorial]);

  const handleVoteClick = (optionId: number) => {
    if (!voter) {
      setDialogState({ mode: DIALOG_MODE.CAST_VOTE, optionId });
      return;
    }
    vote(optionId);
  };

  const handleVoterNameSubmit = async (name: string, newUserId: string, optionId?: number) => {
    // 既存の投票者情報をチェック（IDベースでチェック）
    const allVoters = pollData.options.flatMap((option) => option.voters);
    const existingVoter = allVoters.find((v) => v.id === newUserId);

    // 既存の投票者IDが見つかった場合、そのIDを使用（名前の重複はOK）
    const voterId = existingVoter ? existingVoter.id : newUserId;
    const newVoter = { voterId, voterName: name };

    // localStorageに保存
    const storageKey = `voterInfo_${pollData.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newVoter));

    setVoter(newVoter);

    if (optionId !== undefined) {
      await vote(optionId, newVoter);
    }

    setDialogState(null);
  };

  const handleVoterNameChangeSubmit = async (name: string, _newUserId: string) => {
    // 投票後の名前変更の場合は、現在の投票者IDを使用する
    if (!voter) {
      console.error('Voter not found');
      return;
    }

    // 既存の投票者IDを使用して名前を更新
    const voterId = voter.voterId;

    await updateVoterName(name, voterId);

    // localStorageも更新
    const storageKey = `voterInfo_${pollData.id}`;
    localStorage.setItem(storageKey, JSON.stringify({ voterId, voterName: name }));

    setDialogState(null);
  };

  const handleDialogSubmit = async (name: string, userId: string, optionId?: number) => {
    if (dialogState?.mode === DIALOG_MODE.CAST_VOTE) {
      return handleVoterNameSubmit(name, userId, optionId);
    }
    return handleVoterNameChangeSubmit(name, userId);
  };

  return (
    <PageLayout
      header={
        <Header
          poll={pollData}
          onChangeVoterName={() => {
            setDialogState({ mode: DIALOG_MODE.EDIT_VOTER_NAME });
          }}
          dialogState={dialogState}
          initialVoterName={
            dialogState?.mode === DIALOG_MODE.EDIT_VOTER_NAME ? voter?.voterName : ''
          }
          onDialogClose={() => setDialogState(null)}
          onDialogSubmit={handleDialogSubmit}
        />
      }
      contents={<Contents poll={pollData} onVoteClick={handleVoteClick} />}
    />
  );
}
