import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { showError } from '@/utils/toast';
import { FullScreenLoader } from '@/components/FullScreenLoader';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Este useEffect reage a mudanças na sessão para buscar o perfil do usuário.
  useEffect(() => {
    const fetchUserProfile = async (authUser: SupabaseUser) => {
      console.log(`[Auth] Sessão ativa. Buscando perfil para user_id: ${authUser.id}`);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[Auth] Erro ao buscar perfil:', error);
        showError('Erro ao carregar seu perfil.');
        setUser(null);
      } else if (profile) {
        console.log('[Auth] ✅ Perfil encontrado:', profile);
        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as 'admin' | 'student',
          avatar: profile.avatar,
          profession: profile.profession,
          appPlan: profile.app_plan,
          appPurchaseDate: profile.app_purchase_date,
          xp: profile.xp,
          level: profile.level,
          streak: profile.streak,
          createdAt: profile.created_at,
          lastLogin: profile.last_login,
        };
        setUser(userData);
        // Atualiza o último login silenciosamente
        supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authUser.id)
          .then();
      } else {
        console.warn('[Auth] ⚠️ Perfil não encontrado para usuário autenticado. Isso pode acontecer brevemente após o cadastro.');
        setUser(null);
      }
    };

    if (session?.user) {
      fetchUserProfile(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  // Este useEffect lida com o estado de autenticação inicial e escuta por mudanças.
  useEffect(() => {
    // Pega a sessão inicial uma única vez para remover a tela de carregamento.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Ponto crítico: garante que o loading sempre termine.
      console.log('[Auth] Verificação inicial da sessão concluída.');
    });

    // Escuta por futuras mudanças no estado de autenticação (login/logout).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`[Auth] Evento de autenticação recebido: ${_event}`);
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      console.log('[Auth] Inscrição de autenticação removida.');
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isAuthenticated: !!user, loading }}>
      {loading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};