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
      sponsors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
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
