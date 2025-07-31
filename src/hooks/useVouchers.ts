
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Voucher {
  id: string;
  voucher_number: string;
  amount: number;
  currency: 'MXN' | 'USD';
  customer_id?: string;
  used_amount: number;
  status: 'active' | 'used' | 'expired';
  expires_at?: string;
  created_at: string;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVouchers((data || []) as Voucher[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar vales: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = async (voucherNumber: string, amount: number) => {
    try {
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('voucher_number', voucherNumber)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      if (voucher.used_amount + amount > voucher.amount) {
        throw new Error('Monto excede el saldo disponible del vale');
      }

      const newUsedAmount = voucher.used_amount + amount;
      const newStatus = newUsedAmount >= voucher.amount ? 'used' : 'active';

      const { error: updateError } = await supabase
        .from('vouchers')
        .update({
          used_amount: newUsedAmount,
          status: newStatus
        })
        .eq('id', voucher.id);

      if (updateError) throw updateError;

      await fetchVouchers();
      return voucher as Voucher;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al aplicar vale: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return {
    vouchers,
    loading,
    applyVoucher,
    refetch: fetchVouchers
  };
};
