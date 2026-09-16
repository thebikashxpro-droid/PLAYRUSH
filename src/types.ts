export interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  reward: number;
  iconName: 'puzzle' | 'arcade' | 'challenge' | 'cards' | 'spin' | 'quiz';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playedCount: number;
}

export interface MissionItem {
  id: string;
  title: string;
  subtitle: string;
  reward: number;
  current: number;
  total: number;
  claimed: boolean;
}

export interface TransactionItem {
  id: string;
  title: string;
  type: 'earn' | 'withdraw' | 'bonus';
  points: number;
  amountInr: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method?: string;
}

export interface GooglePlayVoucher {
  id: string;
  code: string;
  amountInr: number;
  pointsCost: number;
  date: string;
  status: 'active' | 'redeemed';
  recipientEmail?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reward' | 'system' | 'mission';
}

export interface SocialTask {
  id: string;
  platform: 'instagram' | 'telegram' | 'youtube' | 'facebook';
  title: string;
  reward: number;
  handle: string;
  url: string;
  completed: boolean;
}

export interface AppTask {
  id: string;
  name: string;
  category: string;
  reward: number;
  icon: string;
  description: string;
  status: 'available' | 'installing' | 'completed';
}

export interface PlaytimeMilestone {
  minutesRequired: number;
  reward: number;
  claimed: boolean;
}

