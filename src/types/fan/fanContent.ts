
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
  scheduled_for?: string;
  sent_at?: string;
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
