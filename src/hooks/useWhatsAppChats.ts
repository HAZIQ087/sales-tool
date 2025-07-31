import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WhatsAppChat {
  id: string;
  customer_phone: string;
  customer_name?: string;
  customer_id?: string;
  last_message?: string;
  message_time: string;
  status: 'pending' | 'responded' | 'closed';
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export const useWhatsAppChats = () => {
  const [chats, setChats] = useState<WhatsAppChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_chats')
        .select('*')
        .order('message_time', { ascending: false });

      if (error) throw error;
      setChats(data as WhatsAppChat[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar chats: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    loading,
    refetch: fetchChats
  };
};