
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExchangeRate {
  id: string;
  rate: number;
  date: string;
  updated_by?: string;
  created_at: string;
}

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setExchangeRate(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar tipo de cambio: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeRate = async (newRate: number) => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .insert([{
          rate: newRate,
          date: new Date().toISOString().split('T')[0],
          updated_by: 'Admin'
        }])
        .select()
        .single();

      if (error) throw error;
      setExchangeRate(data);
      toast({
        title: "Éxito",
        description: "Tipo de cambio actualizado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al actualizar tipo de cambio: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  return {
    exchangeRate,
    loading,
    updateExchangeRate,
    refetch: fetchExchangeRate
  };
};
