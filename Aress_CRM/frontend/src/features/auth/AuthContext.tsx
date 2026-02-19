import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from './auth.types';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureUserProfile = useCallback(async (profile: User) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert(
          {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.warn('Failed to upsert user profile:', error.message);
      }
    } catch (error) {
      console.warn('Failed to upsert user profile');
    }
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userRole = session.user.email === 'admin@gmail.com' ? 'admin' : (session.user.user_metadata.role || 'sales_rep');
        const nextUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.email!,
          role: userRole,
          createdAt: session.user.created_at,
        };
        setUser(nextUser);
        void ensureUserProfile(nextUser);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.email === 'admin@gmail.com' ? 'admin' : (session.user.user_metadata.role || 'sales_rep');
        const nextUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.email!,
          role: userRole,
          createdAt: session.user.created_at,
        };
        setUser(nextUser);
        void ensureUserProfile(nextUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        const userRole = data.user.email === 'admin@gmail.com' ? 'admin' : (data.user.user_metadata.role || 'sales_rep');
        const nextUser: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || data.user.email!,
          role: userRole,
          createdAt: data.user.created_at,
        };
        setUser(nextUser);
        void ensureUserProfile(nextUser);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        const userRole = authData.user.email === 'admin@gmail.com' ? 'admin' : (data.role || 'sales_rep');
        const nextUser: User = {
          id: authData.user.id,
          email: authData.user.email!,
          name: data.name,
          role: userRole,
          createdAt: authData.user.created_at,
        };
        setUser(nextUser);
        void ensureUserProfile(nextUser);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Email already exists' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: { name: string; email: string }) => {
      if (!user) return { success: false, error: 'Not authenticated' };
      
      try {
        const { error } = await supabase.auth.updateUser({
          email: data.email,
          data: { name: data.name },
        });

        if (error) throw error;

        setUser({ ...user, name: data.name, email: data.email });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update profile' };
      }
    },
    [user]
  );

  const updatePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      if (!user) return { success: false, error: 'Not authenticated' };
      
      try {
        const { error } = await supabase.auth.updateUser({
          password: data.newPassword,
        });

        if (error) throw error;

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update password' };
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
