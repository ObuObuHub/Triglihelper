import { AppData, DailyEntry, User, ChecklistTemplate, Streak } from './types';
import { DEFAULT_TEMPLATE, DEFAULT_USER } from './defaults';
import { cloudStorage } from './cloudStorage';
import { calculateDailyScore } from './utils';

const STORAGE_KEY = 'triglycoach-data';

export const storage = {
  getData(): AppData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      console.log('[Storage] getData - raw localStorage:', data ? 'exists' : 'null');
      if (!data) {
        console.log('[Storage] getData - returning default data');
        return this.getDefaultData();
      }
      const parsed = JSON.parse(data);
      console.log('[Storage] getData - entries count:', parsed.entries?.length || 0);
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return this.getDefaultData();
    }
  },

  saveData(data: AppData): void {
    if (typeof window === 'undefined') return;

    try {
      console.log('[Storage] saveData - saving entries count:', data.entries?.length || 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('[Storage] saveData - saved successfully');
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

    // Sync to cloud
    cloudStorage.syncUser(user).catch(console.error);
  },

  async loadUserFromCloud(): Promise<User | null> {
    return cloudStorage.getUser();
  },

  getTemplate(): ChecklistTemplate {
    return this.getData().template;
  },

  saveTemplate(template: ChecklistTemplate): void {
    const data = this.getData();
    data.template = template;
    this.saveData(data);

    // Sync to cloud
    cloudStorage.syncTemplate(template).catch(console.error);
  },

  async loadTemplateFromCloud(): Promise<ChecklistTemplate | null> {
    return cloudStorage.getTemplate();
  },

  getEntries(): DailyEntry[] {
    return this.getData().entries;
  },

  getEntry(date: string): DailyEntry | undefined {
    const entries = this.getEntries();
    return entries.find((e) => e.date === date);
  },

  saveEntry(entry: DailyEntry): void {
    console.log('[Storage] saveEntry - date:', entry.date, 'sections:', entry.sections.length);
    const data = this.getData();
    const existingIndex = data.entries.findIndex((e) => e.date === entry.date);

    if (existingIndex >= 0) {
      console.log('[Storage] saveEntry - updating existing entry at index:', existingIndex);
      data.entries[existingIndex] = entry;
    } else {
      console.log('[Storage] saveEntry - adding new entry');
      data.entries.push(entry);
    }

    data.entries.sort((a, b) => b.date.localeCompare(a.date));

    data.streak = this.calculateStreak(data.entries);

    this.saveData(data);

    // Sync to cloud
    console.log('[Storage] saveEntry - syncing to cloud');
    cloudStorage.syncEntry(entry).catch(console.error);
  },

  async loadEntriesFromCloud(): Promise<DailyEntry[]> {
    return cloudStorage.getEntries();
  },

  async syncFromCloud(): Promise<void> {
    try {
      const [cloudUser, cloudTemplate, cloudEntries] = await Promise.all([
        cloudStorage.getUser(),
        cloudStorage.getTemplate(),
        cloudStorage.getEntries(),
      ]);

      const data = this.getData();

      if (cloudUser) {
        data.user = cloudUser;
      }

      if (cloudTemplate) {
        data.template = cloudTemplate;
      }

      if (cloudEntries && cloudEntries.length > 0) {
        // Merge cloud and local entries (keep both, prefer local for conflicts)
        const localEntriesMap = new Map(data.entries.map(e => [e.date, e]));

        cloudEntries.forEach(cloudEntry => {
          const localEntry = localEntriesMap.get(cloudEntry.date);

          if (!localEntry) {
            // Cloud has an entry we don't have locally - add it
            localEntriesMap.set(cloudEntry.date, cloudEntry);
          }
          // If we have a local entry, keep it (local changes take precedence)
        });

        data.entries = Array.from(localEntriesMap.values())
          .sort((a, b) => b.date.localeCompare(a.date));
        data.streak = this.calculateStreak(data.entries);
      }

      this.saveData(data);
    } catch (error) {
      console.error('Error syncing from cloud:', error);
    }
  },

  async syncToCloud(): Promise<void> {
    try {
      const data = this.getData();

      await Promise.all([
        cloudStorage.syncUser(data.user),
        cloudStorage.syncTemplate(data.template),
        ...data.entries.map((entry) => cloudStorage.syncEntry(entry)),
      ]);
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
  },

  getStreak(): Streak {
    return this.getData().streak;
  },

  calculateStreak(entries: DailyEntry[]): Streak {
    if (entries.length === 0) {
      return { current: 0, longest: 0 };
    }

    const template = this.getTemplate();

    const sortedEntries = [...entries]
      .filter((e) => calculateDailyScore(e, template) >= 0.8) // 80% threshold
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

  async clearData(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);

    // Clear cloud data too
    await cloudStorage.deleteAllData();
  },
};
