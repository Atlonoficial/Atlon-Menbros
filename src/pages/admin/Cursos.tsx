import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { mockCourses } from '@/data/mockData';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Cursos: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    coverImage: '',
    bannerImage: '',
    category: '',
    level: 'iniciante',
    status: 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Curso salvo com sucesso!');
    setIsDialogOpen(false);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      coverImage: '',
      bannerImage: '',
      category: '',
      level: 'iniciante',
      status: 'draft'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
              CURSOS
            </h1>
            <p className="text-gray-400">Gerencie todos os cursos da plataforma</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Curso</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Nome do Curso</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-[#0B0B0B] border-white/10 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-gray-300">Subtítulo/Benefício</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="bg-[#0B0B0B] border-white/10 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-[#0B0B0B] border-white/10 text-white min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage" className="text-gray-300">URL da Capa</Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      className="bg-[#0B0B0B] border-white/10 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bannerImage" className="text-gray-300">URL do Banner</Label>
                    <Input
                      id="bannerImage"
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                      className="bg-[#0B0B0B] border-white/10 text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="bg-[#0B0B0B] border-white/10 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-gray-300">Nível</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90">
                  Salvar Curso
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="bg-[#1A1A1A] border-white/10 overflow-hidden">
              <div className="aspect-video relative">
                <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                <Badge className={`absolute top-2 right-2 ${
                  course.status === 'published' 
                    ? 'bg-green-500/20 text-green-500 border-green-500/50' 
                    : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                }`}>
                  {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-white">{course.title}</CardTitle>
                <p className="text-sm text-gray-400">{course.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{course.totalModules} módulos</span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.totalStudents}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-white/10 text-white hover:bg-white/10">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Cursos;