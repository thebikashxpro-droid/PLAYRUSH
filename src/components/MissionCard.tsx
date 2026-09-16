import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MissionCardProps {
  completedMissions: number;
  totalMissions?: number;
  reward?: number;
  claimed?: boolean;
  onClaim?: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  completedMissions,
  totalMissions = 3,
  reward = 100,
  claimed = false,
  onClaim,
}) => {
  const progressFraction = Math.min(completedMissions / totalMissions, 1);
  const isFinished = completedMissions >= totalMissions;

  return (
    <div id="playrush-daily-mission" className="px-5">
      <div className="p-[18px] rounded-[20px] bg-[#151821] border border-white/[0.06] shadow-lg shadow-black/20">
        <div className="flex items-center">
          <div className="w-11 h-11 rounded-[13px] bg-white/[0.07] flex items-center justify-center flex-shrink-0">
            {claimed ? (
              <CheckCircle className="w-[22px] h-[22px] text-emerald-400" />
            ) : (
              <Target className="w-[22px] h-[22px] text-amber-400" />
            )}
          </div>

          <div className="ml-[13px] flex-1 min-w-0">
            <h3 className="text-[14px] font-extrabold text-white leading-tight">
              Complete {totalMissions} games
            </h3>
            <p className="text-white/40 text-[11px] font-normal mt-1">
              Daily mission
            </p>
          </div>

          {claimed ? (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Claimed
            </span>
          ) : isFinished ? (
            <button
              type="button"
              id="btn-claim-mission-reward"
              onClick={onClaim}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[12px] rounded-xl active:scale-95 transition-all shadow-md shadow-amber-500/20 animate-pulse cursor-pointer"
            >
              Claim +{reward}
            </button>
          ) : (
            <span className="text-[13px] font-extrabold text-white">
              +{reward}
            </span>
          )}
        </div>

        <div className="mt-[17px] flex items-center gap-3">
          <div className="flex-1 h-[7px] bg-white/[0.07] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all ${
                isFinished ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-white'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressFraction * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <span className="text-white/55 text-[11px] font-bold shrink-0">
            {Math.min(completedMissions, totalMissions)}/{totalMissions}
          </span>
        </div>
      </div>
    </div>
  );
};
