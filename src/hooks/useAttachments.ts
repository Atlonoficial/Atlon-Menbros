import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

export const useCourseAttachments = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course-attachments', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_attachments')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useModuleAttachments = (moduleId: string | undefined) => {
  return useQuery({
    queryKey: ['module-attachments', moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      const { data, error } = await supabase
        .from('module_attachments')
        .select('*')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });
};

export const useAddCourseAttachment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; file: File }) => {
      const file = payload.file;
      const fileExt = file.name.split('.').pop();
      const path = `courses/${payload.courseId}/${Date.now()}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage.from('attachments').upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(path);
      const { data, error } = await supabase
        .from('course_attachments')
        .insert({
          course_id: payload.courseId,
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['course-attachments', variables.courseId] });
      showSuccess('Anexo do curso enviado!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao enviar anexo do curso'),
  });
};

export const useAddModuleAttachment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { moduleId: string; file: File }) => {
      const file = payload.file;
      const fileExt = file.name.split('.').pop();
      const path = `modules/${payload.moduleId}/${Date.now()}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage.from('attachments').upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(path);
      const { data, error } = await supabase
        .from('module_attachments')
        .insert({
          module_id: payload.moduleId,
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['module-attachments', variables.moduleId] });
      showSuccess('Anexo do módulo enviado!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao enviar anexo do módulo'),
  });
};

export const useDeleteCourseAttachment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; courseId: string }) => {
      const { error } = await supabase.from('course_attachments').delete().eq('id', payload.id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['course-attachments', v.courseId] });
      showSuccess('Anexo removido!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao remover anexo'),
  });
};

export const useDeleteModuleAttachment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; moduleId: string }) => {
      const { error } = await supabase.from('module_attachments').delete().eq('id', payload.id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['module-attachments', v.moduleId] });
      showSuccess('Anexo removido!');
    },
    onError: (e: any) => showError(e.message || 'Erro ao remover anexo'),
  });
};