'use client';

import { Navigation } from '@/components/Navigation';

export default function GhidPage() {
  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ghid</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Cum aleg, cum gătesc</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Regula farfuriei */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              Regula farfuriei
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold">½</span> legume →{' '}
              <span className="font-semibold">¼</span> proteine slabe (pește/pui/leguminoase) →{' '}
              <span className="font-semibold">¼</span> cereale integrale
            </p>
          </div>

          {/* Schimburi rapide */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              Schimburi rapide
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>• Suc → apă/ceai</p>
              <p>• Pâine albă → integrală</p>
              <p>• Prăjit → cuptor sau abur (Airfryer)</p>
              <p>• Smântână/unt → ulei de măsline puțin</p>
              <p>• Desert → iaurt slab + fructe</p>
            </div>
          </div>

          {/* Etichetă */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              Evită
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>• Zahăr/sirop</p>
              <p>• &ldquo;Făină de grâu&rdquo; fără &ldquo;integral&rdquo;</p>
              <p>• Ulei (parțial) hidrogenat/margarină</p>
            </div>
          </div>

          {/* Pește gras */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              Pește gras
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Țintește <span className="font-semibold">2–3 mese/săpt</span> (somon, macrou, sardine) sau suplimentează cu leguminoase în zilele fără pește.
            </p>
          </div>

          {/* Porții pe scurt */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              Porții pe scurt
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>• <span className="font-semibold">Legume:</span> 1 porție = 1 cană crud / ½ cană gătit</p>
              <p>• <span className="font-semibold">Fructe:</span> 1 porție = 1 bucată mică</p>
              <p>• <span className="font-semibold">Integrale:</span> 1 porție = ½ cană gătit sau 1 felie pâine</p>
              <p>• <span className="font-semibold">Nuci/semințe:</span> 30 g (chia măcinată – 1 lingură)</p>
            </div>
          </div>

        </div>
      </div>

      <Navigation />
    </div>
  );
}
