import { AppData, DailyEntry, User, ChecklistTemplate, Streak } from './types';
import { DEFAULT_TEMPLATE, DEFAULT_USER } from './defaults';

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
      user: DEFAULT_USER,
      template: DEFAULT_TEMPLATE,
      entries: [],
      streak: { current: 0, longest: 0 },
    };
  },

  getUser(): User {
    return this.getData().user;
  },

  saveUser(user: User): void {
    const data = this.getData();
    data.user = user;
    this.saveData(data);
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

    const sortedEntries = [...entries]
      .filter((e) => e.dayComplete)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sortedEntries.length === 0) {
      return { current: 0, longest: 0 };
    }

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const latestEntry = new Date(sortedEntries[0].date);
    latestEntry.setHours(0, 0, 0, 0);

    if (latestEntry.getTime() === today.getTime() || latestEntry.getTime() === yesterday.getTime()) {
      current = 1;
      tempStreak = 1;

      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = new Date(sortedEntries[i - 1].date);
        const prevDate = new Date(sortedEntries[i].date);
        currentDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);

        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          if (i < sortedEntries.length && latestEntry.getTime() >= prevDate.getTime()) {
            current++;
          }
          tempStreak++;
        } else {
          if (tempStreak > longest) {
            longest = tempStreak;
          }
          tempStreak = 1;
        }
      }
    } else {
      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = new Date(sortedEntries[i - 1].date);
        const prevDate = new Date(sortedEntries[i].date);
        currentDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);

        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longest) {
            longest = tempStreak;
          }
          tempStreak = 1;
        }
      }
    }

    if (tempStreak > longest) {
      longest = tempStreak;
    }

    return { current, longest };
  },

  clearData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
