'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { calculateCompletionRate, calculateSectionCompletionRate, calculateDailyScore } from '@/lib/utils';
import { DailyEntry } from '@/lib/types';

export default function StatsPage() {
  const { t, streak, template } = useApp();
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  const loadEntries = () => {
    setEntries(storage.getEntries());
  };

  useEffect(() => {
    loadEntries();

    // Reload entries when window/tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadEntries();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadEntries);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadEntries);
    };
  }, []);

  const last7DaysRate = calculateCompletionRate(entries, 7);
  const last30DaysRate = calculateCompletionRate(entries, 30);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.stats.title}</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Streaks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">{streak.current}</div>
              <div className="text-sm opacity-90">{t.stats.currentStreak}</div>
              <div className="text-xs opacity-75 mt-1">{t.stats.days}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-4xl font-bold mb-2">{streak.longest}</div>
              <div className="text-sm opacity-90">{t.stats.longestStreak}</div>
              <div className="text-xs opacity-75 mt-1">{t.stats.days}</div>
            </div>
          </div>

          {/* Completion Rates */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.stats.completionRate}</h2>

            <div className="space-y-4">
              {/* Last 7 Days */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.stats.last7Days}</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{last7DaysRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${last7DaysRate}%` }}
                  />
                </div>
              </div>

              {/* Last 30 Days */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.stats.last30Days}</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{last30DaysRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${last30DaysRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 14-Day History */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.stats.last14Days}</h2>
            {entries.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.stats.noHistory}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {entries.slice(0, 14).map((entry) => {
                  const score = calculateDailyScore(entry, template);
                  const scorePercent = Math.round(score * 100);
                  return (
                    <div
                      key={entry.date}
                      className={`px-3 py-2 rounded-xl text-sm border ${
                        score >= 0.7
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                          : score >= 0.5
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      }`}
                    >
                      <span className="font-mono text-gray-900 dark:text-gray-100">{entry.date}</span>{' '}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{scorePercent}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section Completion */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.stats.sectionCompletion}</h2>

            <div className="space-y-4">
              {template.sections.map((section) => {
                const rate30 = calculateSectionCompletionRate(entries, section.name, 30);

                return (
                  <div key={section.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{section.name}</span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{rate30}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          section.name === 'Activitate'
                            ? 'bg-blue-500'
                            : section.name === 'Dietă'
                            ? 'bg-green-500'
                            : section.name === 'Medicație'
                            ? 'bg-purple-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${rate30}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.stats.last7Days}</h2>

            <div className="flex items-end justify-between h-32 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split('T')[0];
                const entry = entries.find((e) => e.date === dateStr);

                const completedSections = entry?.sections.filter((s) => s.sectionComplete).length || 0;
                const totalSections = template.sections.length;
                const height = (completedSections / totalSections) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden flex-1 flex items-end">
                      <div
                        className={`w-full transition-all duration-500 rounded-t-lg ${
                          height === 100
                            ? 'bg-emerald-500'
                            : height > 0
                            ? 'bg-amber-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ height: `${height || 10}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {date.toLocaleDateString('ro-RO', { weekday: 'short' })[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{entries.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t.stats.totalDaysRecorded}</div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
