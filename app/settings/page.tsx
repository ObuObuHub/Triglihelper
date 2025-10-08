'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Navigation } from '@/components/Navigation';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const { t, user, updateUser, locale, authUser, signIn, signOut, syncNow, syncStatus, isSupabaseEnabled } = useApp();
  const [name, setName] = useState(user.name);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleSave = () => {
    updateUser({
      ...user,
      name,
    });
    alert(locale === 'ro' ? 'Salvat!' : 'Saved!');
  };

  const handleLanguageToggle = () => {
    updateUser({
      ...user,
      locale: locale === 'ro' ? 'en' : 'ro',
    });
  };

  const handleSignIn = async () => {
    if (!email) {
      setLoginMessage(locale === 'ro' ? 'Introdu adresa de email' : 'Enter email address');
      return;
    }

    const { error } = await signIn(email);

    if (error) {
      setLoginMessage(error);
    } else {
      setLoginMessage(
        locale === 'ro'
          ? 'Verifică email-ul! Ți-am trimis un link de autentificare.'
          : 'Check your email! We sent you a magic link.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowLoginModal(false);
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
                {locale === 'ro' ? 'Sincronizare Cloud' : 'Cloud Sync'}
              </h2>

              {authUser ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {locale === 'ro' ? 'Conectat' : 'Connected'}
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300">{authUser.email}</div>
                    </div>
                    <div className="text-2xl">✓</div>
                  </div>

                  {syncStatus.lastSyncedAt && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {locale === 'ro' ? 'Ultima sincronizare: ' : 'Last synced: '}
                      {new Date(syncStatus.lastSyncedAt).toLocaleTimeString(locale === 'ro' ? 'ro-RO' : 'en-US')}
                    </div>
                  )}

                  <button
                    onClick={syncNow}
                    disabled={syncStatus.isSyncing}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {syncStatus.isSyncing
                      ? locale === 'ro'
                        ? 'Sincronizare...'
                        : 'Syncing...'
                      : locale === 'ro'
                      ? 'Sincronizează Acum'
                      : 'Sync Now'}
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {locale === 'ro' ? 'Deconectare' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'ro'
                      ? 'Conectează-te pentru a sincroniza datele între dispozitive.'
                      : 'Sign in to sync your data across devices.'}
                  </p>

                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    {locale === 'ro' ? 'Conectează-te' : 'Sign In'}
                  </button>
                </div>
              )}
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
                  placeholder={locale === 'ro' ? 'Numele tău' : 'Your name'}
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
            TriglyCoach v2.0.0
            <br />
            {locale === 'ro' ? 'Made with ❤️' : 'Făcut cu ❤️'}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {locale === 'ro' ? 'Conectează-te' : 'Sign In'}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ro'
                ? 'Introduce adresa ta de email. Îți vom trimite un link magic de autentificare.'
                : 'Enter your email address. We\'ll send you a magic link to sign in.'}
            </p>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="email@example.com"
              />

              {loginMessage && (
                <div
                  className={`text-sm p-3 rounded-lg ${
                    loginMessage.includes('email')
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {loginMessage}
                </div>
              )}

              <button
                onClick={handleSignIn}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {locale === 'ro' ? 'Trimite Link' : 'Send Magic Link'}
              </button>

              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginMessage('');
                  setEmail('');
                }}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {t.settings.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

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
