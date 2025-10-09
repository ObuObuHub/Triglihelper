'use client';

import { useEffect, useState } from 'react';

interface AchievementNotificationProps {
  emoji: string;
  name: string;
  description: string;
  onClose: () => void;
}

export function AchievementNotification({
  emoji,
  name,
  description,
  onClose,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-2xl p-6 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-6xl mb-3 animate-bounce">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Realizare Deblocată!</h2>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
