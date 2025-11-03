import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

export interface ProductMapping {
  id: string;
  provider: string;
  product_id: string;
  course_id: string;
  courses: {
    title: string;
  };
}

export const useProductMappings = () => {
  return useQuery({
    queryKey: ['product_mappings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_mappings')
        .select('*, courses(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductMapping[];
    },
  });
};

export const useCreateProductMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mappingData: { productId: string; courseId: string }) => {
      const { data, error } = await supabase
        .from('product_mappings')
        .insert({
          provider: 'kiwify',
          product_id: mappingData.productId,
          course_id: mappingData.courseId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_mappings'] });
      showSuccess('Mapeamento criado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao criar mapeamento');
    },
  });
};

export const useDeleteProductMapping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mappingId: string) => {
      const { error } = await supabase
        .from('product_mappings')
        .delete()
        .eq('id', mappingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_mappings'] });
      showSuccess('Mapeamento deletado com sucesso!');
    },
    onError: (error: any) => {
      showError(error.message || 'Erro ao deletar mapeamento');
    },
  });
};