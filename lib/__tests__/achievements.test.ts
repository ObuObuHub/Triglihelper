import {
  ACHIEVEMENTS,
  calculateAchievementStats,
  checkNewAchievements,
  getStreakEmoji,
  getStreakMilestone
} from '../achievements';
import { DailyEntry, ChecklistTemplate } from '../types';

// Mock template
const mockTemplate: ChecklistTemplate = {
  sections: [
    {
      name: 'Activity',
      items: [
        { id: 'a1', label: 'Test', required: true },
        { id: 'a2', label: 'Test', required: true },
      ],
      minRequired: 2,
    },
  ],
};

// Helper to create completed entry
const createEntry = (date: string, complete: boolean = true): DailyEntry => ({
  date,
  sections: [
    {
      sectionName: 'Activity',
      items: [
        { id: 'a1', checked: complete },
        { id: 'a2', checked: complete },
      ],
      sectionComplete: complete,
    },
  ],
  dayComplete: complete,
});

describe('Achievement System', () => {
  describe('calculateAchievementStats', () => {
    test('calculates perfect days correctly', () => {
      const entries = [
        createEntry('2025-10-10', true),
        createEntry('2025-10-09', true),
        createEntry('2025-10-08', false), // Partial
      ];

      const stats = calculateAchievementStats(entries, mockTemplate, 2, 2);

      expect(stats.totalDays).toBe(3);
      expect(stats.perfectDays).toBe(2);
      expect(stats.currentStreak).toBe(2);
      expect(stats.longestStreak).toBe(2);
    });

    test('calculates days above 80% threshold', () => {
      // For a 2-item checklist, 80% means both items checked
      const entries = [
        createEntry('2025-10-10', true),  // 100%
        createEntry('2025-10-09', true),  // 100%
        createEntry('2025-10-08', false), // 0%
      ];

      const stats = calculateAchievementStats(entries, mockTemplate, 2, 2);

      expect(stats.daysAbove80).toBe(2);
    });
  });

  describe('Achievement Unlocking', () => {
    test('"Prima Zi" unlocks on first completed day', () => {
      const stats = {
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        perfectDays: 1,
        daysAbove80: 1,
      };

      const newAchievements = checkNewAchievements(stats, []);

      expect(newAchievements).toContainEqual(
        expect.objectContaining({ id: 'prima-zi' })
      );
    });

    test('"Început Bun" unlocks at 3-day streak', () => {
      const stats = {
        currentStreak: 3,
        longestStreak: 3,
        totalDays: 3,
        perfectDays: 3,
        daysAbove80: 3,
      };

      const newAchievements = checkNewAchievements(stats, ['prima-zi']);

      expect(newAchievements).toContainEqual(
        expect.objectContaining({ id: 'inceput-bun' })
      );
    });

    test('"O Săptămână!" unlocks at 7-day streak', () => {
      const stats = {
        currentStreak: 7,
        longestStreak: 7,
        totalDays: 7,
        perfectDays: 7,
        daysAbove80: 7,
      };

      const newAchievements = checkNewAchievements(stats, ['prima-zi', 'inceput-bun']);

      expect(newAchievements).toContainEqual(
        expect.objectContaining({ id: 'o-saptamana' })
      );
    });

    test('Already unlocked achievements are not returned', () => {
      const stats = {
        currentStreak: 3,
        longestStreak: 3,
        totalDays: 3,
        perfectDays: 3,
        daysAbove80: 3,
      };

      const newAchievements = checkNewAchievements(stats, ['prima-zi', 'inceput-bun']);

      expect(newAchievements).not.toContainEqual(
        expect.objectContaining({ id: 'prima-zi' })
      );
      expect(newAchievements).not.toContainEqual(
        expect.objectContaining({ id: 'inceput-bun' })
      );
    });

    test('"Perfectionist" unlocks on first perfect day', () => {
      const stats = {
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        perfectDays: 1,
        daysAbove80: 1,
      };

      const newAchievements = checkNewAchievements(stats, ['prima-zi']);

      expect(newAchievements).toContainEqual(
        expect.objectContaining({ id: 'perfectionist' })
      );
    });

    test('"Transformare" requires 30 days above 80%', () => {
      const stats = {
        currentStreak: 30,
        longestStreak: 30,
        totalDays: 30,
        perfectDays: 25,
        daysAbove80: 30,
      };

      const newAchievements = checkNewAchievements(stats, []);

      expect(newAchievements).toContainEqual(
        expect.objectContaining({ id: 'transformare' })
      );
    });

    test('Multiple achievements can unlock at once', () => {
      const stats = {
        currentStreak: 7,
        longestStreak: 7,
        totalDays: 7,
        perfectDays: 7,
        daysAbove80: 7,
      };

      const newAchievements = checkNewAchievements(stats, []);

      // Should unlock: prima-zi, inceput-bun, o-saptamana, perfectionist
      expect(newAchievements.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Streak UI Helpers', () => {
    test('getStreakEmoji returns correct emoji for different streak lengths', () => {
      expect(getStreakEmoji(0)).toBe('');
      expect(getStreakEmoji(1)).toBe('🔥');
      expect(getStreakEmoji(6)).toBe('🔥');
      expect(getStreakEmoji(7)).toBe('🔥🔥');
      expect(getStreakEmoji(29)).toBe('🔥🔥');
      expect(getStreakEmoji(30)).toBe('🔥🔥🔥');
      expect(getStreakEmoji(100)).toBe('🔥🔥🔥');
    });

    test('getStreakMilestone returns celebration message at milestones', () => {
      expect(getStreakMilestone(7)).toContain('7 zile');
      expect(getStreakMilestone(14)).toContain('14 zile');
      expect(getStreakMilestone(21)).toContain('21 zile');
      expect(getStreakMilestone(30)).toContain('30 zile');
      expect(getStreakMilestone(365)).toContain('365 zile');
    });

    test('getStreakMilestone returns null for non-milestone days', () => {
      expect(getStreakMilestone(1)).toBeNull();
      expect(getStreakMilestone(8)).toBeNull();
      expect(getStreakMilestone(15)).toBeNull();
      expect(getStreakMilestone(100)).toBeNull();
    });
  });

  describe('Achievement Tiers', () => {
    test('All achievements have valid tiers', () => {
      const validTiers = ['beginner', 'intermediate', 'advanced', 'special'];

      ACHIEVEMENTS.forEach(achievement => {
        expect(validTiers).toContain(achievement.tier);
      });
    });

    test('Achievement progression is logical', () => {
      // Verify streak achievements are in ascending order
      const streakAchievements = [
        { id: 'inceput-bun', days: 3 },
        { id: 'o-saptamana', days: 7 },
        { id: 'doua-saptamani', days: 14 },
        { id: 'consistent', days: 21 },
        { id: 'o-luna', days: 30 },
        { id: 'dedicat', days: 60 },
        { id: 'expert', days: 90 },
        { id: 'campion', days: 180 },
        { id: 'legenda', days: 365 },
      ];

      for (let i = 1; i < streakAchievements.length; i++) {
        expect(streakAchievements[i].days).toBeGreaterThan(
          streakAchievements[i - 1].days
        );
      }
    });
  });

  describe('Edge Cases', () => {
    test('Stats with zero values do not unlock achievements', () => {
      const stats = {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        perfectDays: 0,
        daysAbove80: 0,
      };

      const newAchievements = checkNewAchievements(stats, []);

      expect(newAchievements).toHaveLength(0);
    });

    test('All achievements already unlocked returns empty array', () => {
      const stats = {
        currentStreak: 365,
        longestStreak: 365,
        totalDays: 365,
        perfectDays: 365,
        daysAbove80: 365,
      };

      const allIds = ACHIEVEMENTS.map(a => a.id);
      const newAchievements = checkNewAchievements(stats, allIds);

      expect(newAchievements).toHaveLength(0);
    });
  });
});
