import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Perfil: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: user?.name || '',
      profession: user?.profession || '',
    },
  });

  React.useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('profession', user.profession || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: { name: string; profession: string }) => {
    if (!user) return;
    await updateProfile.mutateAsync({ 
      id: user.id, 
      name: data.name,
      profession: data.profession as 'personal_trainer' | 'nutritionist'
    });
    await refreshUser();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      await uploadAvatar.mutateAsync({ userId: user.id, file });
      await refreshUser();
    }
  };

  if (!user) {
    return null; // O AuthProvider já mostra um loader
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Meu Perfil
          </h1>
          <p className="text-gray-400">Gerencie suas informações e preferências</p>
        </div>

        <Card className="bg-[#1A1A1A] border-atlon-green/10 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white">Informações da Conta</CardTitle>
            <CardDescription className="text-gray-500">
              Mantenha seus dados sempre atualizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-atlon-green/30 group-hover:border-atlon-green/80 transition-colors">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-atlon-green/20 text-atlon-green font-bold text-3xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                  >
                    <Upload className="h-6 w-6" />
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleAvatarChange}
                      disabled={uploadAvatar.isPending}
                    />
                  </Label>
                  {uploadAvatar.isPending && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-full">
                      <Loader2 className="h-8 w-8 animate-spin text-atlon-green" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  <Badge variant="outline" className="mt-2 border-atlon-green/30 text-atlon-green">
                    {user.role === 'admin' ? 'Administrador' : 'Aluno'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} className="bg-[#0B0B0B] border-atlon-green/10 text-white" />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-gray-300">Profissão</Label>
                <Controller
                  name="profession"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white">
                        <SelectValue placeholder="Selecione sua profissão" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                        <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                        <SelectItem value="nutritionist">Nutricionista</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-atlon hover:opacity-90 text-black font-bold"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Perfil;