
declare type FanContent = {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_on: string;
  submitted_by: string;
  type: string;
  featured: boolean;
  user_reputation?: number;
  moderated_by?: string;
  moderation_date?: string;
  moderation_notes?: string;
};

declare type Poll = {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  created_by?: string;
  startDate?: string;
  endDate?: string;
  published_at?: string;
  is_featured?: boolean;
  questions?: PollQuestion[];
};

declare type PollQuestion = {
  id: string;
  poll_id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  required: boolean;
  order_position: number;
  options?: PollOption[];
};

declare type PollOption = {
  id: string;
  question_id: string;
  text: string;
  order_position: number;
};

declare type AudienceGroup = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  subscribers?: Subscriber[];
};

declare type Subscriber = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  subscribed_at: string;
  groups?: AudienceGroup[];
};

declare type MessageTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  created_at: string;
  updated_at: string;
};

declare type FanMessage = {
  id: string;
  title: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
  scheduled_for?: string;
  sent_at?: string;
  template_id?: string;
  recipients?: { subscribers?: string[], groups?: string[] };
};

declare type CommunityInitiative = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  end_date?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants_count?: number;
  impactSummary?: string;
  photos?: { id: string; image_url: string; caption?: string }[];
  volunteers?: { id: string; name: string; email: string; role?: string }[];
};
