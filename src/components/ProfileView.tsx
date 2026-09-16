import React, { useState } from 'react';
import { User, Flame, Copy, Check, Volume2, VolumeX, Shield, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProfileViewProps {
  points: number;
  onClaimDailyCheckIn: () => void;
  dailyCheckInClaimed: boolean;
  onResetDemoData: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  points,
  onClaimDailyCheckIn,
  dailyCheckInClaimed,
  onResetDemoData,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('RUSH2026');
    setCopied(true);
    sounds.playCoin();
    onShowToast('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playCoin();
    onShowToast(next ? 'Sound effects enabled' : 'Sound effects muted');
  };

  return (
    <div id="view-profile" className="px-5 pt-3 pb-28 space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Profile & Account</h2>
        <p className="text-xs text-white/50 mt-0.5">
          Manage your gamer profile, daily streaks, and settings.
        </p>
      </div>

      {/* User Card */}
      <div className="p-5 rounded-[24px] bg-[#151821] border border-white/[0.08] shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full rounded-[14px] bg-[#151821] flex items-center justify-center text-amber-400">
              <User className="w-7 h-7" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white">RushGamer_88</h3>
            <p className="text-xs text-amber-400 font-bold mt-0.5">Level 4 • Pro Rusher</p>
            <p className="text-[11px] text-white/40 mt-0.5">Joined Sept 2026</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-white/40 uppercase tracking-wider block">Balance</span>
          <span className="text-sm font-black text-white">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* 7-Day Streak Card */}
      <div className="p-4 rounded-[22px] bg-[#151821] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-extrabold text-white">Daily Streak</h3>
          </div>
          <span className="text-xs font-bold text-orange-400">🔥 5 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isCompleted = idx < 4;
            const isToday = idx === 4;
            return (
              <div
                key={idx}
                className={`py-2 rounded-xl text-xs flex flex-col items-center gap-1 ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isToday
                    ? 'bg-amber-400 text-black font-extrabold shadow-md'
                    : 'bg-[#1A1F2C] text-white/30 border border-white/5'
                }`}
              >
                <span className="text-[10px] font-bold">{day}</span>
                <span className="text-xs">
                  {isCompleted ? '✓' : isToday ? '+25' : '🔒'}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={dailyCheckInClaimed}
          onClick={onClaimDailyCheckIn}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 active:scale-95 text-black font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dailyCheckInClaimed ? 'Today’s Bonus Claimed ✓' : 'CLAIM TODAY’S +25 BONUS'}
        </button>
      </div>

      {/* Referral Card */}
      <div className="p-4 rounded-[22px] bg-gradient-to-br from-[#1C202F] to-[#12151E] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Invite & Earn</h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">+500 Points/friend</span>
        </div>

        <p className="text-xs text-white/60 leading-normal">
          Share your referral code. When a friend plays their first game, you both earn bonus cash!
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white tracking-widest text-center">
            RUSH2026
          </div>
          <button
            type="button"
            onClick={handleCopyReferral}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
      </div>

      {/* Settings Options */}
      <div className="p-2 rounded-[20px] bg-[#151821] border border-white/[0.06] divide-y divide-white/5">
        <button
          type="button"
          onClick={handleToggleSound}
          className="w-full px-3.5 py-3 flex items-center justify-between text-xs text-white hover:bg-white/[0.02] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
            <span className="font-semibold">Game Sound FX</span>
          </div>
          <span className="text-white/50">{soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => onShowToast('Privacy & Fair Play verified')}
          className="w-full px-3.5 py-3 flex items-center justify-between text-xs text-white hover:bg-white/[0.02] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Security & Fair Play Policy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </button>

        <button
          type="button"
          onClick={onResetDemoData}
          className="w-full px-3.5 py-3 flex items-center justify-between text-xs text-red-400 hover:bg-red-500/5 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4" />
            <span className="font-semibold">Reset Demo Balance & Missions</span>
          </div>
          <span className="text-[10px] text-white/30">Restore</span>
        </button>
      </div>

      <div className="text-center text-[11px] text-white/30 space-y-0.5">
        <p>PlayRush Web App v1.4.0</p>
        <p>Play. Earn. Repeat.</p>
      </div>
    </div>
  );
};
