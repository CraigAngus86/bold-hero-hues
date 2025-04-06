
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
}

// Types for social media posts
export interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube';
  content: string;
  author: string;
  date: string;
  likes: number;
  shares: number;
  featured: boolean;
  scheduledFor: string | null;
  imageUrl?: string;
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
  options: PollOption[];
}

export interface Poll {
  id: string;
  title: string;
  type: 'poll' | 'survey';
  createdAt: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'ended' | 'draft' | 'scheduled';
  responses: number;
  questions: PollQuestion[];
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
}

export interface AudienceGroup {
  id: string;
  name: string;
  count: number;
  tags: string[];
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
}
