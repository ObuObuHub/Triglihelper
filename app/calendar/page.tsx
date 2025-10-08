'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { DailyEntry } from '@/lib/types';

export default function CalendarPage() {
  const { t } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
    setEntries(storage.getEntries());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEntryStatus = (dateStr: string): 'completed' | 'partial' | 'missed' => {
    const entry = entries.find((e) => e.date === dateStr);
    if (!entry) return 'missed';
    if (entry.dayComplete) return 'completed';
    const hasAnyChecked = entry.sections.some((s) => s.items.some((i) => i.checked));
    return hasAnyChecked ? 'partial' : 'missed';
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entries.find((e) => e.date === dateStr);
    setSelectedEntry(entry || null);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.calendar.title}</h1>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="flex justify-around text-xs mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t.calendar.completed}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t.calendar.partial}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t.calendar.missed}</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const status = getEntryStatus(dateStr);
                const isToday =
                  new Date().toISOString().split('T')[0] === dateStr;

                const statusColors = {
                  completed: 'bg-emerald-500',
                  partial: 'bg-amber-500',
                  missed: 'bg-transparent',
                };

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative ${
                      isToday ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                    } ${
                      status === 'missed'
                        ? 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'text-white'
                    } ${statusColors[status]}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedEntry && (
          <div className="p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {new Date(selectedEntry.date).toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="space-y-3">
                {selectedEntry.sections.map((section) => (
                  <div key={section.sectionName} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{section.sectionName}</span>
                    {section.sectionComplete ? (
                      <span className="text-emerald-500">✅</span>
                    ) : (
                      <span className="text-gray-400">⭕</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
