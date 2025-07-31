
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PriceScale {
  id: string;
  name: string;
  discount_percentage: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const usePriceScales = () => {
  const [priceScales, setPriceScales] = useState<PriceScale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPriceScales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('price_scales')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setPriceScales((data || []) as PriceScale[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar escalas de precios: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceScales();
  }, []);

  return {
    priceScales,
    loading,
    refetch: fetchPriceScales
  };
};
