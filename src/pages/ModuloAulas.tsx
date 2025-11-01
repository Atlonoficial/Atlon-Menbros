import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mockModules, mockLessons } from '@/data/mockData';
import { ArrowLeft, CheckCircle2, Download, MessageSquare, Play } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ModuloAulas: React.FC = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['1']);
  const [comment, setComment] = useState('');

  const module = mockModules.find(m => m.id === moduleId);
  const lessons = mockLessons.filter(l => l.moduleId === moduleId);
  const currentLesson = lessons.find(l => l.id === selectedLesson) || lessons[0];

  const handleMarkComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      showSuccess('Aula marcada como concluída!');
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      showSuccess('Comentário enviado!');
      setComment('');
    }
  };

  if (!module || !currentLesson) {
    return <div>Módulo não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col lg:flex-row gap-6 py-6">
          {/* Video Player Column */}
          <div className="flex-1">
            <Card className="bg-[#0B0B0B] border-white/10 overflow-hidden mb-6">
              <div className="aspect-video bg-black">
                <iframe
                  src={currentLesson.contentUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>

            {/* Lesson Info */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(`/curso/${courseId}`)}
                className="mb-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o curso
              </Button>
              
              <div className="text-sm text-gray-400 mb-2">
                Curso &gt; {module.name} &gt; {currentLesson.title}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentLesson.title}
              </h1>
              
              <p className="text-gray-300 mb-6">
                {currentLesson.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleMarkComplete}
                  className="bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90"
                  disabled={completedLessons.includes(currentLesson.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {completedLessons.includes(currentLesson.id) ? 'Concluída' : 'Marcar como concluída'}
                </Button>
                
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" />
                  Download Material
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <Card className="bg-[#1A1A1A] border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Comentários
              </h3>
              
              <div className="space-y-4 mb-6">
                <Textarea
                  placeholder="Deixe seu comentário ou dúvida..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-[#0B0B0B] border-white/10 text-white min-h-[100px]"
                />
                <Button
                  onClick={handleSubmitComment}
                  className="bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90"
                >
                  Enviar Comentário
                </Button>
              </div>

              {/* Mock Comments */}
              <div className="space-y-4">
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2]" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white">Maria Silva</span>
                        <span className="text-xs text-gray-500">há 2 dias</span>
                      </div>
                      <p className="text-gray-300">Excelente aula! Muito bem explicado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:w-96">
            <Card className="bg-[#1A1A1A] border-white/10 sticky top-24">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-white">{module.name}</h3>
                <p className="text-sm text-gray-400">
                  {completedLessons.length} de {lessons.length} aulas concluídas
                </p>
              </div>
              
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson.id)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                      currentLesson.id === lesson.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      {completedLessons.includes(lesson.id) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                      {!completedLessons.includes(lesson.id) && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="text-xs text-gray-500 mb-1">Aula {index + 1}</div>
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        {lesson.title}
                      </h4>
                      <div className="text-xs text-gray-400">{lesson.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuloAulas;