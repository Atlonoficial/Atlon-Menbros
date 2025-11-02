import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudents, useStudentProgress, useStudentEnrollments, useEnrollStudent, useUnenrollStudent, useUpdateStudent } from '@/hooks/useStudents';
import { useAllCourses } from '@/hooks/useCourses';
import { User, UserPlus, BookOpen, TrendingUp, Calendar, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Alunos: React.FC = () => {
  const { data: students, isLoading } = useStudents();
  const { data: courses } = useAllCourses();
  const enrollStudent = useEnrollStudent();
  const unenrollStudent = useUnenrollStudent();
  const updateStudent = useUpdateStudent();

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: studentProgress } = useStudentProgress(selectedStudent?.id || '');
  const { data: studentEnrollments } = useStudentEnrollments(selectedStudent?.id || '');

  const [editFormData, setEditFormData] = useState({
    name: '',
    profession: '',
    appPlan: '',
  });

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.name,
      profession: student.profession || '',
      appPlan: student.appPlan || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    await updateStudent.mutateAsync({
      id: selectedStudent.id,
      name: editFormData.name,
      profession: (editFormData.profession as 'personal_trainer' | 'nutritionist') || undefined,
      appPlan: (editFormData.appPlan as 'basic' | 'pro' | 'premium') || undefined,
    });
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourseId) return;

    await enrollStudent.mutateAsync({
      userId: selectedStudent.id,
      courseId: selectedCourseId,
    });
    setIsEnrollDialogOpen(false);
    setSelectedCourseId('');
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!selectedStudent) return;
    await unenrollStudent.mutateAsync({
      enrollmentId,
      userId: selectedStudent.id,
    });
  };

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Alunos
          </h1>
          <p className="text-gray-400">Gerencie todos os alunos da plataforma</p>
        </div>

        {/* Search Bar */}
        <Card className="bg-[#1A1A1A] border-atlon-green/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0B0B0B] border-atlon-green/10 text-white"
              />
              <Badge className="bg-atlon-green/20 text-atlon-green border-atlon-green/50">
                {filteredStudents?.length || 0} alunos
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-[#1A1A1A] border-atlon-green/10 card-glow hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-atlon-green/30">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-atlon-green/20 text-atlon-green font-bold">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-white">{student.name}</h3>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {student.profession && (
                      <Badge variant="outline" className="border-atlon-green/30 text-atlon-green text-xs">
                        {student.profession === 'personal_trainer' ? 'Personal Trainer' : 'Nutricionista'}
                      </Badge>
                    )}
                    {student.appPlan && (
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs ml-2">
                        Plano: {student.appPlan}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-[#0B0B0B] rounded p-2">
                      <div className="text-xs text-gray-400">Nível</div>
                      <div className="text-lg font-bold text-atlon-green">{student.level}</div>
                    </div>
                    <div className="bg-[#0B0B0B] rounded p-2">
                      <div className="text-xs text-gray-400">XP</div>
                      <div className="text-lg font-bold text-white">{student.xp}</div>
                    </div>
                    <div className="bg-[#0B0B0B] rounded p-2">
                      <div className="text-xs text-gray-400">Streak</div>
                      <div className="text-lg font-bold text-orange-400">{student.streak}🔥</div>
                    </div>
                  </div>

                  {student.lastLogin && (
                    <p className="text-xs text-gray-500 mb-4">
                      Último acesso: {formatDistanceToNow(new Date(student.lastLogin), { addSuffix: true, locale: ptBR })}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-atlon-green/10 text-white hover:bg-atlon-green/10"
                      onClick={() => handleViewDetails(student)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                      onClick={() => handleEditStudent(student)}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#1A1A1A] border-atlon-green/10 p-12">
            <div className="text-center">
              <UserPlus className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum aluno encontrado</h3>
              <p className="text-gray-400">Os alunos aparecerão aqui quando se cadastrarem</p>
            </div>
          </Card>
        )}

        {/* Student Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-atlon-green/30">
                  <AvatarImage src={selectedStudent?.avatar} />
                  <AvatarFallback className="bg-atlon-green/20 text-atlon-green font-bold">
                    {selectedStudent?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {selectedStudent?.name}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="enrollments" className="w-full">
              <TabsList className="bg-[#0B0B0B] border-atlon-green/10">
                <TabsTrigger value="enrollments" className="data-[state=active]:bg-atlon-green/20 data-[state=active]:text-atlon-green">
                  Matrículas
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-atlon-green/20 data-[state=active]:text-atlon-green">
                  Progresso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="enrollments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Cursos Matriculados</h3>
                  <Button
                    size="sm"
                    className="gradient-atlon hover:opacity-90 text-black font-bold"
                    onClick={() => setIsEnrollDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Matricular
                  </Button>
                </div>

                {studentEnrollments && studentEnrollments.length > 0 ? (
                  <div className="space-y-3">
                    {studentEnrollments.map((enrollment: any) => (
                      <Card key={enrollment.id} className="bg-[#0B0B0B] border-atlon-green/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={enrollment.courses.cover_image}
                                alt={enrollment.courses.title}
                                className="w-16 h-16 rounded object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-white">{enrollment.courses.title}</h4>
                                <p className="text-xs text-gray-400">
                                  Matriculado em {new Date(enrollment.enrolled_at).toLocaleDateString('pt-BR')}
                                </p>
                                <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                                  {enrollment.status}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => handleUnenroll(enrollment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Nenhuma matrícula encontrada</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <h3 className="text-lg font-bold text-white">Progresso nos Cursos</h3>

                {studentProgress && studentProgress.length > 0 ? (
                  <div className="space-y-3">
                    {studentProgress.map((progress: any) => (
                      <Card key={progress.id} className="bg-[#0B0B0B] border-atlon-green/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={progress.courses.cover_image}
                              alt={progress.courses.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{progress.courses.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex-1 bg-gray-800 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-atlon-green-light to-atlon-green h-2 rounded-full"
                                    style={{ width: `${progress.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-atlon-green">
                                  {progress.progress_percentage}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                            <div>
                              <span className="block text-white font-medium">{progress.completed_lessons?.length || 0}</span>
                              Aulas concluídas
                            </div>
                            <div>
                              <span className="block text-white font-medium">{Math.floor(progress.total_watch_time / 60)}min</span>
                              Tempo assistido
                            </div>
                            <div>
                              <span className="block text-white font-medium">
                                {progress.certificate_issued ? '✓' : '✗'}
                              </span>
                              Certificado
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Nenhum progresso registrado</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Enroll Student Dialog */}
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10">
            <DialogHeader>
              <DialogTitle className="text-white">Matricular Aluno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Selecione o Curso</Label>
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
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEnrollDialogOpen(false)}
                  className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="gradient-atlon hover:opacity-90 text-black font-bold"
                  disabled={!selectedCourseId || enrollStudent.isPending}
                >
                  {enrollStudent.isPending ? 'Matriculando...' : 'Matricular'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-atlon-green/10">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Aluno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-gray-300">Nome</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="bg-[#0B0B0B] border-atlon-green/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Profissão</Label>
                <Select
                  value={editFormData.profession}
                  onValueChange={(value) => setEditFormData({...editFormData, profession: value})}
                >
                  <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                    <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                    <SelectItem value="nutritionist">Nutricionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Plano</Label>
                <Select
                  value={editFormData.appPlan}
                  onValueChange={(value) => setEditFormData({...editFormData, appPlan: value})}
                >
                  <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-atlon-green/10 text-white hover:bg-atlon-green/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="gradient-atlon hover:opacity-90 text-black font-bold"
                  disabled={updateStudent.isPending}
                >
                  {updateStudent.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Alunos;