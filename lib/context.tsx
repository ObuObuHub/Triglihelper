'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DailyEntry, ChecklistTemplate, Streak, SyncStatus } from './types';
import { storage } from './storage';
import { useTranslation } from './translations';
import { isSupabaseConfigured } from './supabase';

interface AppContextType {
  user: User;
  template: ChecklistTemplate;
  todayEntry: DailyEntry | null;
  streak: Streak;
  t: ReturnType<typeof useTranslation>;
  syncStatus: SyncStatus;
  isSupabaseEnabled: boolean;
  updateUser: (user: User) => void;
  updateTemplate: (template: ChecklistTemplate) => void;
  updateTodayEntry: (entry: DailyEntry) => void;
  refreshData: () => void;
  syncNow: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => storage.getUser());
  const [template, setTemplate] = useState<ChecklistTemplate>(() => storage.getTemplate());
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [streak, setStreak] = useState<Streak>(() => storage.getStreak());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ isSyncing: false });
  const isSupabaseEnabled = isSupabaseConfigured();
  const t = useTranslation();

  useEffect(() => {
    refreshData();

    // Auto-sync from cloud on mount
    if (isSupabaseEnabled) {
      syncFromCloud();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = () => {
    const userData = storage.getUser();
    const templateData = storage.getTemplate();
    const streakData = storage.getStreak();

    setUser(userData);
    setTemplate(templateData);
    setStreak(streakData);

    const today = new Date().toISOString().split('T')[0];
    const entry = storage.getEntry(today);
    setTodayEntry(entry || null);
  };

  const syncFromCloud = async () => {
    if (!isSupabaseEnabled) return;

    try {
      setSyncStatus({ isSyncing: true });
      await storage.syncFromCloud();
      refreshData();
      setSyncStatus({ isSyncing: false, lastSyncedAt: new Date() });
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus({
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      });
    }
  };

  const updateUser = (newUser: User) => {
    storage.saveUser(newUser);
    setUser(newUser);
  };

  const updateTemplate = (newTemplate: ChecklistTemplate) => {
    storage.saveTemplate(newTemplate);
    setTemplate(newTemplate);
  };

  const updateTodayEntry = (entry: DailyEntry) => {
    storage.saveEntry(entry);
    setTodayEntry(entry);
    setStreak(storage.getStreak());
  };

  const syncNow = async () => {
    await syncFromCloud();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        template,
        todayEntry,
        streak,
        t,
        syncStatus,
        isSupabaseEnabled,
        updateUser,
        updateTemplate,
        updateTodayEntry,
        refreshData,
        syncNow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
