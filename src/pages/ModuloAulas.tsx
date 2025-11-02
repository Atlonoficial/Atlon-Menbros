import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useModules } from '@/hooks/useModules';
import { useLessons } from '@/hooks/useLessons';
import { useMarkLessonComplete, useUpdateCurrentLesson } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CheckCircle2, Download, MessageSquare, Play, Lock } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const ModuloAulas: React.FC = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: modules } = useModules(courseId);
  const { data: lessons, isLoading: lessonsLoading } = useLessons(moduleId);
  const markComplete = useMarkLessonComplete();
  const updateCurrentLesson = useUpdateCurrentLesson();
  
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const module = modules?.find(m => m.id === moduleId);
  const currentLesson = lessons?.find(l => l.id === selectedLessonId) || lessons?.[0];

  // Atualizar aula atual quando mudar
  useEffect(() => {
    if (currentLesson && user?.id && courseId) {
      updateCurrentLesson.mutate({
        userId: user.id,
        courseId,
        lessonId: currentLesson.id,
      });
    }
  }, [currentLesson?.id]);

  // Selecionar primeira aula automaticamente
  useEffect(() => {
    if (lessons && lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons]);

  const handleMarkComplete = async () => {
    if (!currentLesson || !user?.id || !courseId || !lessons) return;
    
    if (completedLessons.includes(currentLesson.id)) {
      showSuccess('Esta aula já foi marcada como concluída!');
      return;
    }

    try {
      await markComplete.mutateAsync({
        userId: user.id,
        courseId,
        lessonId: currentLesson.id,
        totalLessons: lessons.length,
      });
      
      setCompletedLessons([...completedLessons, currentLesson.id]);
      showSuccess('Aula marcada como concluída! 🎉');
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error);
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      showSuccess('Comentário enviado!');
      setComment('');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Skeleton className="h-96 w-full bg-gray-700 mb-6" />
          <Skeleton className="h-64 w-full bg-gray-700" />
        </main>
      </div>
    );
  }

  if (!module || !currentLesson) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Módulo não encontrado</h1>
          <Button onClick={() => navigate(`/curso/${courseId}`)} className="gradient-atlon text-black font-bold">
            Voltar para o Curso
          </Button>
        </div>
      </div>
    );
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
                {currentLesson.type === 'video' ? (
                  <iframe
                    src={currentLesson.contentUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white mb-4">Conteúdo do tipo: {currentLesson.type}</p>
                      <Button
                        onClick={() => window.open(currentLesson.contentUrl, '_blank')}
                        className="gradient-atlon text-black font-bold"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Abrir Conteúdo
                      </Button>
                    </div>
                  </div>
                )}
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
                Curso &gt; {module.title} &gt; {currentLesson.title}
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
                  disabled={completedLessons.includes(currentLesson.id) || markComplete.isPending}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {completedLessons.includes(currentLesson.id) 
                    ? 'Concluída ✓' 
                    : markComplete.isPending 
                    ? 'Salvando...' 
                    : 'Marcar como concluída'
                  }
                </Button>
                
                {currentLesson.contentUrl && (
                  <Button 
                    variant="outline" 
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => window.open(currentLesson.contentUrl, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Material
                  </Button>
                )}
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
                  disabled={!comment.trim()}
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
                <h3 className="font-bold text-white">{module.title}</h3>
                <p className="text-sm text-gray-400">
                  {completedLessons.length} de {lessons?.length || 0} aulas concluídas
                </p>
              </div>
              
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons?.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                      currentLesson.id === lesson.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {lesson.thumbnail ? (
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-[#0B0B0B] rounded flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      {completedLessons.includes(lesson.id) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                      {!completedLessons.includes(lesson.id) && currentLesson.id !== lesson.id && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-gray-500 mr-2">Aula {index + 1}</span>
                        {lesson.isPreview && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                            Prévia
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        {lesson.title}
                      </h4>
                      <div className="text-xs text-gray-400">{formatDuration(lesson.duration)}</div>
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