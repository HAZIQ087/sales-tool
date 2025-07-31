import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category_id?: string;
  supplier_id?: string;
  price: number;
  stock: number;
  min_stock: number;
  location?: string;
  barcode?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar productos: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data as Product, ...prev]);
      toast({
        title: "Éxito",
        description: "Producto agregado correctamente",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al agregar producto: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(product => 
        product.id === id ? data as Product : product
      ));
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al actualizar producto: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== id));
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al eliminar producto: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct: addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};