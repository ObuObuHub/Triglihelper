import { storage } from '../storage';
import { DailyEntry, ChecklistTemplate } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Helper to create a mock template
const mockTemplate: ChecklistTemplate = {
  sections: [
    {
      name: 'Activity',
      items: [
        { id: 'a1', label: 'Test Activity 1', required: true },
        { id: 'a2', label: 'Test Activity 2', required: true },
      ],
      minRequired: 2,
    },
    {
      name: 'Diet',
      items: [
        { id: 'd1', label: 'Test Diet 1', required: true },
        { id: 'd2', label: 'Test Diet 2', required: true },
      ],
      minRequired: 2,
    },
  ],
};

// Helper to create a completed entry
const createCompletedEntry = (date: string): DailyEntry => ({
  date,
  sections: [
    {
      sectionName: 'Activity',
      items: [
        { id: 'a1', checked: true },
        { id: 'a2', checked: true },
      ],
      sectionComplete: true,
    },
    {
      sectionName: 'Diet',
      items: [
        { id: 'd1', checked: true },
        { id: 'd2', checked: true },
      ],
      sectionComplete: true,
    },
  ],
  dayComplete: true,
});

// Helper to create a partial entry (below 70% threshold)
const createPartialEntry = (date: string): DailyEntry => ({
  date,
  sections: [
    {
      sectionName: 'Activity',
      items: [
        { id: 'a1', checked: true },
        { id: 'a2', checked: false },
      ],
      sectionComplete: false,
    },
    {
      sectionName: 'Diet',
      items: [
        { id: 'd1', checked: false },
        { id: 'd2', checked: false },
      ],
      sectionComplete: false,
    },
  ],
  dayComplete: false,
});

// Helper to get date string for relative days (0 = today, -1 = yesterday, etc.)
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

describe('storage.calculateStreak', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set a mock template
    storage.saveTemplate(mockTemplate);
  });

  test('Test 1: Empty entries returns zero streak', () => {
    const result = storage.calculateStreak([]);
    expect(result).toEqual({ current: 0, longest: 0 });
  });

  test('Test 2: Single day (today) returns current=1, longest=1', () => {
    const entries = [createCompletedEntry(getDateString(0))];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 1, longest: 1 });
  });

  test('Test 3: Single day (yesterday) returns current=1, longest=1', () => {
    const entries = [createCompletedEntry(getDateString(-1))];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 1, longest: 1 });
  });

  test('Test 4: Single day (2 days ago) returns current=0, longest=1', () => {
    const entries = [createCompletedEntry(getDateString(-2))];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 0, longest: 1 });
  });

  test('Test 5: Today + yesterday returns current=2, longest=2', () => {
    const entries = [
      createCompletedEntry(getDateString(0)),
      createCompletedEntry(getDateString(-1)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 2, longest: 2 });
  });

  test('Test 6: Consecutive 3 days ending today', () => {
    const entries = [
      createCompletedEntry(getDateString(0)),
      createCompletedEntry(getDateString(-1)),
      createCompletedEntry(getDateString(-2)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 3, longest: 3 });
  });

  test('Test 7: Gap in current streak - should stop at gap', () => {
    const entries = [
      createCompletedEntry(getDateString(0)),
      createCompletedEntry(getDateString(-1)),
      // Missing day -2
      createCompletedEntry(getDateString(-3)),
      createCompletedEntry(getDateString(-4)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 2, longest: 2 });
  });

  test('Test 8: Historical streak longer than current', () => {
    const entries = [
      createCompletedEntry(getDateString(0)), // Current streak: 1
      createCompletedEntry(getDateString(-5)), // Old streak: 3
      createCompletedEntry(getDateString(-6)),
      createCompletedEntry(getDateString(-7)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 1, longest: 3 });
  });

  test('Test 9: Perfect week (7 days)', () => {
    const entries = [
      createCompletedEntry(getDateString(0)),
      createCompletedEntry(getDateString(-1)),
      createCompletedEntry(getDateString(-2)),
      createCompletedEntry(getDateString(-3)),
      createCompletedEntry(getDateString(-4)),
      createCompletedEntry(getDateString(-5)),
      createCompletedEntry(getDateString(-6)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 7, longest: 7 });
  });

  test('Test 10: Partial completion (below 70%) does not count', () => {
    const entries = [
      createPartialEntry(getDateString(0)), // Only 25% complete
      createCompletedEntry(getDateString(-1)),
      createCompletedEntry(getDateString(-2)),
    ];
    const result = storage.calculateStreak(entries);
    // Today doesn't count (partial), but yesterday + day before do
    // Current streak is 2 (starts from yesterday since today doesn't qualify)
    // Longest streak is also 2
    expect(result).toEqual({ current: 2, longest: 2 });
  });

  test('Test 11: Multiple gaps with various streak lengths', () => {
    const entries = [
      createCompletedEntry(getDateString(0)),
      createCompletedEntry(getDateString(-1)),
      // Gap
      createCompletedEntry(getDateString(-5)),
      createCompletedEntry(getDateString(-6)),
      createCompletedEntry(getDateString(-7)),
      createCompletedEntry(getDateString(-8)),
      // Gap
      createCompletedEntry(getDateString(-12)),
      createCompletedEntry(getDateString(-13)),
    ];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 2, longest: 4 });
  });

  test('Test 12: Yesterday only (no entry today yet)', () => {
    const entries = [createCompletedEntry(getDateString(-1))];
    const result = storage.calculateStreak(entries);
    expect(result).toEqual({ current: 1, longest: 1 });
  });
});
