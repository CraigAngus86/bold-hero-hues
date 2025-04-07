
// Define fan-related interfaces to fix type errors

export interface FanContent {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  submitted_by: string;
  submitted_on: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  user_reputation?: number;
  moderated_by?: string;
  moderation_date?: string;
  moderation_notes?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: 'poll' | 'survey' | 'player_vote' | 'feedback' | 'preference';
  status: 'draft' | 'active' | 'scheduled' | 'ended';
  startDate?: string;
  endDate?: string;
  is_featured: boolean;
  created_by?: string;
  published_at?: string;
  created_at: string;
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
  order_position: number;
  options?: PollOption[];
}

export interface PollOption {
  id: string;
  question_id: string;
  text: string;
  order_position: number;
}

export interface AudienceGroup {
  id: string;
  name: string;
  description?: string;
  count?: number; // Non-DB field for UI
}

export interface Subscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'notification';
}

export interface FanMessage {
  id: string;
  title: string;
  subject: string;
  content: string;
  type: 'email' | 'notification';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  template?: string;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram';
  content: string;
  image_url?: string;
  posted_at: string;
  post_url?: string; // Added missing property
  status?: 'draft' | 'published' | 'scheduled' | 'failed'; // Added missing property
  scheduled_for?: string; // Added missing property
  created_at?: string; // Added missing property
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface CommunityInitiative {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  end_date?: string;
  location: string;
  status: string;
  impact?: string; // For UI field not in DB schema
  participants?: number;
  volunteers?: any[];
  photos?: any[];
}
