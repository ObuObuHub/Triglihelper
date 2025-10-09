import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from './types';

const isEnabled = () => isSupabaseConfigured() && supabase;

export const auth = {
  async signInWithEmail(email: string): Promise<{ error?: string }> {
    if (!isEnabled()) {
      return { error: 'Supabase not configured' };
    }

    const { error } = await supabase!.auth.signInWithOtp({
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
    if (!isEnabled()) return;
    await supabase!.auth.signOut();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isEnabled()) return null;

    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
    };
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isEnabled()) {
      callback(null);
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
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
