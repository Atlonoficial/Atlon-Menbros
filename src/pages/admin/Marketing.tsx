import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllBanners, useCreateBanner, useDeleteBanner, useUpdateBanner } from '@/hooks/useMarketing';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Upload } from 'lucide-react';

const Marketing: React.FC = () => {
  const { data: banners } = useAllBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [form, setForm] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    assetUrl: '',
    linkUrl: '',
    active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('marketing').upload(path, file);
    setUploading(false);
    if (error) return;
    const { data: { publicUrl } } = supabase.storage.from('marketing').getPublicUrl(path);
    setForm(prev => ({ ...prev, assetUrl: publicUrl }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBanner.mutateAsync({
      title: form.title,
      type: form.type,
      asset_url: form.assetUrl,
      link_url: form.linkUrl || null as any,
      active: form.active,
    } as any);
    setForm({ title: '', type: 'image', assetUrl: '', linkUrl: '', active: true });
    setFile(null);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await updateBanner.mutateAsync({ id, active: !active });
  };

  const remove = async (id: string) => {
    await deleteBanner.mutateAsync(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Marketing
          </h1>
          <p className="text-gray-400">Gerencie banners e vídeos promovidos no painel do aluno</p>
        </div>

        <Card className="bg-[#1A1A1A] border-atlon-green/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Novo Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#0B0B0B] border-atlon-green/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Tipo</Label>
                <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-300">Arquivo</Label>
                <div className="flex gap-2">
                  <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                  <Button type="button" onClick={handleUpload} disabled={!file || uploading} className="gradient-atlon text-black font-bold">
                    <Upload className="h-4 w-4 mr-1" /> {uploading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
                {form.assetUrl && <p className="text-xs text-atlon-green mt-1 break-all">{form.assetUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">URL de destino (opcional)</Label>
                <Input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="bg-[#0B0B0B] border-atlon-green/10 text-white" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select value={form.active ? 'active' : 'inactive'} onValueChange={(v: any) => setForm({ ...form, active: v === 'active' })}>
                  <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="gradient-atlon text-black font-bold">Salvar Banner</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-atlon-green/10">
          <CardHeader>
            <CardTitle className="text-white">Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {banners?.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-[#0B0B0B] rounded border border-atlon-green/10">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{b.title}</span>
                      <Badge variant="outline" className="border-atlon-green/30 text-atlon-green text-xs">{b.type}</Badge>
                      <Badge className={`${b.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{b.active ? 'Ativo' : 'Inativo'}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {b.impressions} impressões • {b.clicks} cliques
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="border-atlon-green/10 text-white hover:bg-atlon-green/10" onClick={() => toggleActive(b.id, b.active)}>
                      <Edit className="h-4 w-4 mr-1" /> {b.active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => remove(b.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!banners?.length && <p className="text-gray-500">Nenhum banner cadastrado.</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Marketing;