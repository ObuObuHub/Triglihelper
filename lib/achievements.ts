import { DailyEntry, ChecklistTemplate } from './types';
import { calculateDailyScore } from './utils';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'special';
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  perfectDays: number;
  daysAbove80: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Tier
  {
    id: 'prima-zi',
    name: 'Prima Zi',
    description: 'Completează prima zi',
    emoji: '⭐',
    tier: 'beginner',
    condition: (stats) => stats.totalDays >= 1,
  },
  {
    id: 'inceput-bun',
    name: 'Început Bun',
    description: '3 zile la rând',
    emoji: '🌱',
    tier: 'beginner',
    condition: (stats) => stats.longestStreak >= 3,
  },
  {
    id: 'o-saptamana',
    name: 'O Săptămână!',
    description: '7 zile la rând',
    emoji: '💪',
    tier: 'beginner',
    condition: (stats) => stats.longestStreak >= 7,
  },

  // Intermediate Tier
  {
    id: 'doua-saptamani',
    name: 'Două Săptămâni',
    description: '14 zile la rând',
    emoji: '🔥',
    tier: 'intermediate',
    condition: (stats) => stats.longestStreak >= 14,
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: '21 zile la rând - formează un obicei',
    emoji: '🎯',
    tier: 'intermediate',
    condition: (stats) => stats.longestStreak >= 21,
  },
  {
    id: 'o-luna',
    name: 'O Lună Întreagă',
    description: '30 zile la rând',
    emoji: '🌟',
    tier: 'intermediate',
    condition: (stats) => stats.longestStreak >= 30,
  },

  // Advanced Tier
  {
    id: 'dedicat',
    name: 'Dedicat',
    description: '60 zile la rând',
    emoji: '💎',
    tier: 'advanced',
    condition: (stats) => stats.longestStreak >= 60,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: '90 zile la rând',
    emoji: '👑',
    tier: 'advanced',
    condition: (stats) => stats.longestStreak >= 90,
  },
  {
    id: 'campion',
    name: 'Campion',
    description: '180 zile la rând',
    emoji: '🏆',
    tier: 'advanced',
    condition: (stats) => stats.longestStreak >= 180,
  },
  {
    id: 'legenda',
    name: 'Legendă',
    description: '365 zile la rând - un an complet!',
    emoji: '🎖️',
    tier: 'advanced',
    condition: (stats) => stats.longestStreak >= 365,
  },

  // Special Tier
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Prima zi cu 100% completare',
    emoji: '✨',
    tier: 'special',
    condition: (stats) => stats.perfectDays >= 1,
  },
  {
    id: 'artist',
    name: 'Artist',
    description: '10 zile perfecte',
    emoji: '🎨',
    tier: 'special',
    condition: (stats) => stats.perfectDays >= 10,
  },
  {
    id: 'transformare',
    name: 'Transformare',
    description: '30 zile cu 80%+ completare',
    emoji: '🚀',
    tier: 'special',
    condition: (stats) => stats.daysAbove80 >= 30,
  },
];

export function calculateAchievementStats(
  entries: DailyEntry[],
  template: ChecklistTemplate,
  currentStreak: number,
  longestStreak: number
): AchievementStats {
  const perfectDays = entries.filter((e) => calculateDailyScore(e, template) === 1).length;
  const daysAbove80 = entries.filter((e) => calculateDailyScore(e, template) >= 0.8).length;

  return {
    currentStreak,
    longestStreak,
    totalDays: entries.length,
    perfectDays,
    daysAbove80,
  };
}

export function checkNewAchievements(
  stats: AchievementStats,
  unlockedIds: string[]
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '';
  if (streak < 7) return '🔥';
  if (streak < 30) return '🔥🔥';
  return '🔥🔥🔥';
}

export function getStreakMilestone(streak: number): string | null {
  const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
  if (milestones.includes(streak)) {
    return `${streak} zile la rând! Incredibil! 🎉`;
  }
  return null;
}
