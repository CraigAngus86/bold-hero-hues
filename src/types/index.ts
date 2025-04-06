
// Common types used across the application

export interface SystemLog {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  message: string;
}

export interface MatchMedia {
  id: string;
  matchId: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  isFeatured?: boolean;
  dateAdded: string;
  addedBy?: string;
  credit?: string;
  tags?: string[];
}

export interface MatchEvent {
  id: string;
  matchId: string;
  time: number; // Minutes into the match
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'other';
  player?: string;
  team: string;
  description?: string;
}

export interface MatchLineup {
  matchId: string;
  teamId: string;
  players: LineupPlayer[];
}

export interface LineupPlayer {
  id: string;
  name: string;
  position: string;
  number?: number;
  isStarting: boolean;
}

export interface MatchStats {
  matchId: string;
  possession?: [number, number]; // Home, Away percentages
  shots?: [number, number]; // Home, Away
  shotsOnTarget?: [number, number]; // Home, Away
  corners?: [number, number]; // Home, Away
  fouls?: [number, number]; // Home, Away
  offsides?: [number, number]; // Home, Away
}

// News related types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  category: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
  author?: string;
  is_featured: boolean;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  slug?: string;
  image_url?: string;
  category: string;
  publish_date: string;
  author?: string;
  is_featured: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  slug?: string;
  image_url?: string;
  category?: string;
  publish_date?: string;
  author?: string;
  is_featured?: boolean;
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Fixture/Match types
export interface Fixture {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  season?: string;
  ticketLink?: string;
  source?: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
  media?: MatchMedia[];
}

export interface Match extends Omit<Fixture, 'venue'> {
  venue: string; // Make venue required in Match
}

// Team related types
export interface TeamStats {
  id: string;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string[];
  logo?: string;
  // Legacy fields maintained for backward compatibility
  wins?: number;
  draws?: number;
  losses?: number;
  cleanSheets?: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

// Image related types
export interface ImageFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded: string;
  folder: string;
}

// Email related types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
}

export interface EmailLog {
  id: string;
  template_id?: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at: string;
  error?: string;
}

// Sponsor related types
export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  display_order?: number;
  renewal_status?: string;
}

export interface SponsorContact {
  id: string;
  sponsor_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  primary_contact: boolean;
  notes?: string;
}

export interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  contact_id?: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'other';
  subject: string;
  content?: string;
  created_by: string;
}

// Role and permission types
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
}

// System status type
export interface SystemStatus {
  lastBackup?: string;
  storageUsage: {
    total: number;
    used: number;
    percentage: number;
  };
  serverStatus: 'online' | 'offline' | 'degraded';
  databaseStatus: 'online' | 'offline' | 'degraded';
  lastError?: {
    timestamp: string;
    message: string;
  };
  newUsers24h: number;
  activeUsers: number;
}

// Fan engagement types
export interface FanContent {
  id: string;
  type: string;
  title: string;
  content?: string;
  image_url?: string;
  submittedBy: string;
  submittedOn: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  moderation_notes?: string;
  moderated_by?: string;
  moderation_date?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  type: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  questions: PollQuestion[];
  responses: number;
}

export interface PollQuestion {
  id: string;
  pollId: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'rating' | 'text';
  required: boolean;
  orderPosition: number;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  questionId: string;
  text: string;
  orderPosition: number;
}

export interface PollResponse {
  id: string;
  pollId: string;
  respondentName?: string;
  respondentEmail?: string;
  isAnonymous: boolean;
  submissionDate: string;
  answers: PollAnswer[];
}

export interface PollAnswer {
  id: string;
  responseId: string;
  questionId: string;
  optionId?: string;
  textAnswer?: string;
  ratingValue?: number;
}

export interface AudienceGroup {
  id: string;
  name: string;
  description?: string;
  count: number;
  tags?: string[];
}

export interface FanMessage {
  id: string;
  title: string;
  type: 'email' | 'sms';
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  template?: EmailTemplate;
  sentDate?: string;
  audienceSize: number;
  opens: number;
  clicks: number;
}

export interface FanSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  groups: AudienceGroup[];
}

// Community engagement types
export interface CommunityInitiative {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  end_date?: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  impact_summary?: string;
  participants_count: number;
  volunteers: CommunityVolunteer[];
  participants: number;
  impact: string;
}

export interface CommunityVolunteer {
  id: string;
  initiative_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status: string;
  notes?: string;
}
