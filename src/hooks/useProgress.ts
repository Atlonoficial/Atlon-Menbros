import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StudentProgress } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useCourseProgress = (userId: string | undefined, courseId: string | undefined) => {
  return useQuery({
    queryKey: ['progress', userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return null;
      
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        userId: data.user_id,
        courseId: data.course_id,
        enrolledAt: data.enrolled_at,
        lastAccessedAt: data.last_accessed_at,
        completedLessons: data.completed_lessons || [],
        currentLessonId: data.current_lesson_id,
        progressPercentage: data.progress_percentage || 0,
        certificateIssued: data.certificate_issued || false,
        certificateIssuedAt: data.certificate_issued_at,
        totalWatchTime: data.total_watch_time || 0
      } as StudentProgress;
    },
    enabled: !!userId && !!courseId,
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      courseId, 
      lessonId,
      totalLessons 
    }: { 
      userId: string; 
      courseId: string; 
      lessonId: string;
      totalLessons: number;
    }) => {
      // Buscar progresso atual
      const { data: currentProgress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      const completedLessons = currentProgress?.completed_lessons || [];
      
      // Adicionar aula se não estiver na lista
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Calcular porcentagem
      const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

      if (currentProgress) {
        // Atualizar progresso existente
        const { data, error } = await supabase
          .from('student_progress')
          .update({
            completed_lessons: completedLessons,
            current_lesson_id: lessonId,
            progress_percentage: progressPercentage,
            last_accessed_at: new Date().toISOString()
          })
          .eq('id', currentProgress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Criar novo progresso
        const { data, error } = await supabase
          .from('student_progress')
          .insert([{
            user_id: userId,
            course_id: courseId,
            completed_lessons: completedLessons,
            current_lesson_id: lessonId,
            progress_percentage: progressPercentage
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId, variables.courseId] });
      showSuccess('Aula marcada como concluída!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao marcar aula como concluída');
    },
  });
};

export const useUpdateCurrentLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      courseId, 
      lessonId 
    }: { 
      userId: string; 
      courseId: string; 
      lessonId: string;
    }) => {
      const { data: currentProgress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (currentProgress) {
        const { data, error } = await supabase
          .from('student_progress')
          .update({
            current_lesson_id: lessonId,
            last_accessed_at: new Date().toISOString()
          })
          .eq('id', currentProgress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('student_progress')
          .insert([{
            user_id: userId,
            course_id: courseId,
            current_lesson_id: lessonId
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId, variables.courseId] });
    },
  });
};