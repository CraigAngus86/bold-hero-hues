export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      fixtures: {
        Row: {
          away_score: number | null
          away_team: string
          competition: string
          created_at: string | null
          date: string
          home_score: number | null
          home_team: string
          id: string
          import_date: string | null
          is_completed: boolean | null
          season: string | null
          source: string | null
          ticket_link: string | null
          time: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          away_score?: number | null
          away_team: string
          competition: string
          created_at?: string | null
          date: string
          home_score?: number | null
          home_team: string
          id?: string
          import_date?: string | null
          is_completed?: boolean | null
          season?: string | null
          source?: string | null
          ticket_link?: string | null
          time: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          away_score?: number | null
          away_team?: string
          competition?: string
          created_at?: string | null
          date?: string
          home_score?: number | null
          home_team?: string
          id?: string
          import_date?: string | null
          is_completed?: boolean | null
          season?: string | null
          source?: string | null
          ticket_link?: string | null
          time?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      highland_league_table: {
        Row: {
          created_at: string | null
          drawn: number
          form: string[] | null
          goalDifference: number
          goalsAgainst: number
          goalsFor: number
          id: number
          logo: string | null
          lost: number
          played: number
          points: number
          position: number
          team: string
          won: number
        }
        Insert: {
          created_at?: string | null
          drawn: number
          form?: string[] | null
          goalDifference: number
          goalsAgainst: number
          goalsFor: number
          id?: number
          logo?: string | null
          lost: number
          played: number
          points: number
          position: number
          team: string
          won: number
        }
        Update: {
          created_at?: string | null
          drawn?: number
          form?: string[] | null
          goalDifference?: number
          goalsAgainst?: number
          goalsFor?: number
          id?: number
          logo?: string | null
          lost?: number
          played?: number
          points?: number
          position?: number
          team?: string
          won?: number
        }
        Relationships: []
      }
      image_folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "image_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      image_metadata: {
        Row: {
          alt_text: string | null
          bucket_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          dimensions: Json | null
          file_name: string
          id: string
          storage_path: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          bucket_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          file_name: string
          id?: string
          storage_path: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          bucket_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          file_name?: string
          id?: string
          storage_path?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      match_ticket_configs: {
        Row: {
          capacity: number | null
          created_at: string | null
          fixture_id: string
          online_purchase_link: string | null
          sales_close: string | null
          sales_open: string | null
          ticket_types: string[] | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          fixture_id: string
          online_purchase_link?: string | null
          sales_close?: string | null
          sales_open?: string | null
          ticket_types?: string[] | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          fixture_id?: string
          online_purchase_link?: string | null
          sales_close?: string | null
          sales_open?: string | null
          ticket_types?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_ticket_configs_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: true
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          publish_date: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          publish_date?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          publish_date?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scrape_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          items_added: number | null
          items_found: number | null
          items_updated: number | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_added?: number | null
          items_found?: number | null
          items_updated?: number | null
          source: string
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_added?: number | null
          items_found?: number | null
          items_updated?: number | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      season_ticket_holders: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          renewal_status: string | null
          season_id: string | null
          season_ticket_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          renewal_status?: string | null
          season_id?: string | null
          season_ticket_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          renewal_status?: string | null
          season_id?: string | null
          season_ticket_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_ticket_holders_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_ticket_holders_season_ticket_id_fkey"
            columns: ["season_ticket_id"]
            isOneToOne: false
            referencedRelation: "season_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      season_tickets: {
        Row: {
          available: boolean | null
          benefits: string[] | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          price: number
          savings_amount: number | null
          season_id: string | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          benefits?: string[] | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          price: number
          savings_amount?: number | null
          season_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          benefits?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          price?: number
          savings_amount?: number | null
          season_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "season_tickets_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          active: boolean | null
          created_at: string | null
          end_date: string
          id: string
          matches_included: number
          name: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          end_date: string
          id?: string
          matches_included: number
          name: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          end_date?: string
          id?: string
          matches_included?: number
          name?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      sponsor_communications: {
        Row: {
          contact_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          sponsor_id: string | null
          subject: string
          type: string
        }
        Insert: {
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          sponsor_id?: string | null
          subject: string
          type: string
        }
        Update: {
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          sponsor_id?: string | null
          subject?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "sponsor_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_communications_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          primary_contact: boolean | null
          role: string | null
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          primary_contact?: boolean | null
          role?: string | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          primary_contact?: boolean | null
          role?: string | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_contacts_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_display_settings: {
        Row: {
          carousel_speed: number | null
          display_mode: string | null
          id: string
          max_logos_homepage: number | null
          randomize_order: boolean | null
          show_on_homepage: boolean | null
          show_tier_headings: boolean | null
          sponsors_per_row: number | null
          updated_at: string | null
        }
        Insert: {
          carousel_speed?: number | null
          display_mode?: string | null
          id?: string
          max_logos_homepage?: number | null
          randomize_order?: boolean | null
          show_on_homepage?: boolean | null
          show_tier_headings?: boolean | null
          sponsors_per_row?: number | null
          updated_at?: string | null
        }
        Update: {
          carousel_speed?: number | null
          display_mode?: string | null
          id?: string
          max_logos_homepage?: number | null
          randomize_order?: boolean | null
          show_on_homepage?: boolean | null
          show_tier_headings?: boolean | null
          sponsors_per_row?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sponsor_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_path: string
          id: string
          name: string
          sponsor_id: string | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_path: string
          id?: string
          name: string
          sponsor_id?: string | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_path?: string
          id?: string
          name?: string
          sponsor_id?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_documents_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          renewal_status: string | null
          start_date: string | null
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          renewal_status?: string | null
          start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          renewal_status?: string | null
          start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sponsorship_tiers: {
        Row: {
          benefits: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_position: number
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_position?: number
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_position?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          source: string
          timestamp: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          source: string
          timestamp?: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          source?: string
          timestamp?: string
          type?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          experience: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          jersey_number: number | null
          member_type: string
          name: string
          nationality: string | null
          position: string | null
          previous_clubs: string[] | null
          stats: Json | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          jersey_number?: number | null
          member_type: string
          name: string
          nationality?: string | null
          position?: string | null
          previous_clubs?: string[] | null
          stats?: Json | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          jersey_number?: number | null
          member_type?: string
          name?: string
          nationality?: string | null
          position?: string | null
          previous_clubs?: string[] | null
          stats?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_sales: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          fixture_id: string | null
          id: string
          payment_method: string | null
          purchase_date: string | null
          quantity: number
          season_id: string | null
          ticket_type_id: string | null
          total_price: number
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          fixture_id?: string | null
          id?: string
          payment_method?: string | null
          purchase_date?: string | null
          quantity: number
          season_id?: string | null
          ticket_type_id?: string | null
          total_price: number
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          fixture_id?: string | null
          id?: string
          payment_method?: string | null
          purchase_date?: string | null
          quantity?: number
          season_id?: string | null
          ticket_type_id?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sales_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_sales_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_systems: {
        Row: {
          api_endpoint: string | null
          api_key: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          name: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      ticket_types: {
        Row: {
          available: boolean | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
