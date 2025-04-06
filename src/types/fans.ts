
// Types for fan content
export interface FanContent {
  id: string;
  title: string;
  type: 'photo' | 'story' | 'profile';
  submittedBy: string;
  submittedOn: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  content?: string;
  imageUrl?: string;
  user_reputation?: number;
  moderation_notes?: string;
  moderated_by?: string;
  moderation_date?: string;
}

// Types for social media posts
export interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube';
  content: string;
  author: string;
  date: string | null;
  likes: number;
  shares: number;
  featured: boolean;
  scheduledFor: string | null;
  imageUrl?: string | null;
}

// Types for polls and surveys
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'rating';
  required?: boolean;
  options?: PollOption[];
  order_position?: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: 'poll' | 'survey';
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
  status: 'active' | 'ended' | 'draft' | 'scheduled';
  responses: number;
  questions: PollQuestion[];
  is_featured?: boolean;
  created_by?: string;
  published_at?: string;
}

// Types for fan messaging
export interface FanMessage {
  id: string;
  title: string;
  type: 'email' | 'notification';
  sentDate: string | null;
  status: 'sent' | 'draft' | 'scheduled';
  audienceSize: number;
  opens: number;
  clicks: number;
  template: string;
  content?: string;
  subject?: string;
}

export interface AudienceGroup {
  id: string;
  name: string;
  count: number;
  tags: string[];
  description?: string;
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

// Types for community initiatives
export interface CommunityInitiative {
  id: string;
  title: string;
  type: 'youth' | 'charity' | 'education' | 'community';
  date: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed';
  volunteers: number;
  participants: number;
  description: string;
  impact: string;
  images?: string[];
  end_date?: string | null;
}

export interface CommunityVolunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status: 'registered' | 'confirmed' | 'attended' | 'no_show';
  notes?: string;
  initiative_id: string;
}

export interface CommunityPhoto {
  id: string;
  initiative_id: string;
  image_url: string;
  caption?: string;
  order_position?: number;
}
