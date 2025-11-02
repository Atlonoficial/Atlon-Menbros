import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { showError } from '@/utils/toast';

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
    console.log('👤 Buscando perfil para user_id:', authUser.id);
    
    try {
      let profile = null;
      // Lógica de repetição para lidar com possível atraso de replicação após o gatilho de inscrição
      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (error) {
          console.error(`❌ Erro ao buscar perfil (tentativa ${i + 1}):`, error);
          throw error;
        }
        if (data) {
          profile = data;
          break;
        }
        // Esperar antes de tentar novamente
        if (i < 2) {
          console.warn(`⚠️ Perfil não encontrado (tentativa ${i + 1}). Tentando novamente em 500ms...`);
          await new Promise(res => setTimeout(res, 500));
        }
      }

      if (!profile) {
        console.error('❌ Perfil não encontrado após 3 tentativas. O gatilho pode ter falhado.');
        throw new Error('Não foi possível carregar os dados do seu perfil. Por favor, entre em contato com o suporte.');
      }

      console.log('✅ Perfil encontrado:', profile);

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
        .then(() => console.log('✅ Último login atualizado'));

      return userData;

    } catch (error) {
      console.error('❌ Erro fatal ao buscar/processar perfil:', error);
      showError((error as Error).message || 'Erro ao carregar perfil do usuário');
      await supabase.auth.signOut();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 AuthProvider: Inicializando...');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Sessão atual:', session ? 'Encontrada' : 'Não encontrada');
      
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log('🔐 Tentando fazer login para:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
    // onAuthStateChange irá lidar com o resto
  };

  const logout = async () => {
    console.log('👋 Fazendo logout...');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};