import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Enrollment } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useUserEnrollments = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;
      
      return data.map(enrollment => ({
        id: enrollment.id,
        userId: enrollment.user_id,
        courseId: enrollment.course_id,
        enrolledAt: enrollment.enrolled_at,
        expiresAt: enrollment.expires_at,
        status: enrollment.status as 'active' | 'expired' | 'cancelled',
        paymentStatus: enrollment.payment_status as 'pending' | 'paid' | 'free'
      })) as Enrollment[];
    },
    enabled: !!userId,
  });
};

export const useIsEnrolled = (userId: string | undefined, courseId: string | undefined) => {
  return useQuery({
    queryKey: ['enrollment', userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return false;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!courseId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['enrollments', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', variables.userId, variables.courseId] });
      showSuccess('Matrícula realizada com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao realizar matrícula');
    },
  });
};