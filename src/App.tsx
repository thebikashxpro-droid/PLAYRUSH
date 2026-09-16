/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar } from './components/TopBar';
import { BalanceCard } from './components/BalanceCard';
import { SectionHeader } from './components/SectionHeader';
import { GameCards, initialGames } from './components/GameCards';
import { MissionCard } from './components/MissionCard';
import { BottomNav } from './components/BottomNav';
import { WithdrawModal } from './components/WithdrawModal';
import { MiniGameModal } from './components/MiniGameModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ScratchCardModal } from './components/ScratchCardModal';
import { AdModal } from './components/AdModal';
import { TasksHubModal } from './components/TasksHubModal';
import { GamesView } from './components/GamesView';
import { WalletView } from './components/WalletView';
import { ProfileView } from './components/ProfileView';
import { Toast, ToastMessage } from './components/Toast';
import {
  GameItem,
  GooglePlayVoucher,
  NotificationItem,
  TransactionItem,
  SocialTask,
  AppTask,
  PlaytimeMilestone,
} from './types';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';

export default function App() {
  // Core Flutter-equivalent state
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(2450);
  const [completedMissions, setCompletedMissions] = useState<number>(2);
  const [missionClaimed, setMissionClaimed] = useState<boolean>(false);
  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState<boolean>(false);

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'googleplay' | 'upi'>('googleplay');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeMiniGame, setActiveMiniGame] = useState<GameItem | null>(null);

  // Additional Feature Modals: Scratch, Video Ad, Tasks Hub
  const [isScratchOpen, setIsScratchOpen] = useState<boolean>(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [isTasksHubOpen, setIsTasksHubOpen] = useState<boolean>(false);
  const [tasksHubTab, setTasksHubTab] = useState<'playtime' | 'apptasks' | 'social' | 'promocode'>('playtime');

  // Playtime Tracking State
  const [activePlaytimeSeconds, setActivePlaytimeSeconds] = useState<number>(68);
  const [playtimeMilestones, setPlaytimeMilestones] = useState<PlaytimeMilestone[]>([
    { minutesRequired: 1, reward: 15, claimed: false },
    { minutesRequired: 2, reward: 20, claimed: false },
    { minutesRequired: 5, reward: 35, claimed: false },
    { minutesRequired: 10, reward: 60, claimed: false },
  ]);

  // Social Media Follow Tasks
  const [socialTasks, setSocialTasks] = useState<SocialTask[]>([
    {
      id: 'social-ig',
      platform: 'instagram',
      title: 'Follow PlayRush Instagram',
      reward: 30,
      handle: '@PlayRushOfficial',
      url: 'https://instagram.com',
      completed: false,
    },
    {
      id: 'social-tg',
      platform: 'telegram',
      title: 'Join Telegram Channel',
      reward: 30,
      handle: 't.me/playrush_loot',
      url: 'https://telegram.org',
      completed: false,
    },
    {
      id: 'social-yt',
      platform: 'youtube',
      title: 'Subscribe YouTube Channel',
      reward: 30,
      handle: 'YouTube / PlayRushGaming',
      url: 'https://youtube.com',
      completed: false,
    },
    {
      id: 'social-fb',
      platform: 'facebook',
      title: 'Follow Facebook Page',
      reward: 30,
      handle: 'fb.com/PlayRushApp',
      url: 'https://facebook.com',
      completed: false,
    },
  ]);

  // App Install Tasks
  const [appTasks, setAppTasks] = useState<AppTask[]>([
    {
      id: 'app-flipkart',
      name: 'Flipkart Online Shopping',
      category: 'Shopping',
      reward: 150,
      icon: '🛍️',
      description: 'Install & browse trending deals for 30s',
      status: 'available',
    },
    {
      id: 'app-brain',
      name: 'Brain Master 3D Puzzle',
      category: 'Gaming',
      reward: 80,
      icon: '🧠',
      description: 'Install and complete Level 1',
      status: 'available',
    },
    {
      id: 'app-swiggy',
      name: 'Swiggy Food & Instamart',
      category: 'Food Delivery',
      reward: 120,
      icon: '🍔',
      description: 'Install and explore top restaurants',
      status: 'available',
    },
    {
      id: 'app-phonepe',
      name: 'PhonePe UPI & Payments',
      category: 'Finance',
      reward: 140,
      icon: '💳',
      description: 'Install & check balance or send ₹1',
      status: 'available',
    },
  ]);

  // Google Play Redeem Codes stored in vault
  const [googlePlayVouchers, setGooglePlayVouchers] = useState<GooglePlayVoucher[]>([
    {
      id: 'gp-initial-1',
      code: '4H7K-9P2R-XY3A-8V1M',
      amountInr: 10,
      pointsCost: 1000,
      date: 'Yesterday, 04:30 PM',
      status: 'active',
      recipientEmail: 'Instant In-App Delivery',
    },
  ]);
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);


  // Notifications list
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Daily Streak Bonus Ready!',
      message: 'Claim your Day 5 bonus +25 Points now in your Profile.',
      time: '10m ago',
      read: false,
      type: 'reward',
    },
    {
      id: 'notif-2',
      title: 'Welcome to PlayRush',
      message: 'Play games, finish daily missions, and withdraw instant cash.',
      time: '1h ago',
      read: false,
      type: 'system',
    },
  ]);

  // Transaction history
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'tx-1',
      title: 'Arcade Rush Reward',
      type: 'earn',
      points: 75,
      amountInr: 0.75,
      date: 'Today, 11:20 AM',
      status: 'completed',
    },
    {
      id: 'tx-2',
      title: 'Puzzle Brain Win',
      type: 'earn',
      points: 50,
      amountInr: 0.5,
      date: 'Today, 10:45 AM',
      status: 'completed',
    },
    {
      id: 'tx-3',
      title: 'Daily Check-in Bonus',
      type: 'bonus',
      points: 25,
      amountInr: 0.25,
      date: 'Yesterday',
      status: 'completed',
    },
  ]);

  // Floating Toast queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'points' | 'info' | 'success' = 'info') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 2400);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add points handler (identical to Flutter addPoints)
  const addPoints = (amount: number, sourceTitle: string = 'Game') => {
    setPoints((prev) => prev + amount);
    sounds.playCoin();

    // Update mission progression if not completed
    setCompletedMissions((prev) => {
      const updated = prev + 1;
      if (updated === 3 && !missionClaimed) {
        setTimeout(() => {
          showToast('Daily mission complete! Claim +100 Points now.', 'success');
        }, 800);
      }
      return updated;
    });

    // Record transaction
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: `${sourceTitle} Win`,
      type: 'earn',
      points: amount,
      amountInr: amount / 100,
      date: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Flutter snackbar exact message: +$amount Points added!
    showToast(`+${amount} Points added!`, 'points');
  };

  // Coming soon notice (identical to Flutter showComingSoon)
  const showComingSoon = (title: string) => {
    sounds.playClick();
    showToast(`${title} coming soon`, 'info');
  };

  // Claim Daily Mission +100 points
  const handleClaimDailyMission = () => {
    if (missionClaimed || completedMissions < 3) return;
    setMissionClaimed(true);
    setPoints((prev) => prev + 100);
    sounds.playSuccess();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });

    const newTx: TransactionItem = {
      id: `tx-mission-${Date.now()}`,
      title: 'Daily Mission Complete',
      type: 'bonus',
      points: 100,
      amountInr: 1.0,
      date: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('+100 Points added!', 'points');
  };

  // Claim Daily Check-in Bonus
  const handleClaimDailyCheckIn = () => {
    if (dailyCheckInClaimed) return;
    setDailyCheckInClaimed(true);
    setPoints((prev) => prev + 25);
    sounds.playSuccess();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });

    const newTx: TransactionItem = {
      id: `tx-checkin-${Date.now()}`,
      title: 'Daily Streak Bonus',
      type: 'bonus',
      points: 25,
      amountInr: 0.25,
      date: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('+25 Points added!', 'points');
  };

  // Withdraw cash & redeem vouchers
  const handleConfirmWithdraw = (
    pts: number,
    inr: number,
    method: string,
    account: string,
    generatedCode?: string
  ) => {
    setPoints((prev) => Math.max(0, prev - pts));

    if (method === 'GOOGLE PLAY' && generatedCode) {
      const newVoucher: GooglePlayVoucher = {
        id: `gp-${Date.now()}`,
        code: generatedCode,
        amountInr: inr,
        pointsCost: pts,
        date: 'Today, Just now',
        status: 'active',
        recipientEmail: account,
      };
      setGooglePlayVouchers((prev) => [newVoucher, ...prev]);
    }

    const newTx: TransactionItem = {
      id: `tx-withdraw-${Date.now()}`,
      title: method === 'GOOGLE PLAY' ? `Google Play Code (₹${inr})` : `Cashout to ${method}`,
      type: 'withdraw',
      points: pts,
      amountInr: inr,
      date: 'Just now',
      status: 'completed',
      method: method === 'GOOGLE PLAY' ? `Google Play Redeem Code` : `${method} (${account})`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      method === 'GOOGLE PLAY'
        ? `₹${inr} Google Play Code added to Wallet!`
        : `Withdrawal of ₹${inr} initiated!`,
      'success'
    );
  };

  // Live Playtime increment
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePlaytimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimPlaytimeMilestone = (index: number) => {
    const target = playtimeMilestones[index];
    if (!target || target.claimed) return;
    if (activePlaytimeSeconds < target.minutesRequired * 60) {
      showToast(`Play for ${target.minutesRequired} min to unlock!`, 'info');
      return;
    }

    setPlaytimeMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, claimed: true } : m))
    );
    addPoints(target.reward, `Playtime Bonus (${target.minutesRequired} min)`);
    sounds.playSuccess();
  };

  const handleCompleteSocialTask = (taskId: string) => {
    const task = socialTasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    setSocialTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    addPoints(task.reward, `Social Task: ${task.title}`);
    sounds.playSuccess();
  };

  const handleCompleteAppTask = (taskId: string) => {
    const task = appTasks.find((t) => t.id === taskId);
    if (!task || task.status === 'completed') return;

    setAppTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );
    addPoints(task.reward, `App Task: ${task.name}`);
    sounds.playSuccess();
  };

  const handleAdRewardClaimed = (coinsEarned: number) => {
    addPoints(coinsEarned, 'Sponsored Video Ad');
    setIsAdModalOpen(false);
    sounds.playCoin();
  };

  const handleScratchRewardClaimed = (coinsEarned: number) => {
    addPoints(coinsEarned, 'Lucky Scratch Card');
    setIsScratchOpen(false);
    sounds.playCoin();
  };

  // Redeem Promo / Gift Code
  const handleRedeemPromoCode = (
    code: string
  ): { success: boolean; message: string; points?: number } => {
    const clean = code.trim().toUpperCase();
    if (redeemedCodes.includes(clean)) {
      return { success: false, message: 'This code has already been redeemed!' };
    }

    const validPromos: Record<string, number> = {
      GOOGLEPLAY: 100,
      PLAYSTORE: 100,
      RUSH2026: 150,
      BONUS100: 100,
      FREEPLAY: 50,
      WELCOME: 75,
      TELEGRAM: 30,
      YOUTUBE: 30,
      FREE20: 20,
    };

    if (validPromos[clean]) {
      const reward = validPromos[clean];
      setRedeemedCodes((prev) => [...prev, clean]);
      setPoints((prev) => prev + reward);
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      const newTx: TransactionItem = {
        id: `tx-promo-${Date.now()}`,
        title: `Redeem Code (${clean})`,
        type: 'bonus',
        points: reward,
        amountInr: reward / 100,
        date: 'Just now',
        status: 'completed',
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`+${reward} Points added!`, 'points');

      return {
        success: true,
        message: `Success! +${reward} Points added to your balance.`,
        points: reward,
      };
    }

    return {
      success: false,
      message: 'Invalid code. Try GOOGLEPLAY, PLAYSTORE, BONUS100, or RUSH2026.',
    };
  };

  // Reset demo
  const handleResetDemoData = () => {
    setPoints(2450);
    setCompletedMissions(2);
    setMissionClaimed(false);
    setDailyCheckInClaimed(false);
    sounds.playClick();
    showToast('Demo data restored to initial state');
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    sounds.playClick();
    showToast('All notifications marked as read');
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <main className="min-h-screen bg-[#07090D] flex items-center justify-center p-0 sm:p-4 text-white selection:bg-amber-400 selection:text-black">
      {/* Mobile Shell Wrapper */}
      <div
        id="playrush-app-container"
        className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[920px] bg-[#0B0D12] sm:rounded-[36px] sm:border sm:border-white/10 shadow-2xl relative flex flex-col overflow-hidden"
      >
        {/* Animated Main Content with Flutter curve & fade */}
        <motion.div
          key="playrush-main-view"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
        >
          {/* Top Bar is visible across views with context-aware buttons */}
          <TopBar
            onNotificationsClick={() => setIsNotificationsOpen(true)}
            onProfileClick={() => setSelectedIndex(3)}
            unreadNotificationsCount={unreadNotifs}
          />

          {/* TAB 0: HOME SCREEN (Exact Flutter UI) */}
          {selectedIndex === 0 && (
            <div id="home-sliver-scroll" className="space-y-0">
              {/* Balance Card */}
              <BalanceCard
                points={points}
                onWithdraw={() => {
                  setWithdrawMethod('upi');
                  setIsWithdrawOpen(true);
                }}
                onGooglePlayRedeem={() => {
                  setWithdrawMethod('googleplay');
                  setIsWithdrawOpen(true);
                }}
              />

              {/* Google Play Redeem Code Quick Strip */}
              <div className="px-5 pt-3 pb-1">
                <div
                  onClick={() => {
                    setWithdrawMethod('googleplay');
                    setIsWithdrawOpen(true);
                  }}
                  className="p-3.5 rounded-[20px] bg-gradient-to-r from-[#11271D] via-[#142323] to-[#151821] border border-emerald-500/25 flex items-center justify-between cursor-pointer hover:border-emerald-500/45 transition-all group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                      ▶️
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        Google Play Redeem Codes
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                          Available
                        </span>
                      </h4>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        Redeem starting at ₹10 (1,000 Pts). Instant delivery!
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    Redeem →
                  </span>
                </div>
              </div>

              {/* Instant Earn & Tasks Hub Grid */}
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white/70">
                    Earn Coins Fast
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTasksHubTab('playtime');
                      setIsTasksHubOpen(true);
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                  >
                    View All Tasks →
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {/* Scratch Card */}
                  <button
                    type="button"
                    onClick={() => setIsScratchOpen(true)}
                    className="p-2.5 rounded-2xl bg-[#161B26] border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col items-center text-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎟️</span>
                    <span className="text-[11px] font-extrabold text-white">Scratch</span>
                    <span className="text-[9px] font-bold text-amber-400">Card</span>
                  </button>

                  {/* Watch Video Ad */}
                  <button
                    type="button"
                    onClick={() => setIsAdModalOpen(true)}
                    className="p-2.5 rounded-2xl bg-[#161B26] border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎬</span>
                    <span className="text-[11px] font-extrabold text-white">Watch Ad</span>
                    <span className="text-[9px] font-bold text-emerald-400">10-20 Pts</span>
                  </button>

                  {/* Unlimited Spin */}
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(1)}
                    className="p-2.5 rounded-2xl bg-[#161B26] border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col items-center text-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎡</span>
                    <span className="text-[11px] font-extrabold text-white">Spin Wheel</span>
                    <span className="text-[9px] font-bold text-purple-400">Unlimited</span>
                  </button>

                  {/* Play Time */}
                  <button
                    type="button"
                    onClick={() => {
                      setTasksHubTab('playtime');
                      setIsTasksHubOpen(true);
                    }}
                    className="p-2.5 rounded-2xl bg-[#161B26] border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center cursor-pointer group relative overflow-hidden"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏱️</span>
                    <span className="text-[11px] font-extrabold text-white">Play Time</span>
                    <span className="text-[9px] font-bold text-cyan-400">
                      {Math.floor(activePlaytimeSeconds / 60)}m {activePlaytimeSeconds % 60}s
                    </span>
                  </button>
                </div>

                {/* Additional task pills: App Tasks, Social Media, Promo Code */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTasksHubTab('apptasks');
                      setIsTasksHubOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold text-white/90"
                  >
                    <span>📱</span>
                    <span className="text-[11px]">App Tasks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTasksHubTab('social');
                      setIsTasksHubOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold text-white/90"
                  >
                    <span>👥</span>
                    <span className="text-[11px]">Follow Socials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTasksHubTab('promocode');
                      setIsTasksHubOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold text-amber-300"
                  >
                    <span>🏷️</span>
                    <span className="text-[11px]">Promo Code</span>
                  </button>
                </div>
              </div>

              {/* Play & Earn Section Header */}
              <SectionHeader
                id="sec-play-earn"
                title="Play & Earn"
                actionText="View all"
                onAction={() => setSelectedIndex(1)}
              />

              {/* Games Horizontal Scroller */}
              <GameCards
                onPlayGame={(game) => {
                  // Direct reward like Flutter addPoints AND mini-game option
                  addPoints(game.reward, game.title);
                  // Open mini-game modal so user can experience full game interactivity
                  setActiveMiniGame(game);
                }}
              />

              {/* Daily Missions Section Header */}
              <SectionHeader
                id="sec-daily-missions"
                title="Daily Missions"
                actionText="See all"
                onAction={() => showComingSoon('All missions')}
              />

              {/* Mission Card */}
              <MissionCard
                completedMissions={completedMissions}
                totalMissions={3}
                reward={100}
                claimed={missionClaimed}
                onClaim={handleClaimDailyMission}
              />

              {/* Bottom Spacer for fixed navigation */}
              <div className="h-[110px]" />
            </div>
          )}

          {/* TAB 1: GAMES ARENA */}
          {selectedIndex === 1 && (
            <GamesView
              onSelectGame={(game) => setActiveMiniGame(game)}
              onAddBonusPoints={(amt, reason) => addPoints(amt, reason)}
              onOpenScratchCard={() => setIsScratchOpen(true)}
              onOpenWatchAd={() => setIsAdModalOpen(true)}
              onOpenTasksHub={(tab) => {
                setTasksHubTab(tab || 'playtime');
                setIsTasksHubOpen(true);
              }}
            />
          )}

          {/* TAB 2: WALLET & CASH OUT */}
          {selectedIndex === 2 && (
            <WalletView
              points={points}
              transactions={transactions}
              googlePlayVouchers={googlePlayVouchers}
              onOpenWithdraw={(defaultMethod) => {
                setWithdrawMethod(defaultMethod || 'upi');
                setIsWithdrawOpen(true);
              }}
              onRedeemPromoCode={handleRedeemPromoCode}
            />
          )}

          {/* TAB 3: PROFILE & REWARDS */}
          {selectedIndex === 3 && (
            <ProfileView
              points={points}
              onClaimDailyCheckIn={handleClaimDailyCheckIn}
              dailyCheckInClaimed={dailyCheckInClaimed}
              onResetDemoData={handleResetDemoData}
              onShowToast={(msg) => showToast(msg, 'info')}
            />
          )}
        </motion.div>

        {/* Bottom Navigation */}
        <BottomNav
          selectedIndex={selectedIndex}
          onSelectIndex={(index) => {
            sounds.playClick();
            setSelectedIndex(index);
          }}
        />

        {/* Floating Toast Notification Container */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Modals */}
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          points={points}
          initialMethod={withdrawMethod}
          onConfirmWithdraw={handleConfirmWithdraw}
        />

        <MiniGameModal
          game={activeMiniGame}
          onClose={() => setActiveMiniGame(null)}
          onCompleteGame={(reward, title) => {
            addPoints(reward, title);
          }}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
        />

        {/* Sponsored Video Ad Modal (Random 10-20 coins) */}
        <AdModal
          isOpen={isAdModalOpen}
          onClose={() => setIsAdModalOpen(false)}
          onRewardClaimed={handleAdRewardClaimed}
          title="Watch Sponsor Video Ad"
          subtitle="Watch full 5s video ad to earn instant coins"
        />

        {/* Lucky Scratch Card Modal */}
        <ScratchCardModal
          isOpen={isScratchOpen}
          onClose={() => setIsScratchOpen(false)}
          onRewardClaimed={handleScratchRewardClaimed}
        />

        {/* Complete Tasks & Playtime Hub */}
        <TasksHubModal
          isOpen={isTasksHubOpen}
          onClose={() => setIsTasksHubOpen(false)}
          activePlaytimeSeconds={activePlaytimeSeconds}
          playtimeMilestones={playtimeMilestones}
          onClaimPlaytimeMilestone={handleClaimPlaytimeMilestone}
          socialTasks={socialTasks}
          onCompleteSocialTask={handleCompleteSocialTask}
          appTasks={appTasks}
          onCompleteAppTask={handleCompleteAppTask}
          onRedeemPromoCode={handleRedeemPromoCode}
          initialTab={tasksHubTab}
        />
      </div>
    </main>
  );
}
