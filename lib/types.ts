export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
}

export interface ChecklistSection {
  name: string;
  items: ChecklistItem[];
  minRequired?: number;
}

export interface ChecklistTemplate {
  sections: ChecklistSection[];
}

export interface CheckedItem {
  id: string;
  checked: boolean;
  timestamp?: string;
}

export interface DailySection {
  sectionName: string;
  items: CheckedItem[];
  sectionComplete: boolean;
}

export interface DailyEntry {
  date: string;
  sections: DailySection[];
  dayComplete: boolean;
  notes?: string;
}

export interface Streak {
  current: number;
  longest: number;
}

export interface AppData {
  template: ChecklistTemplate;
  entries: DailyEntry[];
  streak: Streak;
  unlockedAchievements: string[];
}
