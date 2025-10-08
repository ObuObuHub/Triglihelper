'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const { t, user, updateUser, syncNow, syncStatus, isSupabaseEnabled } = useApp();
  const [name, setName] = useState(user.name);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    updateUser({
      ...user,
      name,
    });
    alert('Salvat!');
  };

  const handleClearData = async () => {
    await storage.clearData();
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
          {/* Cloud Sync Section */}
          {isSupabaseEnabled && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Sincronizare Cloud
              </h2>

              <div className="space-y-4">
                {syncStatus.lastSyncedAt && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    Ultima sincronizare: {new Date(syncStatus.lastSyncedAt).toLocaleTimeString('ro-RO')}
                  </div>
                )}

                <button
                  onClick={syncNow}
                  disabled={syncStatus.isSyncing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {syncStatus.isSyncing ? 'Sincronizare...' : 'Sincronizează Acum'}
                </button>
              </div>
            </div>
          )}

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
                  placeholder="Numele tău"
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
            TriglyCoach v2.0.0
            <br />
            Made with ❤️
          </div>
        </div>
      </div>

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirmare
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
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
