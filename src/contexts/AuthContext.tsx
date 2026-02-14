import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('🔐 Attempting signup for:', email);
      
      // Use Supabase client directly to create user (no server endpoint needed)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/my-blooms`,
        },
      });

      if (error) {
        console.error('❌ Signup failed:', error.message);
        return { error: error.message };
      }

      if (!data.user) {
        console.error('❌ No user data returned from signup');
        return { error: 'Failed to create account - no user data returned' };
      }

      console.log('✅ Account created successfully!')
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('📧 Email confirmation required');
        return { error: 'CONFIRMATION_REQUIRED' }; // Special error code
      }
      
      // Note: User is automatically signed in after signup with Supabase
      // The AuthContext will handle the session update via onAuthStateChange
      
      return {};
    } catch (error) {
      console.error('❌ Signup exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      return { error: `Failed to create account: ${errorMessage}` };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}