interface AchievementBadgeProps {
  emoji: string;
  name: string;
  description: string;
  unlocked: boolean;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'special';
}

export function AchievementBadge({ emoji, name, description, unlocked, tier }: AchievementBadgeProps) {
  const tierColors = {
    beginner: 'from-gray-400 to-gray-500',
    intermediate: 'from-blue-400 to-blue-600',
    advanced: 'from-purple-400 to-purple-600',
    special: 'from-amber-400 to-orange-500',
  };

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all ${
        unlocked
          ? `bg-gradient-to-br ${tierColors[tier]} shadow-lg`
          : 'bg-gray-200 dark:bg-gray-700 opacity-50'
      }`}
    >
      <div className="text-center">
        <div className={`text-4xl mb-2 ${!unlocked ? 'grayscale' : ''}`}>{emoji}</div>
        <h3
          className={`text-sm font-bold mb-1 ${
            unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {name}
        </h3>
        <p
          className={`text-xs ${
            unlocked ? 'text-white/90' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {description}
        </p>
      </div>
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">🔒</div>
        </div>
      )}
    </div>
  );
}
