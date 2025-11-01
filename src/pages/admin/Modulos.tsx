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
import { useModules, useCreateModule, useUpdateModule, useDeleteModule } from '@/hooks/useModules';
import { Plus, Edit, Trash2, BookOpen, Lock, Unlock } from 'lucide-react';
import { Module } from '@/types';

const Modulos: React.FC = () => {
  const { data: courses } = useAllCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { data: modules, isLoading } = useModules(selectedCourseId);
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    order: 1,
    isLocked: false,
    unlockCondition: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '',
      order: 1,
      isLocked: false,
      unlockCondition: '',
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    
    await createModule.mutateAsync({
      courseId: selectedCourseId,
      ...formData,
      totalLessons: 0,
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      coverImage: module.coverImage,
      order: module.order,
      isLocked: module.isLocked,
      unlockCondition: module.unlockCondition || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule || !selectedCourseId) return;
    
    await updateModule.mutateAsync({
      id: selectedModule.id,
      courseId: selectedCourseId,
      ...formData,
    });
    setIsEditDialogOpen(false);
    setSelectedModule(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedModule || !selectedCourseId) return;
    await deleteModule.mutateAsync({ id: selectedModule.id, courseId: selectedCourseId });
    setIsDeleteDialogOpen(false);
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Módulos
          </h1>
          <p className="text-gray-400">Gerencie os módulos de cada curso</p>
        </div>

        {/* Course Selector */}
        <Card className="bg-[#1A1A1A] border-atlon-green/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Selecione um Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
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

        {selectedCourseId && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                {modules?.length || 0} módulo(s) encontrado(s)
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-atlon hover:opacity-90 text-black font-bold">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Módulo
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Criar Novo Módulo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-300">Título do Módulo *</Label>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="coverImage" className="text-gray-300">URL da Imagem de Capa</Label>
                      <Input
                        id="coverImage"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
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
                        <Label className="text-gray-300">Status</Label>
                        <Select 
                          value={formData.isLocked ? 'locked' : 'unlocked'} 
                          onValueChange={(value) => setFormData({...formData, isLocked: value === 'locked'})}
                        >
                          <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                            <SelectItem value="unlocked">Desbloqueado</SelectItem>
                            <SelectItem value="locked">Bloqueado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.isLocked && (
                      <div className="space-y-2">
                        <Label htmlFor="unlockCondition" className="text-gray-300">Condição de Desbloqueio</Label>
                        <Input
                          id="unlockCondition"
                          value={formData.unlockCondition}
                          onChange={(e) => setFormData({...formData, unlockCondition: e.target.value})}
                          className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                          placeholder="Ex: Completar módulo anterior"
                        />
                      </div>
                    )}
                    
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
                        disabled={createModule.isPending}
                      >
                        {createModule.isPending ? 'Salvando...' : 'Salvar Módulo'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Modules Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                    <Skeleton className="aspect-video w-full bg-gray-700" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-700" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : modules && modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <Card key={module.id} className="bg-[#1A1A1A] border-atlon-green/10 overflow-hidden card-glow hover:scale-105 transition-transform">
                    <div className="aspect-video relative">
                      <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className="bg-atlon-green/20 text-atlon-green border-atlon-green/50">
                          Módulo {module.order}
                        </Badge>
                        {module.isLocked && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                            <Lock className="h-3 w-3 mr-1" />
                            Bloqueado
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white line-clamp-1">{module.title}</CardTitle>
                      <p className="text-sm text-gray-400 line-clamp-2">{module.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {module.totalLessons} aulas
                        </span>
                        {module.isLocked ? (
                          <Lock className="h-4 w-4 text-red-400" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-atlon-green/10 text-white hover:bg-atlon-green/10"
                          onClick={() => handleEdit(module)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => {
                            setSelectedModule(module);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum módulo encontrado</h3>
                  <p className="text-gray-400 mb-6">Comece criando o primeiro módulo deste curso</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gradient-atlon hover:opacity-90 text-black font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Módulo
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {!selectedCourseId && (
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Selecione um curso</h3>
              <p className="text-gray-400">Escolha um curso acima para gerenciar seus módulos</p>
            </div>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Módulo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-gray-300">Título do Módulo *</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="edit-coverImage" className="text-gray-300">URL da Imagem de Capa</Label>
                <Input
                  id="edit-coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
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
                  <Label className="text-gray-300">Status</Label>
                  <Select 
                    value={formData.isLocked ? 'locked' : 'unlocked'} 
                    onValueChange={(value) => setFormData({...formData, isLocked: value === 'locked'})}
                  >
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="unlocked">Desbloqueado</SelectItem>
                      <SelectItem value="locked">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.isLocked && (
                <div className="space-y-2">
                  <Label htmlFor="edit-unlockCondition" className="text-gray-300">Condição de Desbloqueio</Label>
                  <Input
                    id="edit-unlockCondition"
                    value={formData.unlockCondition}
                    onChange={(e) => setFormData({...formData, unlockCondition: e.target.value})}
                    className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                    placeholder="Ex: Completar módulo anterior"
                  />
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedModule(null);
                    resetForm();
                  }}
                  className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="gradient-atlon hover:opacity-90 text-black font-bold"
                  disabled={updateModule.isPending}
                >
                  {updateModule.isPending ? 'Salvando...' : 'Salvar Alterações'}
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
                Tem certeza que deseja excluir o módulo <strong className="text-white">"{selectedModule?.title}"</strong>?
                Esta ação não pode ser desfeita e todas as aulas associadas também serão removidas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-atlon-green/10 text-white hover:bg-atlon-green/10">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={deleteModule.isPending}
              >
                {deleteModule.isPending ? 'Excluindo...' : 'Excluir Módulo'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Modulos;