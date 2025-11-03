import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourse } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useIsEnrolled, useEnrollCourse } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Clock, Award, BookOpen, ChevronRight, Lock, Loader2 } from 'lucide-react';

const CursoDetalhes: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: modules, isLoading: modulesLoading } = useModules(courseId);
  const { data: isEnrolled, isLoading: enrollmentLoading } = useIsEnrolled(user?.id, courseId);
  const enrollCourse = useEnrollCourse();

  const isLoading = courseLoading || modulesLoading || enrollmentLoading;

  const handleModuleClick = (moduleId: string) => {
    if (isEnrolled) {
      navigate(`/curso/${courseId}/modulo/${moduleId}`);
    }
  };

  const handleEnroll = async () => {
    if (user && courseId) {
      await enrollCourse.mutateAsync({ userId: user.id, courseId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Skeleton className="h-96 w-full bg-gray-700 mb-8" />
          <Skeleton className="h-64 w-full bg-gray-700" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Curso não encontrado</h1>
          <Button onClick={() => navigate('/meus-cursos')} className="gradient-atlon text-black font-bold">
            Voltar para Meus Cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      
      <div className="relative h-[60vh] overflow-hidden">
        {course.bannerVideo ? (
          <video className="w-full h-full object-cover" src={course.bannerVideo} autoPlay muted loop playsInline />
        ) : (
          <img
            src={course.bannerImage}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-atlon-green/20 text-atlon-green border-atlon-green/50">
                <Award className="mr-2 h-4 w-4" />
                {isEnrolled ? 'Matriculado' : 'Acesso Vitalício'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase text-white">
                {course.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                {course.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <BookOpen className="h-5 w-5 mr-2 text-atlon-green" />
                  <span>{course.totalModules} módulos</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Play className="h-5 w-5 mr-2 text-atlon-green" />
                  <span>{course.totalLessons} aulas</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-2 text-atlon-green" />
                  <span>{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}min</span>
                </div>
              </div>
              {isEnrolled ? (
                <Button
                  size="lg"
                  className="gradient-atlon hover:opacity-90 transition-opacity text-black font-bold"
                  onClick={() => modules && modules.length > 0 && handleModuleClick(modules[0].id)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Continuar Curso
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="gradient-atlon hover:opacity-90 transition-opacity text-black font-bold"
                  onClick={handleEnroll}
                  disabled={enrollCourse.isPending}
                >
                  {enrollCourse.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-5 w-5" />
                  )}
                  {enrollCourse.isPending 
                    ? 'Processando...' 
                    : course.isPremium 
                    ? `Comprar - R$ ${course.price}` 
                    : 'Acessar Grátis'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Sobre o Curso</h2>
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-6">
            <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
          </Card>
        </div>
        {/* ... resto permanece igual (módulos e instrutor) */}
      </main>
    </div>
  );
};

export default CursoDetalhes;