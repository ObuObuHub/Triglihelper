'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { getTodayDateString, createEmptyEntry, checkSectionComplete, checkDayComplete, calculateDailyScore } from '@/lib/utils';
import { DailyEntry } from '@/lib/types';

export default function TodayPage() {
  const { template, todayEntry, updateTodayEntry, t } = useApp();
  const [entry, setEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
    if (todayEntry) {
      setEntry(todayEntry);
    } else {
      const today = getTodayDateString();
      const newEntry = createEmptyEntry(today, template);
      setEntry(newEntry);
      updateTodayEntry(newEntry);
    }
  }, [todayEntry, template, updateTodayEntry]);

  const handleToggleItem = (sectionName: string, itemId: string) => {
    if (!entry) return;

    const newEntry = { ...entry };
    const section = newEntry.sections.find((s) => s.sectionName === sectionName);
    if (!section) return;

    const item = section.items.find((i) => i.id === itemId);
    if (!item) return;

    item.checked = !item.checked;
    item.timestamp = item.checked ? new Date().toISOString() : undefined;

    section.sectionComplete = checkSectionComplete(section, template);

    newEntry.dayComplete = checkDayComplete(newEntry, template);

    setEntry(newEntry);
    updateTodayEntry(newEntry);
  };

  if (!entry) return null;

  const dailyScore = calculateDailyScore(entry, template);
  const progressPercent = Math.round(dailyScore * 100);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.today.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progres zilnic
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    progressPercent >= 80 ? 'bg-emerald-500' : progressPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-4 space-y-4">
          {entry.sections.map((section) => {
            const templateSection = template.sections.find((s) => s.name === section.sectionName);
            if (!templateSection) return null;

            return (
              <div
                key={section.sectionName}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{templateSection.name}</h2>
                  {section.sectionComplete && (
                    <span className="text-2xl">✅</span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  {section.items.map((item) => {
                    const templateItem = templateSection.items.find((ti) => ti.id === item.id);
                    if (!templateItem) return null;

                    return (
                      <label
                        key={item.id}
                        className="flex items-start space-x-3 cursor-pointer tap-highlight-none group"
                      >
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggleItem(section.sectionName, item.id)}
                            className="w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-600 text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer appearance-none checked:bg-emerald-500 checked:border-emerald-500"
                          />
                          {item.checked && (
                            <svg
                              className="absolute top-0 left-0 w-6 h-6 text-white pointer-events-none checkbox-bounce"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 text-base ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'} group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}>
                          {templateItem.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* All Done Message */}
          {entry.dayComplete && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-center shadow-lg">
              <p className="text-2xl font-bold text-white">{t.today.allDone}</p>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
