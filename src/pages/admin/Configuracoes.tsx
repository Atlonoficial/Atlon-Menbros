import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllCourses } from '@/hooks/useCourses';
import { useProductMappings, useCreateProductMapping, useDeleteProductMapping } from '@/hooks/useProductMappings';
import { Key, Link, Trash2 } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const { data: courses } = useAllCourses();
  const { data: mappings, isLoading: mappingsLoading } = useProductMappings();
  const createMapping = useCreateProductMapping();
  const deleteMapping = useDeleteProductMapping();

  const [productId, setProductId] = useState('');
  const [courseId, setCourseId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !courseId) return;
    await createMapping.mutateAsync({ productId, courseId });
    setProductId('');
    setCourseId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Configurações
          </h1>
          <p className="text-gray-400">Gerencie integrações e configurações da plataforma</p>
        </div>

        <Card className="bg-[#1A1A1A] border-atlon-green/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="h-5 w-5 mr-2 text-atlon-green" />
              Mapeamento de Produtos (Kiwify)
            </CardTitle>
            <CardDescription className="text-gray-500">
              Associe o ID de um produto da Kiwify a um curso na plataforma para automatizar as matrículas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4 mb-6 p-4 bg-[#0B0B0B] rounded-lg border border-atlon-green/10">
              <div className="flex-1 w-full">
                <Label htmlFor="kiwify-id" className="text-gray-300">ID do Produto Kiwify</Label>
                <Input
                  id="kiwify-id"
                  placeholder="Ex: 123456"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="bg-[#060606] border-atlon-green/20 text-white"
                />
              </div>
              <div className="flex-1 w-full">
                <Label htmlFor="course-select" className="text-gray-300">Curso na Plataforma</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="bg-[#060606] border-atlon-green/20 text-white">
                    <SelectValue placeholder="Selecione um curso..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                    {courses?.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="gradient-atlon text-black font-bold w-full md:w-auto" disabled={createMapping.isPending}>
                <Link className="h-4 w-4 mr-2" />
                {createMapping.isPending ? 'Salvando...' : 'Salvar Mapeamento'}
              </Button>
            </form>

            <h3 className="text-lg font-semibold text-white mb-4">Mapeamentos Ativos</h3>
            <div className="border border-atlon-green/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-atlon-green/10 hover:bg-transparent">
                    <TableHead className="text-white">ID do Produto Kiwify</TableHead>
                    <TableHead className="text-white">Curso Mapeado</TableHead>
                    <TableHead className="text-right text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappingsLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-400">Carregando...</TableCell></TableRow>
                  ) : mappings && mappings.length > 0 ? (
                    mappings.map(mapping => (
                      <TableRow key={mapping.id} className="border-atlon-green/10">
                        <TableCell className="font-medium text-gray-300">{mapping.product_id}</TableCell>
                        <TableCell className="text-gray-300">{mapping.courses?.title || 'Curso não encontrado'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => deleteMapping.mutate(mapping.id)}
                            disabled={deleteMapping.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-500 py-8">Nenhum mapeamento encontrado.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Configuracoes;