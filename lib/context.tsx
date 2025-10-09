'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyEntry, ChecklistTemplate, Streak } from './types';
import { storage } from './storage';
import { useTranslation } from './translations';

interface AppContextType {
  template: ChecklistTemplate;
  todayEntry: DailyEntry | null;
  streak: Streak;
  t: ReturnType<typeof useTranslation>;
  updateTemplate: (template: ChecklistTemplate) => void;
  updateTodayEntry: (entry: DailyEntry) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<ChecklistTemplate>(() => storage.getTemplate());
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [streak, setStreak] = useState<Streak>(() => storage.getStreak());
  const t = useTranslation();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const templateData = storage.getTemplate();
    const streakData = storage.getStreak();

    setTemplate(templateData);
    setStreak(streakData);

    const today = new Date().toISOString().split('T')[0];
    const entry = storage.getEntry(today);
    setTodayEntry(entry || null);
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
        template,
        todayEntry,
        streak,
        t,
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
