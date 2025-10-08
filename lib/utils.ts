import { DailyEntry, DailySection, ChecklistTemplate } from './types';
import { DEFAULT_TARGETS } from './defaults';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDate(new Date());
}

export function createEmptyEntry(date: string, template: ChecklistTemplate): DailyEntry {
  return {
    date,
    sections: template.sections.map((section) => ({
      sectionName: section.name,
      items: section.items.map((item) => ({
        id: item.id,
        checked: false,
      })),
      sectionComplete: false,
    })),
    dayComplete: false,
    fiber: { value: 0, target: DEFAULT_TARGETS.fiber },
    water: { value: 0, target: DEFAULT_TARGETS.water },
    notes: '',
  };
}

export function checkSectionComplete(section: DailySection, template: ChecklistTemplate): boolean {
  const templateSection = template.sections.find((s) => s.name === section.sectionName);
  if (!templateSection) return false;

  const checkedCount = section.items.filter((item) => item.checked).length;
  const minRequired = templateSection.minRequired || templateSection.items.filter((i) => i.required).length;

  return checkedCount >= minRequired;
}

export function calculateDailyScore(entry: DailyEntry, template: ChecklistTemplate): number {
  // Count total checkable items
  const allItems = template.sections.flatMap(s => s.items);
  const totalItems = allItems.length;

  // Count checked items
  const checkedCount = entry.sections.reduce((sum, section) => {
    return sum + section.items.filter(i => i.checked).length;
  }, 0);

  // Check numeric targets (2 additional points)
  const fiberMet = (entry.fiber?.value ?? 0) >= (entry.fiber?.target ?? DEFAULT_TARGETS.fiber) ? 1 : 0;
  const waterMet = (entry.water?.value ?? 0) >= (entry.water?.target ?? DEFAULT_TARGETS.water) ? 1 : 0;

  // Calculate score as (checked + targets met) / (total + 2)
  const maxPoints = totalItems + 2;
  const earnedPoints = checkedCount + fiberMet + waterMet;

  return earnedPoints / maxPoints;
}

export function checkDayComplete(entry: DailyEntry, template: ChecklistTemplate): boolean {
  const score = calculateDailyScore(entry, template);
  return score >= 0.8; // 80% threshold
}

export function calculateCompletionRate(entries: DailyEntry[], days: number): number {
  const recentEntries = entries.slice(0, days);
  if (recentEntries.length === 0) return 0;

  const completed = recentEntries.filter((e) => e.dayComplete).length;
  return Math.round((completed / recentEntries.length) * 100);
}

export function calculateSectionCompletionRate(entries: DailyEntry[], sectionName: string, days: number): number {
  const recentEntries = entries.slice(0, days);
  if (recentEntries.length === 0) return 0;

  const completed = recentEntries.filter((e) => {
    const section = e.sections.find((s) => s.sectionName === sectionName);
    return section?.sectionComplete;
  }).length;

  return Math.round((completed / recentEntries.length) * 100);
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
