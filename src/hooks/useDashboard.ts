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
  message: string;
  timestamp: string;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc('get_dashboard_stats').single();

      if (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        throw error;
      }

      const statsData = data as any;
      return {
        totalCourses: statsData.total_courses || 0,
        totalStudents: statsData.total_students || 0,
        totalLessons: statsData.total_lessons || 0,
        completionRate: Math.round(statsData.avg_completion_rate || 0),
      };
    },
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async (): Promise<RecentActivity[]> => {
      const { data, error } = await supabase.rpc('get_recent_activity');

      if (error) {
        console.error('Erro ao buscar atividades recentes:', error);
        throw error;
      }
      
      return data || [];
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