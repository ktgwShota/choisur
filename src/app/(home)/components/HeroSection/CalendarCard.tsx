'use client';

import { motion } from 'framer-motion';
import { COLORS } from '../../constants';
import VoteStamp from './VoteStamp';

export default function CalendarCard({
  data,
  isDecided,
  index,
}: {
  data: any;
  isDecided: boolean;
  index: number;
}) {
  const isWinner = data.id === 2;

  return (
    <motion.div
      className="mx-auto w-fit"
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5, // Simple fade transition
      }}
      style={{ height: '100%' }} // flex: 1 1 ... を削除し、親グリッド内での配置に任せる。w-fit はクラスで指定するか、デフォルトの挙動（stretchしない）にする。
    >
      <motion.div
        animate={{
          borderColor: isWinner && isDecided ? COLORS.PRIMARY : COLORS.BORDER,
          boxShadow: isWinner && isDecided ? '0 30px 60px -12px rgba(37, 99, 235, 0.25)' : 'none',
        }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center rounded-[40px] p-5"
        style={{
          background: COLORS.CARD_BG,
          border: '1.5px solid',
          borderColor: COLORS.BORDER,
        }}
      >
        {isWinner && isDecided && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 12 }}
            transition={{
              delay: 0.6,
              type: 'spring',
              stiffness: 400,
              damping: 15,
            }}
            style={{
              position: 'absolute',
              top: -20,
              right: -10,
              zIndex: 30,
            }}
          >
            <div
              className="rounded-lg px-[9.6px] py-[2.4px] font-black text-[8px] text-white"
              style={{
                backgroundColor: COLORS.PRIMARY,
                boxShadow: `0 8px 16px ${COLORS.PRIMARY}30`,
              }}
            >
              DECIDED
            </div>
          </motion.div>
        )}

        {/* Date Header */}
        {/* Date Header */}
        <div className="mt-2 mb-4 flex flex-col items-center space-y-2 text-center">
          <span
            className="block font-extrabold uppercase leading-none"
            style={{
              color: isWinner ? COLORS.PRIMARY : COLORS.TEXT_SUB,
              fontSize: '9px',
              letterSpacing: '0.15em',
            }}
          >
            {data.day}
          </span>
          <div
            className="font-extrabold leading-none"
            style={{
              color: COLORS.TEXT_MAIN,
              fontSize: '28px',
            }}
          >
            {data.date.split('/')[1]}
          </div>
          <div className="font-medium text-[10px]" style={{ color: COLORS.TEXT_SUB }}>
            Dec
          </div>
        </div>

        {/* Voting Status */}
        <div className="grid w-fit grid-cols-3 gap-2">
          {data.votes.map((vote: string, i: number) => (
            <VoteStamp key={i} status={vote} index={i} isWinner={isWinner} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
