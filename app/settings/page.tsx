'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const { t } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
          {/* Local Storage Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
              ⚠️ Atenționare
            </h2>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Aplicația folosește local storage. Datele sunt salvate doar pe acest dispozitiv și pot fi șterse dacă ștergi istoricul browserului.
            </p>
          </div>

          {/* Clear Data */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Date</h2>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {t.settings.clearData}
            </button>
          </div>

          {/* App Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            {t.settings.appVersion}
            <br />
            {t.settings.madeWith}
          </div>
        </div>
      </div>

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.settings.confirmTitle}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.settings.clearConfirm}</p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                ⚠️ Toate datele vor fi șterse permanent și nu pot fi recuperate!
              </p>
            </div>
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
                {t.settings.deleteButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
