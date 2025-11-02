import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { User } from '@/types';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...profileData }: Partial<User> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          profession: profileData.profession,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      showSuccess('Perfil atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao atualizar perfil.');
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', userId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      showSuccess('Avatar atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao enviar avatar.');
    },
  });
};