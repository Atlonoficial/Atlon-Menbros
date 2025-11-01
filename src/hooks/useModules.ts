import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Module } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useModules = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      return data.map(module => ({
        id: module.id,
        courseId: module.course_id,
        title: module.title,
        description: module.description,
        order: module.order_index,
        coverImage: module.cover_image,
        totalLessons: module.total_lessons || 0,
        isLocked: module.is_locked || false,
        unlockCondition: module.unlock_condition,
        createdAt: module.created_at
      })) as Module[];
    },
    enabled: !!courseId,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleData: Partial<Module>) => {
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          course_id: moduleData.courseId,
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleData.order,
          cover_image: moduleData.coverImage,
          total_lessons: moduleData.totalLessons || 0,
          is_locked: moduleData.isLocked || false,
          unlock_condition: moduleData.unlockCondition
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules', variables.courseId] });
      showSuccess('Módulo criado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao criar módulo');
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId, ...moduleData }: Partial<Module> & { id: string; courseId: string }) => {
      const { data, error } = await supabase
        .from('modules')
        .update({
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleData.order,
          cover_image: moduleData.coverImage,
          total_lessons: moduleData.totalLessons,
          is_locked: moduleData.isLocked,
          unlock_condition: moduleData.unlockCondition
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules', variables.courseId] });
      showSuccess('Módulo atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao atualizar módulo');
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules', variables.courseId] });
      showSuccess('Módulo deletado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao deletar módulo');
    },
  });
};