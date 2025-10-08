'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DailyEntry, ChecklistTemplate, Streak, AuthUser, SyncStatus } from './types';
import { storage } from './storage';
import { auth } from './auth';
import { useTranslation, Locale } from './translations';
import { isSupabaseConfigured } from './supabase';

interface AppContextType {
  user: User;
  authUser: AuthUser | null;
  template: ChecklistTemplate;
  todayEntry: DailyEntry | null;
  streak: Streak;
  locale: Locale;
  t: ReturnType<typeof useTranslation>;
  syncStatus: SyncStatus;
  isSupabaseEnabled: boolean;
  updateUser: (user: User) => void;
  updateTemplate: (template: ChecklistTemplate) => void;
  updateTodayEntry: (entry: DailyEntry) => void;
  refreshData: () => void;
  signIn: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => storage.getUser());
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [template, setTemplate] = useState<ChecklistTemplate>(() => storage.getTemplate());
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [streak, setStreak] = useState<Streak>(() => storage.getStreak());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ isSyncing: false });
  const isSupabaseEnabled = isSupabaseConfigured();
  const locale = user.locale || 'ro';
  const t = useTranslation(locale);

  useEffect(() => {
    refreshData();

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChange(async (newAuthUser) => {
      setAuthUser(newAuthUser);

      if (newAuthUser) {
        // User signed in - sync from cloud
        await syncFromCloud();
      }
    });

    return () => unsubscribe();
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

  const syncToCloud = async () => {
    if (!isSupabaseEnabled || !authUser) return;

    try {
      await storage.syncToCloud();
    } catch (error) {
      console.error('Sync to cloud error:', error);
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

  const signIn = async (email: string) => {
    return auth.signInWithEmail(email);
  };

  const signOut = async () => {
    await auth.signOut();
    setAuthUser(null);
  };

  const syncNow = async () => {
    if (authUser) {
      await syncFromCloud();
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authUser,
        template,
        todayEntry,
        streak,
        locale,
        t,
        syncStatus,
        isSupabaseEnabled,
        updateUser,
        updateTemplate,
        updateTodayEntry,
        refreshData,
        signIn,
        signOut,
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
