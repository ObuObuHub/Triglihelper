import { supabase, isSupabaseConfigured } from './supabase';
import { User, ChecklistTemplate, DailyEntry } from './types';

const FIXED_USER_ID = 'fixed-user-id';

const isEnabled = () => isSupabaseConfigured() && supabase;

export const cloudStorage = {
  async syncUser(user: User): Promise<void> {
    if (!isEnabled()) return;

    await supabase!.from('profiles').upsert({
      id: FIXED_USER_ID,
      name: user.name,
      reminder_times: user.reminderTimes,
    });
  },

  async getUser(): Promise<User | null> {
    if (!isEnabled()) return null;

    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', FIXED_USER_ID)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name || '',
      reminderTimes: data.reminder_times || ['08:00', '13:00', '20:00'],
    };
  },

  async syncTemplate(template: ChecklistTemplate): Promise<void> {
    if (!isEnabled()) return;

    await supabase!.from('checklist_templates').upsert({
      user_id: FIXED_USER_ID,
      sections: template.sections,
    });
  },

  async getTemplate(): Promise<ChecklistTemplate | null> {
    if (!isEnabled()) return null;

    const { data, error } = await supabase!
      .from('checklist_templates')
      .select('*')
      .eq('user_id', FIXED_USER_ID)
      .single();

    if (error || !data) return null;

    return {
      sections: data.sections,
    };
  },

  async syncEntry(entry: DailyEntry): Promise<void> {
    if (!isEnabled()) return;

    await supabase!.from('daily_entries').upsert({
      user_id: FIXED_USER_ID,
      date: entry.date,
      sections: entry.sections,
      day_complete: entry.dayComplete,
    });
  },

  async getEntries(): Promise<DailyEntry[]> {
    if (!isEnabled()) return [];

    const { data, error } = await supabase!
      .from('daily_entries')
      .select('*')
      .eq('user_id', FIXED_USER_ID)
      .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map((entry) => ({
      date: entry.date,
      sections: entry.sections,
      dayComplete: entry.day_complete,
    }));
  },

  async getEntry(date: string): Promise<DailyEntry | null> {
    if (!isEnabled()) return null;

    const { data, error } = await supabase!
      .from('daily_entries')
      .select('*')
      .eq('user_id', FIXED_USER_ID)
      .eq('date', date)
      .single();

    if (error || !data) return null;

    return {
      date: data.date,
      sections: data.sections,
      dayComplete: data.day_complete,
    };
  },

  async deleteAllData(): Promise<void> {
    if (!isEnabled()) return;

    await Promise.all([
      supabase!.from('daily_entries').delete().eq('user_id', FIXED_USER_ID),
      supabase!.from('checklist_templates').delete().eq('user_id', FIXED_USER_ID),
    ]);
  },
};
