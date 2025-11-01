import React from 'react';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockCourseAccess, mockProgress } from '@/data/mockData';

const MeusCursos: React.FC = () => {
  const { user } = useAuth();

  // Filtrar cursos que o aluno tem acesso
  const userCourses = mockCourses.filter(course =>
    mockCourseAccess.some(access => access.userId === user?.id && access.courseId === course.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
            MEUS CURSOS
          </h1>
          <p className="text-gray-400">Continue de onde parou e alcance seus objetivos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map(course => {
            const progress = mockProgress.find(p => p.courseId === course.id && p.userId === user?.id);
            return <CourseCard key={course.id} course={course} progress={progress} />;
          })}
        </div>

        {userCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Você ainda não tem acesso a nenhum curso.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeusCursos;