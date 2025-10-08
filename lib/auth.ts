import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from './types';

export const auth = {
  async signInWithEmail(email: string): Promise<{ error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: 'Supabase not configured' };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
    };
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured() || !supabase) {
      callback(null);
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
        });
      } else {
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  },
};
