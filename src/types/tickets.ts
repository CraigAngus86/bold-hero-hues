
import { Fixture } from './fixtures';

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: 'adult' | 'concession' | 'child' | 'family' | 'special';
  created_at?: string;
  updated_at?: string;
}

export interface SeasonTicket extends TicketType {
  season_id: string;
  benefits: string[];
  savings_amount: number;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
  matches_included: number;
  created_at?: string;
  updated_at?: string;
}

export interface MatchTicketConfig {
  fixture_id: string;
  fixture?: Fixture;
  ticket_types: string[]; // IDs of available ticket types
  sales_open: string; // ISO date string
  sales_close: string; // ISO date string
  capacity: number;
  online_purchase_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TicketSale {
  id: string;
  ticket_type_id: string;
  fixture_id?: string;
  season_id?: string;
  quantity: number;
  total_price: number;
  purchase_date: string;
  payment_method: 'online' | 'cash' | 'card' | 'other';
  customer_name?: string;
  customer_email?: string;
  created_at?: string;
}
