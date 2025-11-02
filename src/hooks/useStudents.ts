import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'student',
        avatar: profile.avatar,
        profession: profile.profession,
        appPlan: profile.app_plan,
        appPurchaseDate: profile.app_purchase_date,
        xp: profile.xp || 0,
        level: profile.level || 1,
        streak: profile.streak || 0,
        createdAt: profile.created_at,
        lastLogin: profile.last_login,
      })) as User[];
    },
  });
};

export const useStudentProgress = (userId: string) => {
  return useQuery({
    queryKey: ['student-progress', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select(`
          *,
          courses!student_progress_course_id_fkey(title, cover_image)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useStudentEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['student-enrollments', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses!enrollments_course_id_fkey(title, cover_image, category)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      // Verificar se já está matriculado
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) {
        throw new Error('Aluno já está matriculado neste curso');
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert([{
          user_id: userId,
          course_id: courseId,
          status: 'active',
          payment_status: 'free'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showSuccess('Aluno matriculado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao matricular aluno');
    },
  });
};

export const useUnenrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, userId }: { enrollmentId: string; userId: string }) => {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;
      return { userId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showSuccess('Matrícula removida com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao remover matrícula');
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<User> & { id: string }) => {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          profession: data.profession,
          app_plan: data.appPlan,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showSuccess('Aluno atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao atualizar aluno');
    },
  });
};