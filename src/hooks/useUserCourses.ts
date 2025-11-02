import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types';

export const useUserCourses = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-courses', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase.rpc('get_user_courses', {
        user_id_param: userId,
      });

      if (error) {
        console.error("Erro ao buscar cursos do usuário:", error);
        throw error;
      }
      return data as Course[];
    },
    enabled: !!userId,
  });
};