import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAllCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from '@/hooks/useLessons';
import { Plus, Edit, Trash2, PlaySquare, FileText, Eye } from 'lucide-react';
import { Lesson } from '@/types';

const Aulas: React.FC = () => {
  const { data: courses } = useAllCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const { data: modules } = useModules(selectedCourseId);
  const { data: lessons, isLoading } = useLessons(selectedModuleId);
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf' | 'text' | 'quiz',
    contentUrl: '',
    duration: 0,
    order: 1,
    thumbnail: '',
    isPreview: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'video',
      contentUrl: '',
      duration: 0,
      order: 1,
      thumbnail: '',
      isPreview: false,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;
    
    await createLesson.mutateAsync({
      moduleId: selectedModuleId,
      ...formData,
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      contentUrl: lesson.contentUrl,
      duration: lesson.duration,
      order: lesson.order,
      thumbnail: lesson.thumbnail || '',
      isPreview: lesson.isPreview,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson || !selectedModuleId) return;
    
    await updateLesson.mutateAsync({
      id: selectedLesson.id,
      moduleId: selectedModuleId,
      ...formData,
    });
    setIsEditDialogOpen(false);
    setSelectedLesson(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedLesson || !selectedModuleId) return;
    await deleteLesson.mutateAsync({ id: selectedLesson.id, moduleId: selectedModuleId });
    setIsDeleteDialogOpen(false);
    setSelectedLesson(null);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return PlaySquare;
      case 'pdf': return FileText;
      case 'text': return FileText;
      case 'quiz': return FileText;
      default: return PlaySquare;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Aulas
          </h1>
          <p className="text-gray-400">Gerencie as aulas de cada módulo</p>
        </div>

        {/* Course and Module Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white">Selecione um Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCourseId} onValueChange={(value) => {
                setSelectedCourseId(value);
                setSelectedModuleId('');
              }}>
                <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                  <SelectValue placeholder="Escolha um curso..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white">Selecione um Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedModuleId} 
                onValueChange={setSelectedModuleId}
                disabled={!selectedCourseId}
              >
                <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                  <SelectValue placeholder="Escolha um módulo..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                  {modules?.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      Módulo {module.order}: {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {selectedModuleId && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                {lessons?.length || 0} aula(s) encontrada(s)
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-atlon hover:opacity-90 text-black font-bold">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Aula
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Criar Nova Aula</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-300">Título da Aula *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">Descrição *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-[#0B0B0B] border-atlon-green/10 text-white min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-gray-300">Tipo de Conteúdo</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                          <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-gray-300">Duração (segundos)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                          className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contentUrl" className="text-gray-300">URL do Conteúdo *</Label>
                      <Input
                        id="contentUrl"
                        value={formData.contentUrl}
                        onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                        className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                        placeholder="https://..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail" className="text-gray-300">URL da Thumbnail</Label>
                      <Input
                        id="thumbnail"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                        className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="order" className="text-gray-300">Ordem</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                          className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                          min="1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300">Aula Prévia</Label>
                        <Select 
                          value={formData.isPreview ? 'yes' : 'no'} 
                          onValueChange={(value) => setFormData({...formData, isPreview: value === 'yes'})}
                        >
                          <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                            <SelectItem value="no">Não</SelectItem>
                            <SelectItem value="yes">Sim (Acesso Livre)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="gradient-atlon hover:opacity-90 text-black font-bold"
                        disabled={createLesson.isPending}
                      >
                        {createLesson.isPending ? 'Salvando...' : 'Salvar Aula'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lessons List */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                    <CardContent className="p-4">
                      <Skeleton className="h-20 w-full bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : lessons && lessons.length > 0 ? (
              <div className="space-y-4">
                {lessons.map((lesson) => {
                  const Icon = getLessonIcon(lesson.type);
                  return (
                    <Card key={lesson.id} className="bg-[#1A1A1A] border-atlon-green/10 card-glow hover:scale-[1.02] transition-transform">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            {lesson.thumbnail ? (
                              <img 
                                src={lesson.thumbnail} 
                                alt={lesson.title}
                                className="w-32 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-[#0B0B0B] rounded flex items-center justify-center">
                                <Icon className="h-8 w-8 text-gray-600" />
                              </div>
                            )}
                            <Badge className="absolute top-1 right-1 bg-atlon-green/20 text-atlon-green border-atlon-green/50 text-xs">
                              {lesson.order}
                            </Badge>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-white truncate">{lesson.title}</h4>
                              {lesson.isPreview && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Prévia
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="capitalize">{lesson.type}</span>
                              <span>•</span>
                              <span>{formatDuration(lesson.duration)}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                              onClick={() => handleEdit(lesson)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
                <div className="text-center">
                  <PlaySquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhuma aula encontrada</h3>
                  <p className="text-gray-400 mb-6">Comece criando a primeira aula deste módulo</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gradient-atlon hover:opacity-90 text-black font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Aula
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {!selectedModuleId && (
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
            <div className="text-center">
              <PlaySquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Selecione um curso e módulo</h3>
              <p className="text-gray-400">Escolha um curso e módulo acima para gerenciar as aulas</p>
            </div>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Aula</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-gray-300">Título da Aula *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-gray-300">Descrição *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-[#0B0B0B] border-atlon-green/10 text-white min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-gray-300">Tipo de Conteúdo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-duration" className="text-gray-300">Duração (segundos)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contentUrl" className="text-gray-300">URL do Conteúdo *</Label>
                <Input
                  id="edit-contentUrl"
                  value={formData.contentUrl}
                  onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                  className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail" className="text-gray-300">URL da Thumbnail</Label>
                <Input
                  id="edit-thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-order" className="text-gray-300">Ordem</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Aula Prévia</Label>
                  <Select 
                    value={formData.isPreview ? 'yes' : 'no'} 
                    onValueChange={(value) => setFormData({...formData, isPreview: value === 'yes'})}
                  >
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="no">Não</SelectItem>
                      <SelectItem value="yes">Sim (Acesso Livre)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedLesson(null);
                    resetForm();
                  }}
                  className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="gradient-atlon hover:opacity-90 text-black font-bold"
                  disabled={updateLesson.isPending}
                >
                  {updateLesson.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1A1A1A] border-red-500/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Tem certeza que deseja excluir a aula <strong className="text-white">"{selectedLesson?.title}"</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-atlon-green/10 text-white hover:bg-atlon-green/10">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={deleteLesson.isPending}
              >
                {deleteLesson.isPending ? 'Excluindo...' : 'Excluir Aula'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Aulas;