
import { supabase } from '@/integrations/supabase/client';

export interface DeliveryTrackingMessage {
  customer_phone: string;
  customer_name: string;
  delivery_id: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
  driver_name?: string;
  vehicle?: string;
  estimated_time?: string;
  delivery_address: string;
}

export class WhatsAppDeliveryService {
  static async sendDeliveryStatusUpdate(message: DeliveryTrackingMessage) {
    try {
      const statusMessages = {
        pending: `⏳ *Entrega Pendiente*\n\nHola ${message.customer_name},\n\nTu pedido ha sido registrado y está pendiente de asignación:\n\n📦 ID: ${message.delivery_id}\n📍 Dirección: ${message.delivery_address}\n\nTe notificaremos cuando sea asignado a un conductor.`,
        
        assigned: `🚚 *Entrega Asignada*\n\nHola ${message.customer_name},\n\nTu pedido ha sido asignado para entrega:\n\n📦 ID: ${message.delivery_id}\n👨‍🚛 Conductor: ${message.driver_name}\n🚛 Vehículo: ${message.vehicle}\n📍 Dirección: ${message.delivery_address}\n⏰ Tiempo estimado: ${message.estimated_time}\n\n¡Te mantendremos informado!`,
        
        in_transit: `🛣️ *En Camino*\n\nHola ${message.customer_name},\n\nTu pedido está en camino:\n\n📦 ID: ${message.delivery_id}\n👨‍🚛 Conductor: ${message.driver_name}\n🚛 Vehículo: ${message.vehicle}\n📍 Dirección: ${message.delivery_address}\n\n¡Llegará pronto!`,
        
        delivered: `✅ *Entregado*\n\nHola ${message.customer_name},\n\nTu pedido ha sido entregado exitosamente:\n\n📦 ID: ${message.delivery_id}\n📍 Dirección: ${message.delivery_address}\n⏰ Hora de entrega: ${new Date().toLocaleString('es-MX')}\n\n¡Gracias por tu confianza!`,
        
        failed: `❌ *Entrega Fallida*\n\nHola ${message.customer_name},\n\nNo pudimos entregar tu pedido:\n\n📦 ID: ${message.delivery_id}\n📍 Dirección: ${message.delivery_address}\n\nNos pondremos en contacto contigo para reprogramar la entrega.`
      };

      // Create WhatsApp chat entry
      const { error: chatError } = await supabase
        .from('whatsapp_chats')
        .upsert({
          customer_phone: message.customer_phone,
          customer_name: message.customer_name,
          last_message: statusMessages[message.status],
          message_time: new Date().toISOString(),
          status: 'responded',
          unread_count: 0
        }, {
          onConflict: 'customer_phone',
          ignoreDuplicates: false
        });

      if (chatError) {
        console.error('Error creating WhatsApp chat:', chatError);
        throw chatError;
      }

      console.log(`WhatsApp delivery tracking sent to ${message.customer_phone} for delivery ${message.delivery_id}`);
      
      return { success: true, message: 'Delivery tracking sent via WhatsApp' };
    } catch (error) {
      console.error('Error sending WhatsApp delivery tracking:', error);
      throw error;
    }
  }

  static async sendDeliveryReminder(message: DeliveryTrackingMessage) {
    const reminderMessage = `🔔 *Recordatorio de Entrega*\n\nHola ${message.customer_name},\n\nTu pedido será entregado hoy:\n\n📦 ID: ${message.delivery_id}\n👨‍🚛 Conductor: ${message.driver_name}\n📍 Dirección: ${message.delivery_address}\n⏰ Tiempo estimado: ${message.estimated_time}\n\nAsegúrate de estar disponible.`;

    try {
      const { error } = await supabase
        .from('whatsapp_chats')
        .upsert({
          customer_phone: message.customer_phone,
          customer_name: message.customer_name,
          last_message: reminderMessage,
          message_time: new Date().toISOString(),
          status: 'responded',
          unread_count: 0
        }, {
          onConflict: 'customer_phone',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return { success: true, message: 'Delivery reminder sent via WhatsApp' };
    } catch (error) {
      console.error('Error sending WhatsApp delivery reminder:', error);
      throw error;
    }
  }
}
