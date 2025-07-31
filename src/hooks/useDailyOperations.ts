
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DailyOperation {
  id: string;
  branch_id?: string;
  date: string;
  opening_cash_mxn: number;
  opening_cash_usd: number;
  closing_cash_mxn?: number;
  closing_cash_usd?: number;
  status: 'open' | 'closed';
  opened_by?: string;
  closed_by?: string;
  created_at: string;
  updated_at: string;
}

export const useDailyOperations = () => {
  const [currentOperation, setCurrentOperation] = useState<DailyOperation | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCurrentOperation = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_operations')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setCurrentOperation(data as DailyOperation);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar operaciones diarias: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDailyOperation = async (openingCashMxn: number, openingCashUsd: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_operations')
        .insert([{
          date: today,
          opening_cash_mxn: openingCashMxn,
          opening_cash_usd: openingCashUsd,
          opened_by: 'Admin',
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;
      setCurrentOperation(data as DailyOperation);
      toast({
        title: "Éxito",
        description: "Operación diaria abierta correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al abrir operación diaria: " + error.message,
        variant: "destructive",
      });
    }
  };

  const closeDailyOperation = async (closingCashMxn: number, closingCashUsd: number) => {
    try {
      if (!currentOperation) return;

      const { error } = await supabase
        .from('daily_operations')
        .update({
          closing_cash_mxn: closingCashMxn,
          closing_cash_usd: closingCashUsd,
          closed_by: 'Admin',
          status: 'closed'
        })
        .eq('id', currentOperation.id);

      if (error) throw error;
      
      await fetchCurrentOperation();
      toast({
        title: "Éxito",
        description: "Operación diaria cerrada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cerrar operación diaria: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCurrentOperation();
  }, []);

  return {
    currentOperation,
    loading,
    openDailyOperation,
    closeDailyOperation,
    refetch: fetchCurrentOperation
  };
};
