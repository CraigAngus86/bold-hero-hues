
export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: 'draft' | 'published' | 'closed';
  is_featured: boolean;
  start_date?: string;
  end_date?: string;
  published_at?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PollQuestion {
  id: string;
  poll_id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  required: boolean;
  order_position?: number;
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
