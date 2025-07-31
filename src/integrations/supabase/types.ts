export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          manager_name: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          manager_name?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          manager_name?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cash_movements: {
        Row: {
          amount_mxn: number
          amount_usd: number
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          notes: string | null
          reference_id: string | null
        }
        Insert: {
          amount_mxn?: number
          amount_usd?: number
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          reference_id?: string | null
        }
        Update: {
          amount_mxn?: number
          amount_usd?: number
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_interactions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          emotion_detected: string | null
          id: string
          interaction_type: string
          notes: string | null
          products: Json | null
          suggestions_made: Json | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          emotion_detected?: string | null
          id?: string
          interaction_type: string
          notes?: string | null
          products?: Json | null
          suggestions_made?: Json | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          emotion_detected?: string | null
          id?: string
          interaction_type?: string
          notes?: string | null
          products?: Json | null
          suggestions_made?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_projects: {
        Row: {
          actual_completion: string | null
          actual_spent: number
          created_at: string
          customer_id: string
          description: string | null
          estimated_budget: number | null
          expected_completion: string | null
          id: string
          notes: string | null
          project_name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_completion?: string | null
          actual_spent?: number
          created_at?: string
          customer_id: string
          description?: string | null
          estimated_budget?: number | null
          expected_completion?: string | null
          id?: string
          notes?: string | null
          project_name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_completion?: string | null
          actual_spent?: number
          created_at?: string
          customer_id?: string
          description?: string | null
          estimated_budget?: number | null
          expected_completion?: string | null
          id?: string
          notes?: string | null
          project_name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          customer_type: string
          email: string | null
          id: string
          last_purchase_date: string | null
          name: string
          notes: string | null
          phone: string | null
          price_scale_id: string | null
          projects_count: number
          status: string
          total_spent: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_type?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          price_scale_id?: string | null
          projects_count?: number
          status?: string
          total_spent?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_type?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          price_scale_id?: string | null
          projects_count?: number
          status?: string
          total_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_price_scale_id_fkey"
            columns: ["price_scale_id"]
            isOneToOne: false
            referencedRelation: "price_scales"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_operations: {
        Row: {
          branch_id: string | null
          closed_by: string | null
          closing_cash_mxn: number | null
          closing_cash_usd: number | null
          created_at: string | null
          date: string
          id: string
          opened_by: string | null
          opening_cash_mxn: number
          opening_cash_usd: number
          status: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          closed_by?: string | null
          closing_cash_mxn?: number | null
          closing_cash_usd?: number | null
          created_at?: string | null
          date: string
          id?: string
          opened_by?: string | null
          opening_cash_mxn?: number
          opening_cash_usd?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          closed_by?: string | null
          closing_cash_mxn?: number | null
          closing_cash_usd?: number | null
          created_at?: string | null
          date?: string
          id?: string
          opened_by?: string | null
          opening_cash_mxn?: number
          opening_cash_usd?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_operations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          created_at: string | null
          date: string
          id: string
          rate: number
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          rate: number
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          rate?: number
          updated_by?: string | null
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          movement_date: string
          movement_type: string
          new_stock: number
          notes: string | null
          previous_stock: number
          product_id: string
          quantity: number
          reason: string
          reference_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movement_date?: string
          movement_type: string
          new_stock: number
          notes?: string | null
          previous_stock: number
          product_id: string
          quantity: number
          reason: string
          reference_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movement_date?: string
          movement_type?: string
          new_stock?: number
          notes?: string | null
          previous_stock?: number
          product_id?: string
          quantity?: number
          reason?: string
          reference_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          is_active: boolean | null
          name: string
          requires_authorization: boolean | null
          type: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          name: string
          requires_authorization?: boolean | null
          type: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          requires_authorization?: boolean | null
          type?: string
        }
        Relationships: []
      }
      pending_sales: {
        Row: {
          branch_id: string | null
          created_by: string | null
          customer_id: string | null
          discount_amount: number
          id: string
          items: Json
          paused_at: string | null
          sale_number: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
        }
        Insert: {
          branch_id?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number
          id?: string
          items: Json
          paused_at?: string | null
          sale_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
        }
        Update: {
          branch_id?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number
          id?: string
          items?: Json
          paused_at?: string | null
          sale_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "pending_sales_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      price_scales: {
        Row: {
          created_at: string | null
          discount_percentage: number
          id: string
          name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number
          id?: string
          name: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          id?: string
          name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          location: string | null
          min_stock: number
          name: string
          price: number
          status: string
          stock: number
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          min_stock?: number
          name: string
          price?: number
          status?: string
          stock?: number
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          min_stock?: number
          name?: string
          price?: number
          status?: string
          stock?: number
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          discount_amount: number
          id: string
          items: Json
          notes: string | null
          quote_number: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number
          id?: string
          items: Json
          notes?: string | null
          quote_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number
          id?: string
          items?: Json
          notes?: string | null
          quote_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          authorized_by: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          items: Json
          original_sale_id: string | null
          reason: string | null
          return_number: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          authorized_by?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items: Json
          original_sale_id?: string | null
          reason?: string | null
          return_number: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          authorized_by?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json
          original_sale_id?: string | null
          reason?: string | null
          return_number?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_original_sale_id_fkey"
            columns: ["original_sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          product_code: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_code: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_code?: string
          product_id?: string
          product_name?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          credit_applied: number | null
          customer_id: string | null
          delivery_address: string | null
          delivery_required: boolean
          discount_amount: number
          exchange_rate: number | null
          id: string
          payment_details: Json | null
          payment_method: string | null
          sale_date: string
          sale_number: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          voucher_used: number | null
        }
        Insert: {
          created_at?: string
          credit_applied?: number | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_required?: boolean
          discount_amount?: number
          exchange_rate?: number | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          sale_date?: string
          sale_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          voucher_used?: number | null
        }
        Update: {
          created_at?: string
          credit_applied?: number | null
          customer_id?: string | null
          delivery_address?: string | null
          delivery_required?: boolean
          discount_amount?: number
          exchange_rate?: number | null
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          sale_date?: string
          sale_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          voucher_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          customer_id: string | null
          expires_at: string | null
          id: string
          status: string
          used_amount: number
          voucher_number: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          status?: string
          used_amount?: number
          voucher_number: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          status?: string
          used_amount?: number
          voucher_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_chats: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string | null
          customer_phone: string
          id: string
          last_message: string | null
          message_time: string
          status: string
          unread_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone: string
          id?: string
          last_message?: string | null
          message_time?: string
          status?: string
          unread_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string
          id?: string
          last_message?: string | null
          message_time?: string
          status?: string
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_chats_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_product_stock: {
        Args: { product_id: string; quantity_sold: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
