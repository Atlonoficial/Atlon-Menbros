import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ModuleCard } from '@/components/ModuleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCourses, mockModules } from '@/data/mockData';
import { Play, Clock, Award } from 'lucide-react';

const CursoDetalhes: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const course = mockCourses.find(c => c.id === courseId);
  const modules = mockModules.filter(m => m.courseId === courseId);

  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  const handleModuleClick = (moduleId: string) => {
    navigate(`/curso/${courseId}/modulo/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={course.bannerImage}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-[#A020F0]/20 text-[#A020F0] border-[#A020F0]/50">
                <Award className="mr-2 h-4 w-4" />
                Acesso Vitalício
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase bg-gradient-to-r from-[#FF7A33] via-[#FF4DD2] to-[#A020F0] bg-clip-text text-transparent">
                {course.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                {course.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90 transition-opacity"
              >
                <Play className="mr-2 h-5 w-5" />
                Continuar de onde parei
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white uppercase">
            Cursos de Design
          </h2>
          <p className="text-gray-400">Escolha um módulo para começar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => handleModuleClick(module.id)}
            />
          ))}
        </div>

        {/* Bonus Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white uppercase">
            Estratégias
          </h2>
          <p className="text-gray-400">Materiais complementares e bônus</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] border border-white/10 rounded-lg flex items-center justify-center"
            >
              <Clock className="h-12 w-12 text-gray-600" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CursoDetalhes;