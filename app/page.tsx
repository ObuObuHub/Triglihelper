'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { getTodayDateString, createEmptyEntry, checkSectionComplete, checkDayComplete, calculateDailyScore } from '@/lib/utils';
import { DailyEntry } from '@/lib/types';
import { storage } from '@/lib/storage';
import { AchievementNotification } from '@/components/AchievementNotification';
import { calculateAchievementStats, checkNewAchievements, getStreakEmoji, getStreakMilestone, ACHIEVEMENTS } from '@/lib/achievements';

export default function TodayPage() {
  const { template, todayEntry, updateTodayEntry, t, streak } = useApp();
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);

  useEffect(() => {
    if (todayEntry) {
      setEntry(todayEntry);
    } else {
      const today = getTodayDateString();
      const newEntry = createEmptyEntry(today, template);
      setEntry(newEntry);
    }
  }, [todayEntry, template]);

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

    // Check for new achievements
    const entries = storage.getEntries();
    const streakData = storage.getStreak();
    const stats = calculateAchievementStats(entries, template, streakData.current, streakData.longest);
    const unlockedIds = storage.getUnlockedAchievements();
    const newAchievements = checkNewAchievements(stats, unlockedIds);

    if (newAchievements.length > 0) {
      const achievement = newAchievements[0];
      storage.unlockAchievement(achievement.id);
      setNewAchievement(achievement);
    }
  };

  if (!entry) return null;

  const dailyScore = calculateDailyScore(entry, template);
  const progressPercent = Math.round(dailyScore * 100);
  const streakEmoji = getStreakEmoji(streak.current);
  const streakMilestone = getStreakMilestone(streak.current);
  const isStreakAtRisk = dailyScore < 0.7 && streak.current > 0;

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      {newAchievement && (
        <AchievementNotification
          emoji={newAchievement.emoji}
          name={newAchievement.name}
          description={newAchievement.description}
          onClose={() => setNewAchievement(null)}
        />
      )}

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.today.title}</h1>
              {streak.current > 0 && (
                <div className="text-2xl">{streakEmoji}</div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            {/* Streak Info */}
            {streak.current > 0 && (
              <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Serie: {streak.current} zile la rând {streakEmoji}
                </p>
              </div>
            )}

            {/* Milestone Celebration */}
            {streakMilestone && (
              <div className="mt-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-3">
                <p className="text-sm font-bold text-white text-center">
                  🎉 {streakMilestone}
                </p>
              </div>
            )}

            {/* Streak At Risk Warning */}
            {isStreakAtRisk && (
              <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  ⚠️ Completează mai mult pentru a păstra seria!
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.today.progressLabel}
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    progressPercent >= 70 ? 'bg-emerald-500' : progressPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
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
