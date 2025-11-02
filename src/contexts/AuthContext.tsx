import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { showError } from '@/utils/toast';
import { FullScreenLoader } from '@/components/FullScreenLoader';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    console.log(`[Auth] Iniciando busca de perfil para user_id: ${authUser.id}`);
    
    const MAX_RETRIES = 4;
    const RETRY_DELAY = 750;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        console.log(`[Auth] ✅ Perfil encontrado na tentativa ${attempt}.`, profile);
        
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

        supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authUser.id)
          .then(({ error: updateError }) => {
            if (updateError) console.error('[Auth] Erro ao atualizar último login:', updateError);
            else console.log('[Auth] ✅ Último login atualizado.');
          });

        return userData;
      }

      if (error && error.code !== 'PGRST116') {
        console.error(`[Auth] Erro inesperado na busca (tentativa ${attempt}):`, error);
        showError('Ocorreu um erro inesperado ao carregar seu perfil.');
        await supabase.auth.signOut();
        setUser(null);
        return null;
      }

      if (attempt < MAX_RETRIES) {
        console.warn(`[Auth] ⚠️ Perfil não encontrado na tentativa ${attempt}. Tentando novamente em ${RETRY_DELAY}ms...`);
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      }
    }

    console.error(`[Auth] ❌ Perfil não encontrado após ${MAX_RETRIES} tentativas.`);
    showError('Não foi possível carregar os dados do seu perfil. Por favor, tente novamente ou entre em contato com o suporte.');
    await supabase.auth.signOut();
    setUser(null);
    return null;
  };

  useEffect(() => {
    setLoading(true);
    console.log('[Auth] AuthProvider montado. Aguardando onAuthStateChange...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Auth] Evento recebido: ${event}`);

      // Este evento é a nossa fonte de verdade para o estado inicial.
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('[Auth] Sessão inicial encontrada. Buscando perfil...');
          await fetchUserProfile(session.user);
        } else {
          console.log('[Auth] Nenhuma sessão inicial. Usuário deslogado.');
          setUser(null);
        }
        // Esta é a correção crucial: garantimos que o loading termine após a verificação inicial.
        setLoading(false);
      } 
      else if (event === 'SIGNED_IN') {
        if (session?.user) {
          console.log('[Auth] Usuário logado. Buscando perfil...');
          await fetchUserProfile(session.user);
        }
      } 
      else if (event === 'SIGNED_OUT') {
        console.log('[Auth] Usuário deslogado.');
        setUser(null);
      }
    });

    return () => {
      console.log('[Auth] Desmontando AuthProvider e cancelando inscrição.');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log(`[Auth] Tentando login para: ${email}`);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] Erro no login:', error);
      throw error;
    }
    // onAuthStateChange irá lidar com a atualização do estado do usuário.
  };

  const logout = async () => {
    console.log('[Auth] Fazendo logout...');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
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