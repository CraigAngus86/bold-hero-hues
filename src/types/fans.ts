
// Define fan-related interfaces

export interface FanContent {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  submitted_by: string;
  submitted_on?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: string;
  featured: boolean;
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
  created_at?: string;
  created_by?: string;
  published_at?: string;
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  updated_at?: string;
}

export interface PollQuestion {
  id: string;
  poll_id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  order_position?: number;
  required?: boolean;
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

export interface AudienceGroup {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'inactive' | 'unsubscribed';
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
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduled_for?: string;
  sent_at?: string;
  template_id?: string;
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
  created_at?: string;
  updated_at?: string;
}

// Define fan-related response types
export interface FanContentResponse {
  data: FanContent[];
  count: number;
  error?: string;
}

export interface PollResponse {
  data: Poll[];
  count: number;
  error?: string;
}
