import React, { useState } from 'react';
import { Gamepad2, Sparkles, Trophy, Flame, Play, Disc } from 'lucide-react';
import { GameItem } from '../types';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface GamesViewProps {
  onSelectGame: (game: GameItem) => void;
  onAddBonusPoints: (amount: number, reason: string) => void;
  onOpenScratchCard?: () => void;
  onOpenWatchAd?: () => void;
  onOpenTasksHub?: (tab?: 'playtime' | 'apptasks' | 'social' | 'promocode') => void;
}

const extendedGames: GameItem[] = [
  {
    id: 'game-puzzle',
    title: 'Puzzle Rush',
    subtitle: 'Match memory pairs',
    reward: 50,
    iconName: 'puzzle',
    category: 'Brain',
    difficulty: 'Easy',
    playedCount: 1420,
  },
  {
    id: 'game-arcade',
    title: 'Arcade Blitz',
    subtitle: 'High-speed tap frenzy',
    reward: 75,
    iconName: 'arcade',
    category: 'Action',
    difficulty: 'Medium',
    playedCount: 2890,
  },
  {
    id: 'game-challenge',
    title: 'Daily Challenge',
    subtitle: 'Trivia & quick reflex',
    reward: 100,
    iconName: 'challenge',
    category: 'Daily',
    difficulty: 'Hard',
    playedCount: 940,
  },
];

export const GamesView: React.FC<GamesViewProps> = ({
  onSelectGame,
  onAddBonusPoints,
  onOpenScratchCard,
  onOpenWatchAd,
  onOpenTasksHub,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinTotalCount, setSpinTotalCount] = useState(0);

  const categories = ['All', 'Brain', 'Action', 'Daily'];

  const filteredGames =
    selectedCategory === 'All'
      ? extendedGames
      : extendedGames.filter((g) => g.category === selectedCategory);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    sounds.playClick();

    // Random between 10 and 20 coins as requested
    const winAmount = Math.floor(Math.random() * 11) + 10;

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(winAmount);
      setSpinTotalCount((prev) => prev + 1);
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onAddBonusPoints(winAmount, 'Unlimited Lucky Spin');
    }, 1200);
  };

  return (
    <div id="view-games" className="px-5 pt-3 pb-28 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Games & Earn Arena</h2>
        <p className="text-xs text-white/50 mt-0.5">
          Play mini games, unlimited spins, scratch cards & watch ads for coins.
        </p>
      </div>

      {/* Unlimited Spin Card */}
      <div className="p-4 rounded-[22px] bg-gradient-to-br from-[#271E3A] via-[#1F192E] to-[#151821] border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
              <Disc className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white">Unlimited Lucky Spin</h3>
                <span className="text-[9px] bg-purple-500/30 text-purple-300 font-bold px-1.5 py-0.2 rounded">
                  No Limits
                </span>
              </div>
              <p className="text-[11px] text-purple-200/70 mt-0.5">
                Random 10 to 20 Coins every spin!
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpinWheel}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-500/30"
          >
            {isSpinning ? 'SPINNING...' : 'SPIN AGAIN'}
          </button>
        </div>

        {spinResult !== null && (
          <div className="mt-3 py-2 px-3 bg-purple-900/40 border border-purple-500/40 rounded-xl text-center text-xs font-extrabold text-amber-300 animate-in fade-in flex items-center justify-center gap-2">
            <span>🎉 You won +{spinResult} Coins!</span>
            <span className="text-[10px] text-white/50 font-normal">
              (Spins done: {spinTotalCount} • Spin again anytime!)
            </span>
          </div>
        )}
      </div>

      {/* Fast Earn Actions Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Scratch Card Button */}
        <div
          onClick={onOpenScratchCard}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2A2318] to-[#181D2A] border border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg mb-2 group-hover:scale-105 transition-transform">
            🎟️
          </div>
          <h4 className="text-xs font-black text-white">Scratch Card</h4>
          <p className="text-[11px] text-amber-200/60 mt-0.5">Scratch & win coins</p>
          <span className="text-[10px] font-extrabold text-amber-400 mt-2 block">
            Play Card →
          </span>
        </div>

        {/* Watch Ad Button */}
        <div
          onClick={onOpenWatchAd}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#122421] to-[#181D2A] border border-emerald-500/25 hover:border-emerald-500/50 cursor-pointer transition-all group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg mb-2 group-hover:scale-105 transition-transform">
            🎬
          </div>
          <h4 className="text-xs font-black text-white">Watch Video Ad</h4>
          <p className="text-[11px] text-emerald-200/60 mt-0.5">Random 10 to 20 Coins</p>
          <span className="text-[10px] font-extrabold text-emerald-400 mt-2 block">
            Watch Now →
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-black shadow'
                : 'bg-[#151821] text-white/60 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="space-y-3">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.07] flex items-center justify-center text-xl">
                {game.iconName === 'puzzle' ? '🧩' : game.iconName === 'arcade' ? '🕹️' : '⚡'}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{game.title}</h4>
                <p className="text-[11px] text-white/40 mt-0.5">{game.subtitle}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                  +{game.reward} Points
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectGame(game)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 active:scale-95 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              PLAY
            </button>
          </div>
        ))}
      </div>

      {/* Top Rushers Leaderboard */}
      <div className="p-4 rounded-[20px] bg-[#151821] border border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Daily Leaderboard</h3>
          </div>
          <span className="text-[10px] text-white/40">Resets in 4h 18m</span>
        </div>

        <div className="space-y-2">
          {[
            { rank: 1, name: 'Aarav_Rush', score: '18,400 Pts', prize: '₹150' },
            { rank: 2, name: 'RohanK_99', score: '14,250 Pts', prize: '₹100' },
            { rank: 3, name: 'PriyaGamer', score: '12,900 Pts', prize: '₹50' },
          ].map((user) => (
            <div
              key={user.name}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#1A1F2C] text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 text-center font-black ${
                    user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-slate-300' : 'text-amber-600'
                  }`}
                >
                  #{user.rank}
                </span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50">{user.score}</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                  {user.prize}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
