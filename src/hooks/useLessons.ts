import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lesson } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useLessons = (moduleId: string | undefined) => {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      return data.map(lesson => ({
        id: lesson.id,
        moduleId: lesson.module_id,
        title: lesson.title,
        description: lesson.description,
        type: lesson.type as 'video' | 'pdf' | 'text' | 'quiz',
        contentUrl: lesson.content_url,
        duration: lesson.duration,
        order: lesson.order_index,
        thumbnail: lesson.thumbnail,
        isPreview: lesson.is_preview || false,
        createdAt: lesson.created_at
      })) as Lesson[];
    },
    enabled: !!moduleId,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonData: Partial<Lesson>) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          module_id: lessonData.moduleId,
          title: lessonData.title,
          description: lessonData.description,
          type: lessonData.type,
          content_url: lessonData.contentUrl,
          duration: lessonData.duration,
          order_index: lessonData.order,
          thumbnail: lessonData.thumbnail,
          is_preview: lessonData.isPreview || false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.moduleId] });
      showSuccess('Aula criada com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao criar aula');
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, moduleId, ...lessonData }: Partial<Lesson> & { id: string; moduleId: string }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update({
          title: lessonData.title,
          description: lessonData.description,
          type: lessonData.type,
          content_url: lessonData.contentUrl,
          duration: lessonData.duration,
          order_index: lessonData.order,
          thumbnail: lessonData.thumbnail,
          is_preview: lessonData.isPreview
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.moduleId] });
      showSuccess('Aula atualizada com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao atualizar aula');
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, moduleId }: { id: string; moduleId: string }) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.moduleId] });
      showSuccess('Aula deletada com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao deletar aula');
    },
  });
};