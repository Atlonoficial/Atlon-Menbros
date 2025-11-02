import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourse } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useIsEnrolled } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Clock, Award, BookOpen, ChevronRight, Lock } from 'lucide-react';

const CursoDetalhes: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: modules, isLoading: modulesLoading } = useModules(courseId);
  const { data: isEnrolled, isLoading: enrollmentLoading } = useIsEnrolled(user?.id, courseId);

  const isLoading = courseLoading || modulesLoading || enrollmentLoading;

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

  const handleModuleClick = (moduleId: string) => {
    if (isEnrolled) {
      navigate(`/curso/${courseId}/modulo/${moduleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={course.bannerImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />
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
                  Começar Agora
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <Lock className="h-6 w-6 text-gray-400" />
                  <p className="text-gray-400">Entre em contato com o suporte para ter acesso a este curso</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="container mx-auto px-4 py-12">
        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Sobre o Curso</h2>
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-6">
            <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
          </Card>
        </div>

        {/* Modules Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">Módulos do Curso</h2>
          {modulesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-gray-700" />
              ))}
            </div>
          ) : modules && modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <Card
                  key={module.id}
                  className={`bg-[#1A1A1A] border-atlon-green/10 hover:border-atlon-green/30 transition-all card-glow ${
                    isEnrolled && !module.isLocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => isEnrolled && !module.isLocked && handleModuleClick(module.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-atlon-green font-bold mr-3">Módulo {index + 1}</span>
                          <Badge variant="outline" className="border-atlon-green/30 text-atlon-green">
                            {module.totalLessons} aulas
                          </Badge>
                          {module.isLocked && (
                            <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/50">
                              <Lock className="h-3 w-3 mr-1" />
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-gray-400">{module.description}</p>
                        {module.isLocked && module.unlockCondition && (
                          <p className="text-sm text-yellow-500 mt-2">
                            🔒 {module.unlockCondition}
                          </p>
                        )}
                      </div>
                      {isEnrolled && !module.isLocked && (
                        <ChevronRight className="h-6 w-6 text-atlon-green ml-4 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhum módulo disponível</h3>
                <p className="text-gray-400">Este curso ainda não possui módulos cadastrados</p>
              </div>
            </Card>
          )}
        </div>

        {/* Instructor Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Instrutor</h2>
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-atlon-green-light to-atlon-green-dark flex items-center justify-center">
                <span className="text-2xl font-bold text-black">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{course.instructorName}</h3>
                <p className="text-gray-400">Equipe de especialistas da Atlon</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CursoDetalhes;