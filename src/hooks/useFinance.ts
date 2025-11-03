import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FinanceStats {
  total_revenue: number;
  sales_today: number;
  total_paid_enrollments: number;
}

export interface Transaction {
  id: string;
  enrolled_at: string;
  profiles: {
    name: string;
  };
  courses: {
    title: string;
    price: number;
  };
}

export const useFinanceStats = () => {
  return useQuery({
    queryKey: ['finance_stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_finance_stats').single();
      if (error) throw error;
      return data as FinanceStats;
    },
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, enrolled_at, profiles!inner(name), courses!inner(title, price)')
        .eq('payment_status', 'paid')
        .order('enrolled_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as unknown as Transaction[];
    },
  });
};