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
import { useAllCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import { Plus, Edit, Trash2, Users, Eye, Upload, Video } from 'lucide-react';
import { Course } from '@/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Cursos: React.FC = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useAllCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
    bannerImage: string;
    bannerVideo?: string | null;
    bannerKind: 'image' | 'video';
    category: 'dashboard' | 'marketing' | 'vendas' | 'gestao' | 'tecnico';
    level: 'iniciante' | 'intermediario' | 'avancado';
    status: 'draft' | 'published';
    isPremium: boolean;
    price: number;
    kiwifyProductId?: string;
  }>({
    title: '',
    subtitle: '',
    description: '',
    coverImage: '',
    bannerImage: '',
    bannerVideo: null,
    bannerKind: 'image',
    category: 'dashboard',
    level: 'iniciante',
    status: 'draft',
    isPremium: false,
    price: 0,
    kiwifyProductId: '',
  });

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const uploadCover = async () => {
    if (!coverFile) return;
    setUploadingCover(true);
    const ext = coverFile.name.split('.').pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('course-assets').upload(path, coverFile);
    setUploadingCover(false);
    if (error) return;
    const { data: { publicUrl } } = supabase.storage.from('course-assets').getPublicUrl(path);
    setFormData(prev => ({ ...prev, coverImage: publicUrl }));
  };

  const uploadBanner = async () => {
    if (!bannerFile) return;
    setUploadingBanner(true);
    const ext = bannerFile.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const bucket = formData.bannerKind === 'image' ? 'course-assets' : 'videos';
    const { error } = await supabase.storage.from(bucket).upload(path, bannerFile);
    setUploadingBanner(false);
    if (error) return;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    if (formData.bannerKind === 'image') {
      setFormData(prev => ({ ...prev, bannerImage: publicUrl, bannerVideo: null }));
    } else {
      setFormData(prev => ({ ...prev, bannerVideo: publicUrl, bannerImage: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      coverImage: '',
      bannerImage: '',
      bannerVideo: null,
      bannerKind: 'image',
      category: 'dashboard',
      level: 'iniciante',
      status: 'draft',
      isPremium: false,
      price: 0,
      kiwifyProductId: '',
    });
    setCoverFile(null);
    setBannerFile(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse.mutateAsync({
      ...formData,
      targetAudience: ['personal_trainer', 'nutritionist'],
      totalDuration: 0,
      totalModules: 0,
      totalLessons: 0,
      totalStudents: 0,
      instructorName: 'Equipe Atlon',
      bannerVideo: formData.bannerKind === 'video' ? formData.bannerVideo || '' : null,
    });
    // Salvar mapeamento Kiwify se informado
    if (formData.kiwifyProductId) {
      await supabase.from('product_mappings').insert({
        provider: 'kiwify',
        product_id: formData.kiwifyProductId,
        course_id: (createCourse as any).data?.id || null,
      }).throwOnError();
    }
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      coverImage: course.coverImage,
      bannerImage: course.bannerImage,
      bannerVideo: (course as any).bannerVideo || null,
      bannerKind: (course as any).bannerVideo ? 'video' : 'image',
      category: course.category,
      level: course.level,
      status: course.status,
      isPremium: course.isPremium,
      price: course.price || 0,
      kiwifyProductId: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    await updateCourse.mutateAsync({
      id: selectedCourse.id,
      ...formData,
      bannerVideo: formData.bannerKind === 'video' ? formData.bannerVideo || '' : null,
    });
    setIsEditDialogOpen(false);
    setSelectedCourse(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    await deleteCourse.mutateAsync(selectedCourse.id);
    setIsDeleteDialogOpen(false);
    setSelectedCourse(null);
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      dashboard: 'Dashboard',
      marketing: 'Marketing',
      vendas: 'Vendas',
      gestao: 'Gestão',
      tecnico: 'Técnico'
    };
    return names[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
              Cursos
            </h1>
            <p className="text-gray-400">Gerencie todos os cursos da plataforma</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-atlon hover:opacity-90 text-black font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Novo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Curso</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome do Curso *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Subtítulo *</Label>
                  <Input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Descrição *</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white min-h-[100px]" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Capa</Label>
                    <div className="flex gap-2">
                      <Input type="file" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                      <Button type="button" onClick={uploadCover} disabled={!coverFile || uploadingCover} className="gradient-atlon text-black font-bold">
                        <Upload className="h-4 w-4 mr-1" /> {uploadingCover ? 'Enviando...' : 'Enviar'}
                      </Button>
                    </div>
                    {formData.coverImage && <p className="text-xs text-atlon-green mt-1 break-all">{formData.coverImage}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Banner (Imagem/Vídeo)</Label>
                    <Select value={formData.bannerKind} onValueChange={(v: any) => setFormData({...formData, bannerKind: v})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input type="file" accept={formData.bannerKind === 'video' ? 'video/*' : 'image/*'} onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                      <Button type="button" onClick={uploadBanner} disabled={!bannerFile || uploadingBanner} className="gradient-atlon text-black font-bold">
                        {formData.bannerKind === 'video' ? <Video className="h-4 w-4 mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                        {uploadingBanner ? 'Enviando...' : 'Enviar'}
                      </Button>
                    </div>
                    {(formData.bannerImage || formData.bannerVideo) && (
                      <p className="text-xs text-atlon-green mt-1 break-all">{formData.bannerKind === 'image' ? formData.bannerImage : formData.bannerVideo}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as typeof formData.category})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="gestao">Gestão</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nível</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as typeof formData.level})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as typeof formData.status})}>
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Tipo</Label>
                    <Select 
                      value={formData.isPremium ? 'premium' : 'free'} 
                      onValueChange={(value) => setFormData({...formData, isPremium: value === 'premium'})}
                    >
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="free">Gratuito</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.isPremium && (
                    <div className="space-y-2">
                      <Label className="text-gray-300">Preço (R$)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Kiwify Product ID (opcional)</Label>
                  <Input value={formData.kiwifyProductId} onChange={(e) => setFormData({ ...formData, kiwifyProductId: e.target.value })} className="bg-[#0B0B0B] border-atlon-green/10 text-white" placeholder="Ex: 123456" />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-atlon-green/10 text-white hover:bg-atlon-green/10">
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-atlon hover:opacity-90 text-black font-bold" disabled={createCourse.isPending}>
                    {createCourse.isPending ? 'Salvando...' : 'Salvar Curso'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                <Skeleton className="aspect-video w-full bg-gray-700" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-[#1A1A1A] border-atlon-green/10 overflow-hidden card-glow hover:scale-105 transition-transform">
                <div className="aspect-video relative">
                  <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={`${course.status === 'published' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'}`}>
                      {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                    {course.isPremium && (
                      <Badge className="bg-atlon-green/20 text-atlon-green border-atlon-green/50">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white line-clamp-1">{course.title}</CardTitle>
                  <p className="text-sm text-gray-400 line-clamp-2">{course.subtitle}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="border-atlon-green/30 text-atlon-green">
                      {getCategoryName(course.category)}
                    </Badge>
                  </div>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-atlon-green/10 text-white hover:bg-atlon-green/10"
                      onClick={() => navigate(`/curso/${course.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-atlon-green/10 text-white hover:bg-atlon-green/10"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        setSelectedCourse(course);
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
              <Plus className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-400 mb-6">Comece criando seu primeiro curso</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-atlon hover:opacity-90 text-black font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Curso
              </Button>
            </div>
          </Card>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Curso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Nome do Curso *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Subtítulo *</Label>
                <Input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Descrição *</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-[#0B0B0B] border-atlon-green/10 text-white min-h-[100px]" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Capa</Label>
                  <div className="flex gap-2">
                    <Input type="file" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                    <Button type="button" onClick={uploadCover} disabled={!coverFile || uploadingCover} className="gradient-atlon text-black font-bold">
                      <Upload className="h-4 w-4 mr-1" /> {uploadingCover ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                  {formData.coverImage && <p className="text-xs text-atlon-green mt-1 break-all">{formData.coverImage}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Banner (Imagem/Vídeo)</Label>
                  <Select value={formData.bannerKind} onValueChange={(v: any) => setFormData({...formData, bannerKind: v})}>
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input type="file" accept={formData.bannerKind === 'video' ? 'video/*' : 'image/*'} onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                    <Button type="button" onClick={uploadBanner} disabled={!bannerFile || uploadingBanner} className="gradient-atlon text-black font-bold">
                      {formData.bannerKind === 'video' ? <Video className="h-4 w-4 mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                      {uploadingBanner ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                  {(formData.bannerImage || formData.bannerVideo) && (
                    <p className="text-xs text-atlon-green mt-1 break-all">{formData.bannerKind === 'image' ? formData.bannerImage : formData.bannerVideo}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as typeof formData.category})}>
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="gestao">Gestão</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Nível</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as typeof formData.level})}>
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as typeof formData.status})}>
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Tipo</Label>
                  <Select 
                    value={formData.isPremium ? 'premium' : 'free'} 
                    onValueChange={(value) => setFormData({...formData, isPremium: value === 'premium'})}
                  >
                    <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                      <SelectItem value="free">Gratuito</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.isPremium && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Kiwify Product ID (opcional)</Label>
                <Input value={formData.kiwifyProductId} onChange={(e) => setFormData({ ...formData, kiwifyProductId: e.target.value })} className="bg-[#0B0B0B] border-atlon-green/10 text-white" placeholder="Ex: 123456" />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCourse(null);
                    resetForm();
                  }}
                  className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="gradient-atlon hover:opacity-90 text-black font-bold"
                  disabled={updateCourse.isPending}
                >
                  {updateCourse.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1A1A1A] border-red-500/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Tem certeza que deseja excluir o curso <strong className="text-white">"{selectedCourse?.title}"</strong>?
                Esta ação não pode ser desfeita e todos os módulos e aulas associados também serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-atlon-green/10 text-white hover:bg-atlon-green/10">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={deleteCourse.isPending}
              >
                {deleteCourse.isPending ? 'Excluindo...' : 'Excluir Curso'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Cursos;