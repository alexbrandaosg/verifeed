import React, { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';

interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

interface Session {
  access_token: string;
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = () => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const model = pb.authStore.model;
      setUser(model as unknown as User);
      setSession({ access_token: pb.authStore.token });
      setProfile({
        id: model.id,
        user_id: model.id, // PocketBase users servem como profile
        username: model.username || '',
        is_admin: model.is_admin || false,
        created_at: model.created,
        updated_at: model.updated,
      });
    } else {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    updateAuthState();
    
    // PocketBase listener
    const unsubscribe = pb.authStore.onChange(() => {
      updateAuthState();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      return { error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        username,
      });
      // Auth after register
      await pb.collection('users').authWithPassword(email, password);
      return { error: null };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return { error };
    }
  };

  const signOut = async () => {
    pb.authStore.clear();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signOut,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
