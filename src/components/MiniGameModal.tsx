import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, RotateCcw, Zap, Flame, Award, Play, CheckCircle2, ShieldCheck, Volume2 } from 'lucide-react';
import { GameItem } from '../types';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface MiniGameModalProps {
  game: GameItem | null;
  onClose: () => void;
  onCompleteGame: (pointsEarned: number, gameTitle: string) => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  game,
  onClose,
  onCompleteGame,
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'quick'>('play');

  // Ad requirement state: After game ends, ad must play before claim
  const [adPlaying, setAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adWatched, setAdWatched] = useState(false);

  // Game 1: Memory Puzzle State
  const initialCards = [
    { id: 1, symbol: '🎮', matched: false },
    { id: 2, symbol: '🎮', matched: false },
    { id: 3, symbol: '💎', matched: false },
    { id: 4, symbol: '💎', matched: false },
    { id: 5, symbol: '⚡', matched: false },
    { id: 6, symbol: '⚡', matched: false },
    { id: 7, symbol: '🏆', matched: false },
    { id: 8, symbol: '🏆', matched: false },
  ];
  const [cards, setCards] = useState(() => [...initialCards].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // Game 2: Arcade Tap Rush State
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadeTimeLeft, setArcadeTimeLeft] = useState(10);
  const [arcadeActive, setArcadeActive] = useState(false);
  const [targetPos, setTargetPos] = useState({ top: 40, left: 40 });

  // Game 3: Challenge Math / Reflex State
  const [challengeStep, setChallengeStep] = useState(0);
  const challengeQuestions = [
    { q: '14 + 19 = ?', options: ['31', '33', '35'], ans: 1 },
    { q: 'Which has the highest value?', options: ['500 Pts', '₹6.00', '400 Pts'], ans: 1 }, // ₹6.00 = 600 Pts!
    { q: '7 × 8 = ?', options: ['54', '56', '58'], ans: 1 },
  ];

  // Game completed state
  const [gameWon, setGameWon] = useState(false);

  // Reset when game changes
  useEffect(() => {
    if (!game) return;
    setGameWon(false);
    setActiveTab('play');
    setAdPlaying(false);
    setAdWatched(false);
    setAdCountdown(5);

    if (game.iconName === 'puzzle') {
      setCards([...initialCards].sort(() => Math.random() - 0.5));
      setFlipped([]);
      setMoves(0);
    } else if (game.iconName === 'arcade') {
      setArcadeScore(0);
      setArcadeTimeLeft(10);
      setArcadeActive(false);
    } else if (game.iconName === 'challenge') {
      setChallengeStep(0);
    }
  }, [game]);

  // Ad countdown timer
  useEffect(() => {
    if (!adPlaying) return;
    if (adCountdown <= 0) {
      setAdPlaying(false);
      setAdWatched(true);
      sounds.playCoin();
      return;
    }
    const timer = setInterval(() => {
      setAdCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [adPlaying, adCountdown]);

  // Arcade timer
  useEffect(() => {
    if (!arcadeActive) return;
    if (arcadeTimeLeft <= 0) {
      setArcadeActive(false);
      handleVictory();
      return;
    }
    const timer = setInterval(() => {
      setArcadeTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [arcadeActive, arcadeTimeLeft]);

  if (!game) return null;

  const handleVictory = () => {
    setGameWon(true);
    // Trigger mandatory sponsor ad after gameplay
    setAdPlaying(true);
    setAdCountdown(5);
    setAdWatched(false);
    sounds.playSuccess();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleStartAdForQuickClaim = () => {
    setAdPlaying(true);
    setAdCountdown(5);
    setAdWatched(false);
    sounds.playClick();
  };

  // Card click for Puzzle
  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || cards[index].matched) return;

    sounds.playClick();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        sounds.playCoin();
        setCards((prev) =>
          prev.map((c, idx) =>
            idx === first || idx === second ? { ...c, matched: true } : c
          )
        );
        setFlipped([]);

        // Check if all matched
        setTimeout(() => {
          const allMatched = cards.every((c, idx) =>
            idx === first || idx === second ? true : c.matched
          );
          if (allMatched) {
            handleVictory();
          }
        }, 300);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // Arcade tap
  const startArcade = () => {
    setArcadeScore(0);
    setArcadeTimeLeft(10);
    setArcadeActive(true);
    moveTarget();
    sounds.playClick();
  };

  const moveTarget = () => {
    const top = Math.floor(15 + Math.random() * 65);
    const left = Math.floor(15 + Math.random() * 65);
    setTargetPos({ top, left });
  };

  const handleTargetClick = () => {
    if (!arcadeActive) return;
    sounds.playCoin();
    setArcadeScore((s) => s + 1);
    moveTarget();
  };

  // Challenge option click
  const handleChallengeAnswer = (optIndex: number) => {
    sounds.playClick();
    if (optIndex === challengeQuestions[challengeStep].ans) {
      sounds.playCoin();
      if (challengeStep + 1 < challengeQuestions.length) {
        setChallengeStep((s) => s + 1);
      } else {
        handleVictory();
      }
    } else {
      sounds.playClick();
      // small shake or warning
    }
  };

  const handleClaimAndClose = () => {
    onCompleteGame(game.reward, game.title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="modal-minigame"
        className="w-full max-w-sm bg-[#151821] border border-white/10 rounded-[24px] p-6 shadow-2xl relative text-white"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[14px] bg-white/[0.08] flex items-center justify-center text-amber-400 font-black">
            {game.iconName === 'puzzle' ? '🧩' : game.iconName === 'arcade' ? '🕹️' : '⚡'}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{game.title}</h3>
            <p className="text-xs text-amber-400 font-semibold">
              Reward: +{game.reward} Points
            </p>
          </div>
        </div>

        {/* Play or Quick Claim Toggle */}
        <div className="mt-4 flex bg-[#1D2230] p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'play'
                ? 'bg-white text-black shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Play Mini Game
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-white text-black shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Instant Claim
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === 'quick' ? (
            <div className="text-center py-5 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-3xl">
                🪙
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Instant Reward</h4>
                <p className="text-white/50 text-xs mt-1">
                  Watch a short sponsor video ad to instantly claim +{game.reward} points.
                </p>
              </div>

              {adPlaying ? (
                <div className="p-4 rounded-2xl bg-[#11141D] border border-amber-400/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-black text-[10px]">
                      SPONSOR AD
                    </span>
                    <span className="text-amber-400 font-bold">Reward in {adCountdown}s</span>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl flex items-center justify-center text-2xl border border-white/5">
                    🎮 Google Play Games
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-1000"
                      style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ) : adWatched ? (
                <button
                  type="button"
                  onClick={handleClaimAndClose}
                  className="w-full h-12 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 animate-bounce"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  CLAIM +{game.reward} POINTS
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartAdForQuickClaim}
                  className="w-full h-12 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/20"
                >
                  <Play className="w-4 h-4 fill-black" />
                  WATCH AD & CLAIM REWARD
                </button>
              )}
            </div>
          ) : gameWon ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Victory! You Won!</h4>
                <p className="text-white/60 text-xs mt-0.5">
                  Watch full sponsored ad below to unlock your +{game.reward} points.
                </p>
              </div>

              {/* Sponsored Ad Unit */}
              {adPlaying ? (
                <div className="p-3.5 rounded-2xl bg-[#11141D] border border-amber-400/40 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-black text-[9px] uppercase">
                      Sponsored Video Ad
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Unlocking in {adCountdown}s
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-blue-900/40 border border-white/5 flex items-center gap-2.5">
                    <span className="text-2xl">▶️</span>
                    <div className="text-xs">
                      <p className="font-bold text-white">Play Store Pass Special</p>
                      <p className="text-[10px] text-white/50">Verified Game Sponsor</p>
                    </div>
                  </div>

                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                      style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-center text-white/40">
                    Reward unlocks as soon as ad finishes
                  </p>
                </div>
              ) : adWatched ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ad Completed! You can now claim your reward.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartAdForQuickClaim}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Ad to Unlock</span>
                </button>
              )}

              {/* Claim Button - Disabled until ad is watched */}
              <button
                type="button"
                disabled={!adWatched}
                onClick={handleClaimAndClose}
                className={`w-full h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  adWatched
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20 animate-bounce'
                    : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {adWatched ? `CLAIM +${game.reward} POINTS` : `WATCH AD TO CLAIM (+${game.reward})`}
                </span>
              </button>
            </div>
          ) : (
            <div>
              {/* GAME 1: PUZZLE MEMORY */}
              {game.iconName === 'puzzle' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Match all 4 pairs!</span>
                    <span>Moves: {moves}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {cards.map((card, idx) => {
                      const isRevealed = flipped.includes(idx) || card.matched;
                      return (
                        <button
                          key={card.id + '-' + idx}
                          type="button"
                          onClick={() => handleCardClick(idx)}
                          className={`h-16 rounded-xl flex items-center justify-center text-2xl transition-all border cursor-pointer ${
                            isRevealed
                              ? 'bg-[#202738] border-white/20 scale-95'
                              : 'bg-[#181D2A] border-white/5 hover:border-white/20'
                          }`}
                        >
                          {isRevealed ? card.symbol : '❓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME 2: ARCADE TAP RUSH */}
              {game.iconName === 'arcade' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-white/70 font-semibold">
                    <span>Score: {arcadeScore}</span>
                    <span className="text-amber-400">Time: {arcadeTimeLeft}s</span>
                  </div>

                  <div className="relative h-52 bg-[#12151D] border border-white/10 rounded-2xl overflow-hidden">
                    {arcadeActive ? (
                      <button
                        type="button"
                        onClick={handleTargetClick}
                        style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/50 cursor-pointer active:scale-90 transition-transform"
                      >
                        <Zap className="w-6 h-6 text-black fill-black" />
                      </button>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <Flame className="w-10 h-10 text-orange-400 mb-2 animate-bounce" />
                        <p className="text-sm font-bold text-white">Tap the Rush Target!</p>
                        <p className="text-xs text-white/50 mt-1">
                          Score as many points as you can in 10 seconds.
                        </p>
                        <button
                          type="button"
                          onClick={startArcade}
                          className="mt-3 px-6 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 cursor-pointer"
                        >
                          START RUSH
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* GAME 3: CHALLENGE BRAIN BLITZ */}
              {game.iconName === 'challenge' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Question {challengeStep + 1} of 3</span>
                    <span className="text-amber-400 font-bold">Speed Challenge</span>
                  </div>

                  <div className="bg-[#1A1F2D] p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs text-white/50 font-medium">Quick Brain Reflex</p>
                    <p className="text-lg font-black text-white mt-1">
                      {challengeQuestions[challengeStep].q}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {challengeQuestions[challengeStep].options.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChallengeAnswer(i)}
                        className="w-full py-3 px-4 rounded-xl bg-[#1F2536] hover:bg-[#283045] border border-white/5 text-sm font-bold text-white text-left flex justify-between items-center transition-all cursor-pointer"
                      >
                        <span>{opt}</span>
                        <span className="text-xs text-white/40">Select</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
