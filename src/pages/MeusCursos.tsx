import React from 'react';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockCourseAccess, mockProgress } from '@/data/mockData';
import { BookOpen, TrendingUp } from 'lucide-react';

const MeusCursos: React.FC = () => {
  const { user } = useAuth();

  const userCourses = mockCourses.filter(course =>
    mockCourseAccess.some(access => access.userId === user?.id && access.courseId === course.id)
  );

  const totalProgress = userCourses.length > 0
    ? Math.round(
        userCourses.reduce((acc, course) => {
          const progress = mockProgress.find(p => p.courseId === course.id && p.userId === user?.id);
          return acc + (progress?.progressPercentage || 0);
        }, 0) / userCourses.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-atlon-text uppercase">
            Meus Cursos
          </h1>
          <p className="text-gray-400 text-lg">Olá, {user?.name}! Continue de onde parou</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-atlon-green" />
              <span className="text-3xl font-bold text-white">{userCourses.length}</span>
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
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🔥</div>
              <span className="text-3xl font-bold text-white">{user?.streak || 0}</span>
            </div>
            <p className="text-gray-400">Dias Consecutivos</p>
          </div>
        </div>

        {/* Courses Grid */}
        {userCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map(course => {
              const progress = mockProgress.find(p => p.courseId === course.id && p.userId === user?.id);
              return <CourseCard key={course.id} course={course} progress={progress} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-400 text-lg mb-6">Você ainda não tem acesso a nenhum curso.</p>
            <p className="text-gray-500">Entre em contato com o suporte para liberar seu acesso.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusCursos;