import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((c: any) => ({
        ...c,
        coverImage: c.cover_image,
        bannerImage: c.banner_image,
        bannerVideo: c.banner_video || null,
        targetAudience: c.target_audience,
        totalDuration: c.total_duration,
        totalModules: c.total_modules,
        totalLessons: c.total_lessons,
        totalStudents: c.total_students,
        instructorId: c.instructor_id,
        instructorName: c.instructor_name,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })) as unknown as Course[];
    },
  });
};

export const useAllCourses = () => {
  return useQuery({
    queryKey: ['all-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((c: any) => ({
        ...c,
        coverImage: c.cover_image,
        bannerImage: c.banner_image,
        bannerVideo: c.banner_video || null,
        targetAudience: c.target_audience,
        totalDuration: c.total_duration,
        totalModules: c.total_modules,
        totalLessons: c.total_lessons,
        totalStudents: c.total_students,
        instructorId: c.instructor_id,
        instructorName: c.instructor_name,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })) as unknown as Course[];
    },
  });
};

export const useCourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      const c: any = data;
      return {
        ...c,
        coverImage: c.cover_image,
        bannerImage: c.banner_image,
        bannerVideo: c.banner_video || null,
        targetAudience: c.target_audience,
        totalDuration: c.total_duration,
        totalModules: c.total_modules,
        totalLessons: c.total_lessons,
        totalStudents: c.total_students,
        instructorId: c.instructor_id,
        instructorName: c.instructor_name,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      } as unknown as Course;
    },
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: Partial<Course> & { bannerVideo?: string | null }) => {
      const payload: any = {
        title: courseData.title,
        subtitle: courseData.subtitle,
        description: courseData.description,
        cover_image: courseData.coverImage,
        banner_image: courseData.bannerImage,
        banner_video: (courseData as any).bannerVideo || null,
        category: courseData.category,
        level: courseData.level,
        status: courseData.status,
        is_premium: courseData.isPremium,
        price: courseData.price,
        target_audience: courseData.targetAudience,
        total_duration: courseData.totalDuration || 0,
        total_modules: courseData.totalModules || 0,
        total_lessons: courseData.totalLessons || 0,
        total_students: courseData.totalStudents || 0,
        instructor_name: courseData.instructorName || 'Equipe Atlon',
      };

      const { data, error } = await supabase
        .from('courses')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      showSuccess('Curso criado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao criar curso');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<Course> & { id: string; bannerVideo?: string | null }) => {
      const payload: any = {
        title: courseData.title,
        subtitle: courseData.subtitle,
        description: courseData.description,
        cover_image: courseData.coverImage,
        banner_image: courseData.bannerImage,
        banner_video: (courseData as any).bannerVideo ?? null,
        category: courseData.category,
        level: courseData.level,
        status: courseData.status,
        is_premium: courseData.isPremium,
        price: courseData.price,
        target_audience: courseData.targetAudience,
        total_duration: courseData.totalDuration,
        total_modules: courseData.totalModules,
        total_lessons: courseData.totalLessons,
        total_students: courseData.totalStudents,
        instructor_name: courseData.instructorName,
      };

      const { data, error } = await supabase
        .from('courses')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      showSuccess('Curso atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao atualizar curso');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      showSuccess('Curso deletado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao deletar curso');
    },
  });
};