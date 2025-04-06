
import { TeamMember } from './team';

export interface Squad {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlayerSquad {
  player_id: string;
  squad_id: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FormationTemplate {
  id: string;
  name: string;
  formation: string;
  positions: FormationPosition[];
  created_at?: string;
  updated_at?: string;
}

export interface FormationPosition {
  id: string;
  x: number;
  y: number;
  position: string;
  player_id?: string;
}

export interface PlayerStatistics {
  player_id: string;
  season: string;
  appearances: number;
  goals: number;
  assists: number;
  clean_sheets?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
  created_at?: string;
  updated_at?: string;
}
