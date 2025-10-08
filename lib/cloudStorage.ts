import { supabase, isSupabaseConfigured } from './supabase';
import { User, ChecklistTemplate, DailyEntry } from './types';

export const cloudStorage = {
  async syncUser(user: User): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;

    await supabase.from('profiles').upsert({
      id: authUser.id,
      name: user.name,
      locale: user.locale,
      reminder_times: user.reminderTimes,
      disclaimer_accepted: user.disclaimerAccepted,
    });
  },

  async getUser(): Promise<User | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name || '',
      locale: data.locale || 'ro',
      reminderTimes: data.reminder_times || ['08:00', '13:00', '20:00'],
      disclaimerAccepted: data.disclaimer_accepted || false,
    };
  },

  async syncTemplate(template: ChecklistTemplate): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('checklist_templates').upsert({
      user_id: user.id,
      sections: template.sections,
    });
  },

  async getTemplate(): Promise<ChecklistTemplate | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      sections: data.sections,
    };
  },

  async syncEntry(entry: DailyEntry): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('daily_entries').upsert({
      user_id: user.id,
      date: entry.date,
      sections: entry.sections,
      day_complete: entry.dayComplete,
    });
  },

  async getEntries(): Promise<DailyEntry[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map((entry) => ({
      date: entry.date,
      sections: entry.sections,
      dayComplete: entry.day_complete,
    }));
  },

  async getEntry(date: string): Promise<DailyEntry | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
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
    if (!isSupabaseConfigured() || !supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await Promise.all([
      supabase.from('daily_entries').delete().eq('user_id', user.id),
      supabase.from('checklist_templates').delete().eq('user_id', user.id),
    ]);
  },
};
