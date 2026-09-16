import React, { useState } from 'react';
import {
  X,
  Clock,
  Download,
  Share2,
  Gift,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Flame,
} from 'lucide-react';
import { AppTask, PlaytimeMilestone, SocialTask } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TasksHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlaytimeSeconds: number;
  playtimeMilestones: PlaytimeMilestone[];
  onClaimPlaytimeMilestone: (index: number) => void;
  socialTasks: SocialTask[];
  onCompleteSocialTask: (taskId: string) => void;
  appTasks: AppTask[];
  onCompleteAppTask: (taskId: string) => void;
  onRedeemPromoCode: (code: string) => { success: boolean; message: string; points?: number };
  initialTab?: 'playtime' | 'apptasks' | 'social' | 'promocode';
}

export const TasksHubModal: React.FC<TasksHubModalProps> = ({
  isOpen,
  onClose,
  activePlaytimeSeconds,
  playtimeMilestones,
  onClaimPlaytimeMilestone,
  socialTasks,
  onCompleteSocialTask,
  appTasks,
  onCompleteAppTask,
  onRedeemPromoCode,
  initialTab = 'playtime',
}) => {
  const [tab, setTab] = useState<'playtime' | 'apptasks' | 'social' | 'promocode'>(initialTab);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const minutes = Math.floor(activePlaytimeSeconds / 60);
  const seconds = activePlaytimeSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promoCodeInput.trim()) return;

    sounds.playClick();
    const res = onRedeemPromoCode(promoCodeInput.trim());
    setPromoFeedback({ text: res.message, success: res.success });
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  const handleStartAppTask = (task: AppTask) => {
    if (task.status === 'completed' || installingId === task.id) return;
    setInstallingId(task.id);
    sounds.playClick();

    setTimeout(() => {
      setInstallingId(null);
      onCompleteAppTask(task.id);
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 2000);
  };

  const handleSocialClick = (task: SocialTask) => {
    if (task.completed) return;
    sounds.playClick();
    onCompleteSocialTask(task.id);
    sounds.playSuccess();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-task-hub"
        className="w-full max-w-md bg-[#151821] border border-white/10 rounded-[28px] p-6 shadow-2xl relative text-white flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Reward Center <span className="text-base">🎁</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Complete tasks, track play time, follow socials & enter promo codes.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 grid grid-cols-4 gap-1 p-1 bg-[#10131A] rounded-xl border border-white/5">
          {[
            { id: 'playtime', label: 'Play Time', icon: Clock },
            { id: 'apptasks', label: 'App Tasks', icon: Download },
            { id: 'social', label: 'Socials', icon: Share2 },
            { id: 'promocode', label: 'Promo Code', icon: Tag },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id as typeof tab);
                  sounds.playClick();
                }}
                className={`py-2 px-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-4 flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {/* TAB 1: PLAY TIME */}
          {tab === 'playtime' && (
            <div className="space-y-3">
              {/* Active Timer Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#212738] to-[#141824] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                      Active Play Session
                    </span>
                    <h4 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                      {timeFormatted}
                    </h4>
                  </div>
                  <div className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-extrabold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Tracking Active</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/60">
                  Stay active in games and app to unlock coin milestone rewards!
                </p>
              </div>

              {/* Milestones List */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Play Time Milestones
                </h5>

                {playtimeMilestones.map((m, idx) => {
                  const requiredSecs = m.minutesRequired * 60;
                  const canClaim = activePlaytimeSeconds >= requiredSecs && !m.claimed;
                  const progressPct = Math.min(
                    100,
                    Math.round((activePlaytimeSeconds / requiredSecs) * 100)
                  );

                  return (
                    <div
                      key={m.minutesRequired}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        m.claimed
                          ? 'bg-[#151821] border-white/5 opacity-60'
                          : canClaim
                          ? 'bg-[#1E271D] border-emerald-500/40'
                          : 'bg-[#181D2A] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            Play {m.minutesRequired} Minute{m.minutesRequired > 1 ? 's' : ''}
                            <span className="text-[11px] font-black text-amber-400">
                              (+{m.reward} Coins)
                            </span>
                          </h6>
                          <p className="text-[10px] text-white/50 mt-0.5">
                            {m.claimed
                              ? 'Reward Claimed'
                              : `${Math.min(activePlaytimeSeconds, requiredSecs)}s / ${requiredSecs}s`}
                          </p>
                        </div>

                        {m.claimed ? (
                          <div className="px-3 py-1 rounded-xl bg-white/5 text-white/40 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </div>
                        ) : canClaim ? (
                          <button
                            type="button"
                            onClick={() => onClaimPlaytimeMilestone(idx)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black transition-transform active:scale-95 cursor-pointer shadow-md shadow-emerald-400/20"
                          >
                            CLAIM
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-white/40">{progressPct}%</span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {!m.claimed && (
                        <div className="mt-2.5 h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: APP TASKS */}
          {tab === 'apptasks' && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                <Download className="w-4 h-4 shrink-0" />
                <span>Install apps, launch & try to receive instant coins!</span>
              </div>

              {appTasks.map((app) => {
                const isInstalling = installingId === app.id;
                const isCompleted = app.status === 'completed';

                return (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl bg-[#181D2A] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                        {app.icon}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white flex items-center gap-1">
                          {app.name}
                          <span className="text-[9px] text-white/40 px-1.5 py-0.2 rounded bg-white/5">
                            {app.category}
                          </span>
                        </h5>
                        <p className="text-[11px] text-white/50">{app.description}</p>
                        <span className="text-xs font-black text-amber-400">
                          +{app.reward} Coins
                        </span>
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <div className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Done</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isInstalling}
                          onClick={() => handleStartAppTask(app)}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {isInstalling ? (
                            <span>Installing...</span>
                          ) : (
                            <>
                              <span>Install</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA FOLLOW */}
          {tab === 'social' && (
            <div className="space-y-2">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Follow our official channels to earn +30 Coins each!</span>
              </div>

              {socialTasks.map((item) => {
                const badgeColors = {
                  instagram: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
                  telegram: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                  youtube: 'bg-red-500/20 text-red-300 border-red-500/30',
                  facebook: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                };

                const icons = {
                  instagram: '📸',
                  telegram: '💬',
                  youtube: '▶️',
                  facebook: '👥',
                };

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#181D2A] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {icons[item.platform]}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white flex items-center gap-1.5">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-white/40">{item.handle}</p>
                        <span className="text-xs font-extrabold text-amber-400">
                          +{item.reward} Coins
                        </span>
                      </div>
                    </div>

                    <div>
                      {item.completed ? (
                        <div className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Followed</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSocialClick(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                        >
                          <span>Follow</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: PROMO CODE */}
          {tab === 'promocode' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#1A1F2D] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                    Enter Promo Code
                  </h5>
                </div>

                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value.toUpperCase());
                      setPromoFeedback(null);
                    }}
                    placeholder="e.g. PLAYSTORE or RUSH2026"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl cursor-pointer transition-all active:scale-95"
                  >
                    Redeem
                  </button>
                </form>

                {promoFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      promoFeedback.success
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {promoFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Tag className="w-4 h-4 shrink-0" />
                    )}
                    <span>{promoFeedback.text}</span>
                  </div>
                )}
              </div>

              {/* Active Promo Codes list to copy */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-white/60">Available Promo Codes:</p>
                {[
                  { code: 'PLAYSTORE', reward: '+50 Coins', desc: 'Special Play Store Bonus' },
                  { code: 'GOOGLEPLAY', reward: '+100 Coins', desc: 'Google Play Gift Welcome' },
                  { code: 'RUSH2026', reward: '+150 Coins', desc: 'PlayRush 2026 Celebration' },
                  { code: 'FREE20', reward: '+20 Coins', desc: 'Free Starter Coins' },
                ].map((item) => (
                  <div
                    key={item.code}
                    onClick={() => {
                      setPromoCodeInput(item.code);
                      sounds.playClick();
                    }}
                    className="p-2.5 rounded-xl bg-[#181D2A] border border-white/5 hover:border-amber-400/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-mono text-xs font-extrabold text-amber-300">
                        {item.code}
                      </span>
                      <p className="text-[10px] text-white/50">{item.desc}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-400">{item.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
