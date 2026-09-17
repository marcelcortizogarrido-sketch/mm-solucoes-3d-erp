export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_table: string
          id: number
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_table: string
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_table?: string
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: number
          new_cost: number | null
          new_price: number | null
          previous_cost: number | null
          previous_price: number | null
          product_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: never
          new_cost?: number | null
          new_price?: number | null
          previous_cost?: number | null
          previous_price?: number | null
          product_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: never
          new_cost?: number | null
          new_price?: number | null
          previous_cost?: number | null
          previous_price?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_simulations: {
        Row: {
          created_at: string
          created_by: string | null
          desired_margin: number | null
          desired_markup: number | null
          energy_cost: number | null
          id: string
          intended_price: number | null
          labor_cost: number | null
          material_cost: number | null
          other_costs: number | null
          packaging_cost: number | null
          product_id: string | null
          recommended_price: number | null
          total_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          desired_margin?: number | null
          desired_markup?: number | null
          energy_cost?: number | null
          id?: string
          intended_price?: number | null
          labor_cost?: number | null
          material_cost?: number | null
          other_costs?: number | null
          packaging_cost?: number | null
          product_id?: string | null
          recommended_price?: number | null
          total_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          desired_margin?: number | null
          desired_markup?: number | null
          energy_cost?: number | null
          id?: string
          intended_price?: number | null
          labor_cost?: number | null
          material_cost?: number | null
          other_costs?: number | null
          packaging_cost?: number | null
          product_id?: string | null
          recommended_price?: number | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_simulations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_simulations_product_id_fkey"
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
          cost: number
          created_at: string
          description: string | null
          id: string
          internal_code: string | null
          min_stock: number
          name: string
          photo_url: string | null
          sale_price: number
          sku: string
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          internal_code?: string | null
          min_stock?: number
          name: string
          photo_url?: string | null
          sale_price?: number
          sku: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          internal_code?: string | null
          min_stock?: number
          name?: string
          photo_url?: string | null
          sale_price?: number
          sku?: string
          status?: string
          unit?: string
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
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      stock_balances: {
        Row: {
          location_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          location_id: string
          product_id: string
          quantity?: number
        }
        Update: {
          location_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_balances_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_balances_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_locations: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          type?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          destination_location_id: string | null
          id: number
          notes: string | null
          origin_location_id: string | null
          product_id: string
          quantity: number
          reason: string | null
          type: Database["public"]["Enums"]["stock_movement_type"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          destination_location_id?: string | null
          id?: never
          notes?: string | null
          origin_location_id?: string | null
          product_id: string
          quantity: number
          reason?: string | null
          type: Database["public"]["Enums"]["stock_movement_type"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          destination_location_id?: string | null
          id?: never
          notes?: string | null
          origin_location_id?: string | null
          product_id?: string
          quantity?: number
          reason?: string | null
          type?: Database["public"]["Enums"]["stock_movement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_destination_location_id_fkey"
            columns: ["destination_location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_origin_location_id_fkey"
            columns: ["origin_location_id"]
            isOneToOne: false
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      stock_movement_type:
        | "entrada"
        | "producao"
        | "compra"
        | "venda"
        | "transferencia"
        | "envio_consignacao"
        | "reposicao"
        | "retorno_consignacao"
        | "devolucao"
        | "perda"
        | "avaria"
        | "ajuste_positivo"
        | "ajuste_negativo"
      user_role: "ADMINISTRADOR" | "SOCIO"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      stock_movement_type: [
        "entrada",
        "producao",
        "compra",
        "venda",
        "transferencia",
        "envio_consignacao",
        "reposicao",
        "retorno_consignacao",
        "devolucao",
        "perda",
        "avaria",
        "ajuste_positivo",
        "ajuste_negativo",
      ],
      user_role: ["ADMINISTRADOR", "SOCIO"],
    },
  },
} as const
