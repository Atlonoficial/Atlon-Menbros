import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export interface MarketingBanner {
  id: string;
  title: string;
  type: 'image' | 'video';
  asset_url: string;
  link_url?: string;
  active: boolean;
  starts_at?: string;
  ends_at?: string;
  impressions: number;
  clicks: number;
  created_by?: string;
  created_at: string;
}

export const useActiveBanners = () => {
  return useQuery({
    queryKey: ['marketing-banners-active'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('marketing_banners')
        .select('*')
        .eq('active', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as MarketingBanner[];
    },
  });
};

export const useAllBanners = () => {
  return useQuery({
    queryKey: ['marketing-banners-all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('marketing_banners').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as MarketingBanner[];
    },
  });
};

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<MarketingBanner>) => {
      const { data, error } = await supabase
        .from('marketing_banners')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketing-banners-all'] });
      showSuccess('Banner criado!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao criar banner'),
  });
};

export const useUpdateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<MarketingBanner> & { id: string }) => {
      const { data, error } = await supabase
        .from('marketing_banners')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketing-banners-all'] });
      qc.invalidateQueries({ queryKey: ['marketing-banners-active'] });
      showSuccess('Banner atualizado!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao atualizar banner'),
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('marketing_banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketing-banners-all'] });
      showSuccess('Banner removido!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao remover banner'),
  });
};

export const useRecordBannerEvent = () => {
  return useMutation({
    mutationFn: async ({ bannerId, event }: { bannerId: string; event: 'impression' | 'click' }) => {
      const { error } = await supabase.rpc('record_marketing_event', { p_banner_id: bannerId, p_event: event });
      if (error) throw error;
    },
  });
};