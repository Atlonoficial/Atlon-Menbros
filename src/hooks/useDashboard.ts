import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalLessons: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'new_course';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Total de cursos
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Total de alunos
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Total de aulas
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      // Taxa de conclusão média
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('progress_percentage');

      const avgCompletion = progressData && progressData.length > 0
        ? Math.round(
            progressData.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0) / progressData.length
          )
        : 0;

      return {
        totalCourses: coursesCount || 0,
        totalStudents: studentsCount || 0,
        totalLessons: lessonsCount || 0,
        completionRate: avgCompletion,
      } as DashboardStats;
    },
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const activities: RecentActivity[] = [];

      // Matrículas recentes
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          user_id,
          course_id,
          profiles!enrollments_user_id_fkey(name),
          courses!enrollments_course_id_fkey(title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      if (enrollments) {
        enrollments.forEach((enrollment: any) => {
          activities.push({
            id: enrollment.id,
            type: 'enrollment',
            message: `${enrollment.profiles?.name || 'Aluno'} se matriculou em ${enrollment.courses?.title || 'um curso'}`,
            timestamp: enrollment.enrolled_at,
            userId: enrollment.user_id,
            userName: enrollment.profiles?.name,
          });
        });
      }

      // Ordenar por data
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return activities.slice(0, 10);
    },
  });
};

export const useTopCourses = () => {
  return useQuery({
    queryKey: ['top-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, cover_image, total_students, total_modules, total_lessons')
        .eq('status', 'published')
        .order('total_students', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });
};