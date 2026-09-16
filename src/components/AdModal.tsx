import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, CheckCircle2, ShieldCheck, Play } from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (coinsEarned: number) => void;
  title?: string;
  subtitle?: string;
  isGameClaimAd?: boolean;
  gameReward?: number;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  title = 'Sponsored Video Ad',
  subtitle = 'Watch full ad to claim your reward',
  isGameClaimAd = false,
  gameReward = 0,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [adFinished, setAdFinished] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Random sponsor ad themes
  const sponsors = [
    {
      brand: 'Google Play Pass',
      tagline: 'Get hundreds of games & apps completely free of ads',
      icon: '▶️',
      color: 'from-emerald-600 to-teal-800',
      cta: 'Install Now',
    },
    {
      brand: 'Rush Arena 3D',
      tagline: 'Multiplayer battle royale with instant cash prizes',
      icon: '🎮',
      color: 'from-purple-600 to-indigo-900',
      cta: 'Play Free',
    },
    {
      brand: 'Crypto Clash',
      tagline: 'Solve puzzles & claim daily gem airdrops',
      icon: '💎',
      color: 'from-blue-600 to-cyan-900',
      cta: 'Try Now',
    },
  ];

  const [sponsor] = useState(() => sponsors[Math.floor(Math.random() * sponsors.length)]);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setAdFinished(false);
      return;
    }

    // Determine coin reward: either specified game reward or random 10 to 20 coins
    const reward = isGameClaimAd && gameReward > 0
      ? gameReward
      : Math.floor(Math.random() * 11) + 10; // 10 to 20
    setCoinsEarned(reward);

    setSecondsLeft(5);
    setAdFinished(false);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdFinished(true);
          sounds.playCoin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isGameClaimAd, gameReward]);

  if (!isOpen) return null;

  const handleClaim = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onRewardClaimed(coinsEarned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-video-ad"
        className="w-full max-w-sm bg-[#11141D] border border-white/10 rounded-[26px] overflow-hidden shadow-2xl relative text-white flex flex-col"
      >
        {/* Top Ad Status Bar */}
        <div className="px-4 py-3 bg-[#171B26] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-black">
              Ad
            </span>
            <span className="text-xs font-semibold text-white/70 truncate max-w-[140px]">
              {sponsor.brand}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {adFinished ? (
              <button
                type="button"
                onClick={handleClaim}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Reward in {secondsLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Video Simulation Screen */}
        <div
          className={`relative h-64 bg-gradient-to-br ${sponsor.color} flex flex-col items-center justify-center p-6 text-center overflow-hidden`}
        >
          {/* Animated background bubbles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-black/20 rounded-full blur-2xl" />

          {/* Ad Center Content */}
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center mx-auto text-3xl shadow-lg">
              {sponsor.icon}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{sponsor.brand}</h3>
              <p className="text-xs text-white/80 mt-1 max-w-[220px] mx-auto line-clamp-2">
                {sponsor.tagline}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold text-white backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Verified Play Store App</span>
            </div>
          </div>

          {/* Progress Bar at bottom of screen */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div
              className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - secondsLeft) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom Reward Callout */}
        <div className="p-4 bg-[#151821] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🪙</span>
              <div>
                <p className="font-extrabold text-white">
                  {isGameClaimAd ? 'Game Victory Bonus' : 'Video Ad Reward'}
                </p>
                <p className="text-[11px] text-white/50">
                  {adFinished
                    ? 'Ad completed! Claim coins below.'
                    : 'Wait for the countdown to finish.'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-amber-400">+{coinsEarned} Coins</span>
            </div>
          </div>

          {/* Claim Button */}
          {adFinished ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full h-12 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20 animate-bounce"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>CLAIM +{coinsEarned} COINS NOW</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full h-12 bg-white/10 text-white/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span>PLEASE WAIT {secondsLeft} SECONDS...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
