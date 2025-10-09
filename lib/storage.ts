import { AppData, DailyEntry, ChecklistTemplate, Streak } from './types';
import { DEFAULT_TEMPLATE } from './defaults';
import { calculateDailyScore } from './utils';

const STORAGE_KEY = 'triglycoach-data';

export const storage = {
  getData(): AppData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return this.getDefaultData();
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return this.getDefaultData();
    }
  },

  saveData(data: AppData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  getDefaultData(): AppData {
    return {
      template: DEFAULT_TEMPLATE,
      entries: [],
      streak: { current: 0, longest: 0 },
    };
  },

  getTemplate(): ChecklistTemplate {
    return this.getData().template;
  },

  saveTemplate(template: ChecklistTemplate): void {
    const data = this.getData();
    data.template = template;
    this.saveData(data);
  },

  getEntries(): DailyEntry[] {
    return this.getData().entries;
  },

  getEntry(date: string): DailyEntry | undefined {
    const entries = this.getEntries();
    return entries.find((e) => e.date === date);
  },

  saveEntry(entry: DailyEntry): void {
    const data = this.getData();
    const existingIndex = data.entries.findIndex((e) => e.date === entry.date);

    if (existingIndex >= 0) {
      data.entries[existingIndex] = entry;
    } else {
      data.entries.push(entry);
    }

    data.entries.sort((a, b) => b.date.localeCompare(a.date));
    data.streak = this.calculateStreak(data.entries);
    this.saveData(data);
  },

  getStreak(): Streak {
    return this.getData().streak;
  },

  calculateStreak(entries: DailyEntry[]): Streak {
    if (entries.length === 0) {
      return { current: 0, longest: 0 };
    }

    const template = this.getTemplate();
    const completedEntries = entries
      .filter((e) => calculateDailyScore(e, template) >= 0.7)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (completedEntries.length === 0) {
      return { current: 0, longest: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let current = 0;
    let longest = 0;
    let tempStreak = 1;

    // Check if we have a current streak
    const latestDate = new Date(completedEntries[0].date);
    latestDate.setHours(0, 0, 0, 0);
    const isCurrentStreak = latestDate.getTime() === today.getTime() ||
                           latestDate.getTime() === yesterday.getTime();

    if (isCurrentStreak) {
      current = 1;
    }

    // Calculate streaks
    for (let i = 1; i < completedEntries.length; i++) {
      const prevDate = new Date(completedEntries[i - 1].date);
      const currDate = new Date(completedEntries[i].date);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        tempStreak++;
        if (isCurrentStreak && i < completedEntries.length) {
          current++;
        }
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
      }
    }

    longest = Math.max(longest, tempStreak);
    return { current, longest };
  },

  clearData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
