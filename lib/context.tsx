'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DailyEntry, ChecklistTemplate, Streak } from './types';
import { storage } from './storage';
import { useTranslation, Locale } from './translations';

interface AppContextType {
  user: User;
  template: ChecklistTemplate;
  todayEntry: DailyEntry | null;
  streak: Streak;
  locale: Locale;
  t: ReturnType<typeof useTranslation>;
  updateUser: (user: User) => void;
  updateTemplate: (template: ChecklistTemplate) => void;
  updateTodayEntry: (entry: DailyEntry) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => storage.getUser());
  const [template, setTemplate] = useState<ChecklistTemplate>(() => storage.getTemplate());
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [streak, setStreak] = useState<Streak>(() => storage.getStreak());
  const locale = user.locale || 'ro';
  const t = useTranslation(locale);

  useEffect(() => {
    refreshData();
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

  return (
    <AppContext.Provider
      value={{
        user,
        template,
        todayEntry,
        streak,
        locale,
        t,
        updateUser,
        updateTemplate,
        updateTodayEntry,
        refreshData,
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
