import React from 'react';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCourses } from '@/hooks/useUserCourses';
import { BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourseProgress } from '@/hooks/useProgress';
import MarketingSpot from '@/components/MarketingSpot';

const MeusCursos: React.FC = () => {
  const { user } = useAuth();
  const { data: userCourses, isLoading } = useUserCourses(user?.id);

  const CourseProgressWrapper = ({ courseId }: { courseId: string }) => {
    const { data: progress } = useCourseProgress(user?.id, courseId);
    return <>{progress?.progressPercentage || 0}%</>;
  };

  const totalProgress = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <MarketingSpot />

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-atlon-text uppercase">
            Meus Cursos
          </h1>
          <p className="text-gray-400 text-lg">Olá, {user?.name}! Continue de onde parou</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-atlon-green" />
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-gray-700" />
              ) : (
                <span className="text-3xl font-bold text-white">{userCourses?.length || 0}</span>
              )}
            </div>
            <p className="text-gray-400">Cursos Matriculados</p>
          </div>

          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-atlon-green" />
              <span className="text-3xl font-bold text-white">{totalProgress}%</span>
            </div>
            <p className="text-gray-400">Progresso Médio</p>
          </div>

          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <div className="text-3xl">🔥</div>
            <span className="text-3xl font-bold text-white">{user?.streak || 0}</span>
            <p className="text-gray-400">Dias Consecutivos</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                <Skeleton className="aspect-video w-full bg-gray-700" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-700 mb-4" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userCourses && userCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-400 text-lg mb-6">Você ainda não está matriculado em nenhum curso.</p>
            <p className="text-gray-500">Explore nossas ofertas ou contate o suporte.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusCursos;