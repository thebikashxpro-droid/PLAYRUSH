import React, { useEffect, useState } from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BalanceCardProps {
  points: number;
  onWithdraw: () => void;
  onGooglePlayRedeem?: () => void;
  onQuickAddBonus?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  points,
  onWithdraw,
  onGooglePlayRedeem,
}) => {
  const [displayPoints, setDisplayPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (points !== displayPoints) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayPoints(points);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [points, displayPoints]);

  const inrValue = (points / 100).toFixed(2);

  return (
    <section id="playrush-balance-card" className="px-5">
      <div className="relative overflow-hidden rounded-[24px] p-[22px] bg-gradient-to-br from-[#202532] to-[#12151C] border border-white/[0.07] shadow-[0_12px_25px_rgba(0,0,0,0.45)]">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-[13px] font-medium tracking-wide">
            Your Balance
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3 h-3" /> 100 Pts = ₹1
          </span>
        </div>

        <div className="mt-2.5 flex items-end gap-2.5">
          <span className="text-[30px] select-none leading-none pb-0.5">🪙</span>

          <div className="relative inline-flex items-baseline">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={points}
                initial={{ opacity: 0, scale: 0.85, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.15, y: 4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`text-[32px] font-black tracking-[-0.8px] text-white leading-none ${
                  isAnimating ? 'text-amber-300' : ''
                }`}
              >
                {points.toLocaleString()}
              </motion.span>
            </AnimatePresence>
            <span className="text-white/55 text-[13px] font-normal ml-2 pb-[3px]">
              Points
            </span>
          </div>
        </div>

        <p className="text-white/55 text-[13px] font-medium mt-1">
          ≈ ₹{inrValue}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="btn-balance-googleplay"
            onClick={onGooglePlayRedeem || onWithdraw}
            className="h-[50px] bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all rounded-[15px] flex items-center justify-center gap-1.5 text-black font-extrabold text-[12px] tracking-[0.2px] cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <span className="text-sm leading-none">▶️</span>
            <span>PLAY CODE</span>
          </button>

          <button
            type="button"
            id="btn-balance-withdraw"
            onClick={onWithdraw}
            className="h-[50px] bg-white hover:bg-neutral-100 active:scale-[0.98] transition-all rounded-[15px] flex items-center justify-center gap-2 text-black font-extrabold text-[12px] tracking-[0.5px] cursor-pointer shadow-lg shadow-white/10"
          >
            <Wallet className="w-4 h-4 text-black stroke-[2.2]" />
            <span>WITHDRAW</span>
          </button>
        </div>
      </div>
    </section>
  );
};
