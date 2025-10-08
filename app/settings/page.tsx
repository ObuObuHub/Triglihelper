'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const { t, user, updateUser, locale } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    updateUser({
      ...user,
      name,
      email: email || undefined,
    });
    alert(locale === 'ro' ? 'Salvat!' : 'Saved!');
  };

  const handleLanguageToggle = () => {
    updateUser({
      ...user,
      locale: locale === 'ro' ? 'en' : 'ro',
    });
  };

  const handleExportCSV = () => {
    const entries = storage.getEntries();
    const csvHeaders = 'Date,Activity,Diet,Medication,Complete\n';
    const csvRows = entries
      .map((entry) => {
        const activity = entry.sections.find((s) => s.sectionName === 'Activity')?.sectionComplete ? '✓' : '✗';
        const diet = entry.sections.find((s) => s.sectionName === 'Diet')?.sectionComplete ? '✓' : '✗';
        const medication = entry.sections.find((s) => s.sectionName === 'Medication')?.sectionComplete ? '✓' : '✗';
        const complete = entry.dayComplete ? '✓' : '✗';
        return `${entry.date},${activity},${diet},${medication},${complete}`;
      })
      .join('\n');

    const csv = csvHeaders + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `triglycoach-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    storage.clearData();
    window.location.reload();
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.settings.title}</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.settings.profile}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.settings.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={locale === 'ro' ? 'Numele tău' : 'Your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.settings.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {t.settings.save}
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.settings.language}</h2>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                {locale === 'ro' ? 'Română' : 'English'}
              </span>
              <button
                onClick={handleLanguageToggle}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-2 rounded-lg font-medium text-gray-900 dark:text-white transition-colors"
              >
                {locale === 'ro' ? 'EN' : 'RO'}
              </button>
            </div>
          </div>

          {/* Export/Import */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.settings.exportData}</h2>

            <button
              onClick={handleExportCSV}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {t.settings.exportCSV}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.settings.disclaimer}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Clear Data */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {t.settings.clearData}
            </button>
          </div>

          {/* App Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            TriglyCoach v1.0.0
            <br />
            {locale === 'ro' ? 'Made with ❤️' : 'Făcut cu ❤️'}
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.disclaimer.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{t.disclaimer.content}</p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {locale === 'ro' ? 'Închide' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {locale === 'ro' ? 'Confirmare' : 'Confirm'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{t.settings.clearConfirm}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {t.settings.cancel}
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {locale === 'ro' ? 'Șterge' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
