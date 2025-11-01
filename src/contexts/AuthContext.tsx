import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { showError } from '@/utils/toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Inicializando...');
    
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Sessão atual:', session ? 'Encontrada' : 'Não encontrada');
      
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    console.log('👤 Buscando perfil para user_id:', authUser.id);
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        throw error;
      }

      // Se o perfil não existe, tentar criar
      if (!profile) {
        console.warn('⚠️ Perfil não encontrado. Tentando criar...');
        return await createUserProfile(authUser);
      }

      console.log('✅ Perfil encontrado:', profile);

      // Mapear o perfil para o tipo User
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

      // Atualizar último login (não esperar)
      supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authUser.id)
        .then(() => console.log('✅ Último login atualizado'));

      return userData;

    } catch (error) {
      console.error('❌ Erro fatal ao buscar perfil:', error);
      showError('Erro ao carregar perfil do usuário');
      await supabase.auth.signOut();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    console.log('🔨 Criando perfil para user_id:', authUser.id);
    
    try {
      // Determinar role baseada no email
      const isAdmin = authUser.email === 'geral1atlontech@gmail.com';
      
      // Extrair nome dos metadados
      const userName = authUser.user_metadata?.name || 
                      authUser.user_metadata?.full_name || 
                      authUser.email?.split('@')[0] || 
                      'Novo Usuário';

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([{
          id: authUser.id,
          name: userName,
          email: authUser.email!,
          role: isAdmin ? 'admin' : 'student',
          profession: authUser.user_metadata?.profession || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar perfil:', error);
        throw error;
      }

      console.log('✅ Perfil criado com sucesso:', newProfile);

      // Mapear o novo perfil
      const userData: User = {
        id: newProfile.id,
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role as 'admin' | 'student',
        avatar: newProfile.avatar,
        profession: newProfile.profession,
        appPlan: newProfile.app_plan,
        appPurchaseDate: newProfile.app_purchase_date,
        xp: newProfile.xp || 0,
        level: newProfile.level || 1,
        streak: newProfile.streak || 0,
        createdAt: newProfile.created_at,
        lastLogin: newProfile.last_login,
      };
      
      setUser(userData);
      return userData;

    } catch (error) {
      console.error('❌ Erro fatal ao criar perfil:', error);
      showError('Não foi possível criar seu perfil. Entre em contato com o suporte.');
      await supabase.auth.signOut();
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    console.log('🔐 Tentando fazer login para:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('❌ Usuário não encontrado após login');
        throw new Error('Usuário não encontrado');
      }

      console.log('✅ Login no Supabase bem-sucedido');

      // Buscar perfil (com fallback de criação) e aguardar o resultado
      const userData = await fetchUserProfile(data.user);
      
      if (!userData) {
        throw new Error('Erro ao carregar perfil');
      }
      
      console.log('✅ Login completo! Usuário:', userData);
      return userData;

    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      throw error;
    }
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