import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customer_type: 'regular' | 'frequent' | 'vip';
  status: 'active' | 'inactive';
  total_spent: number;
  projects_count: number;
  last_purchase_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data as Customer[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar clientes: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => [data as Customer, ...prev]);
      toast({
        title: "Éxito",
        description: "Cliente agregado correctamente",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al agregar cliente: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? data as Customer : customer
      ));
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al actualizar cliente: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al eliminar cliente: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    createCustomer: addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};