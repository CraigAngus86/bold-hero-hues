
// Placeholder types for fan-related entities to fix type errors

export type SystemLogLevel = 'info' | 'warning' | 'error' | 'debug' | 'success';

export interface SystemLog {
  id: string;
  timestamp: string;
  type: SystemLogLevel;
  message: string;
  source?: string;
  details?: any;
}

export interface SystemStatus {
  overall_status: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: string;
  message?: string;
  status?: 'healthy' | 'warning' | 'error' | 'unknown';
  services?: Array<{
    name: string;
    status: string;
    uptime: number;
    message: string;
    lastChecked: string;
  }>;
  metrics?: {
    performance?: Array<{name: string, value: number, unit: string}>;
    storage?: Array<{name: string, value: number, unit: string}>;
    usage?: Array<{name: string, value: number, unit: string}>;
  };
  logs?: SystemLog[];
  uptime?: number;
}

export interface FanContent {
  id: string;
  title: string;
  content?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: string;
  featured: boolean;
  submitted_by: string;
  submitted_on: string;
  image_url?: string;
  user_reputation?: number;
  moderated_by?: string;
  moderation_date?: string;
  moderation_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: 'draft' | 'published' | 'closed';
  is_featured: boolean;
  startDate?: string; // Note: DB uses start_date but code uses startDate
  endDate?: string; // Note: DB uses end_date but code uses endDate
  start_date?: string;
  end_date?: string;
  published_at?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  questions?: PollQuestion[];
  responses?: number;
}

export interface PollQuestion {
  id: string;
  poll_id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  required: boolean;
  order_position?: number;
  options?: PollOption[];
  created_at?: string;
  updated_at?: string;
}

export interface PollOption {
  id: string;
  question_id: string;
  text: string;
  order_position?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PollResponse {
  id: string;
  poll_id: string;
  respondent_name?: string;
  respondent_email?: string;
  is_anonymous?: boolean;
  submission_date: string;
  created_at?: string;
}

export interface PollAnswer {
  id: string;
  response_id: string;
  question_id: string;
  option_id?: string;
  text_answer?: string;
  rating_value?: number;
  created_at?: string;
}

export interface AudienceGroup {
  id: string;
  name: string;
  description?: string;
  count?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'spam';
  subscribed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  created_at?: string;
  updated_at?: string;
}

export interface FanMessage {
  id: string;
  title: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  template_id?: string;
  scheduledFor?: string;
  scheduled_for?: string;
  sent_at?: string;
  template?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityInitiative {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants_count?: number;
  impact_summary?: string;
  impact?: string;
  created_at?: string;
  updated_at?: string;
  volunteers?: any[];
  photos?: any[];
}
