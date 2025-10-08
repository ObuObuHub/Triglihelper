'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const { t } = useApp();

  const routes = [
    { path: '/', label: t.nav.today, icon: '📋' },
    { path: '/calendar', label: t.nav.calendar, icon: '📅' },
    { path: '/stats', label: t.nav.stats, icon: '📊' },
    { path: '/settings', label: t.nav.settings, icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full tap-highlight-none transition-colors',
                  isActive
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <span className="text-2xl mb-1">{route.icon}</span>
                <span className="text-xs font-medium">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
