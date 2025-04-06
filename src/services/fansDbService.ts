
import { supabase } from '@/integrations/supabase/client';
import { 
  FanContent, 
  SocialPost, 
  Poll, 
  PollQuestion, 
  PollOption, 
  FanMessage,
  AudienceGroup,
  CommunityInitiative 
} from '@/types/fans';
import { toast } from 'sonner';

// Fan Content Management
export const fetchFanContent = async (filters?: {
  type?: string;
  status?: string;
  featured?: boolean;
}) => {
  try {
    let query = supabase
      .from('fan_content')
      .select('*')
      .order('submitted_on', { ascending: false });
    
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as FanContent[]
    };
  } catch (error) {
    console.error('Error fetching fan content:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const updateFanContentStatus = async (id: string, status: 'pending' | 'approved' | 'rejected', moderationNotes?: string) => {
  try {
    const { data, error } = await supabase
      .from('fan_content')
      .update({ 
        status, 
        moderation_notes: moderationNotes,
        moderation_date: new Date().toISOString(),
        // In a real app, we would get the moderator ID from the auth context
        moderated_by: '00000000-0000-0000-0000-000000000000'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`Error updating fan content status to ${status}:`, error);
    return {
      success: false,
      error
    };
  }
};

export const toggleContentFeatured = async (id: string, featured: boolean) => {
  try {
    const { data, error } = await supabase
      .from('fan_content')
      .update({ featured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return {
      success: false,
      error
    };
  }
};

export const deleteFanContent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('fan_content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting fan content:', error);
    return {
      success: false,
      error
    };
  }
};

// Polls and Surveys
export const fetchPolls = async (filters?: {
  type?: 'poll' | 'survey';
  status?: 'draft' | 'active' | 'scheduled' | 'ended';
  featured?: boolean;
}) => {
  try {
    let query = supabase
      .from('fan_polls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as Poll[]
    };
  } catch (error) {
    console.error('Error fetching polls:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const fetchPollDetails = async (pollId: string) => {
  try {
    // Get poll
    const { data: poll, error: pollError } = await supabase
      .from('fan_polls')
      .select('*')
      .eq('id', pollId)
      .single();
    
    if (pollError) throw pollError;
    
    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('fan_poll_questions')
      .select('*')
      .eq('poll_id', pollId)
      .order('order_position');
    
    if (questionsError) throw questionsError;
    
    // Get options for each question
    const questionsWithOptions = await Promise.all(questions.map(async (question) => {
      const { data: options, error: optionsError } = await supabase
        .from('fan_poll_options')
        .select('*')
        .eq('question_id', question.id)
        .order('order_position');
      
      if (optionsError) throw optionsError;
      
      return {
        ...question,
        options
      };
    }));
    
    // Get response count
    const { count, error: countError } = await supabase
      .from('fan_poll_responses')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId);
    
    if (countError) throw countError;
    
    return {
      success: true,
      data: {
        ...poll,
        questions: questionsWithOptions,
        responses: count || 0
      }
    };
  } catch (error) {
    console.error('Error fetching poll details:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const createPoll = async (pollData: Omit<Poll, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('fan_polls')
      .insert(pollData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating poll:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const addPollQuestion = async (questionData: Omit<PollQuestion, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('fan_poll_questions')
      .insert(questionData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error adding poll question:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const addPollOption = async (optionData: Omit<PollOption, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('fan_poll_options')
      .insert(optionData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error adding poll option:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Fan Messaging
export const fetchAudienceGroups = async () => {
  try {
    const { data, error } = await supabase
      .from('fan_audience_groups')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as AudienceGroup[]
    };
  } catch (error) {
    console.error('Error fetching audience groups:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const fetchSubscribers = async (groupId?: string) => {
  try {
    if (groupId) {
      const { data, error } = await supabase
        .from('fan_subscriber_groups')
        .select('fan_subscribers(*)')
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      return {
        success: true,
        data: data.map(item => item.fan_subscribers)
      };
    } else {
      const { data, error } = await supabase
        .from('fan_subscribers')
        .select('*')
        .order('last_name');
      
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    }
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const fetchMessageTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('fan_message_templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching message templates:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const fetchMessages = async (filters?: {
  type?: 'email' | 'notification';
  status?: 'draft' | 'scheduled' | 'sent';
}) => {
  try {
    let query = supabase
      .from('fan_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as FanMessage[]
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const createMessage = async (messageData: Omit<FanMessage, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('fan_messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating message:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Community Initiatives
export const fetchCommunityInitiatives = async (filters?: {
  type?: string;
  status?: string;
}) => {
  try {
    let query = supabase
      .from('community_initiatives')
      .select('*')
      .order('date', { ascending: true });
    
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as CommunityInitiative[]
    };
  } catch (error) {
    console.error('Error fetching community initiatives:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const fetchInitiativeDetails = async (id: string) => {
  try {
    // Get initiative
    const { data: initiative, error: initiativeError } = await supabase
      .from('community_initiatives')
      .select('*')
      .eq('id', id)
      .single();
    
    if (initiativeError) throw initiativeError;
    
    // Get volunteers
    const { data: volunteers, error: volunteersError } = await supabase
      .from('community_volunteers')
      .select('*')
      .eq('initiative_id', id)
      .order('name');
    
    if (volunteersError) throw volunteersError;
    
    // Get photos
    const { data: photos, error: photosError } = await supabase
      .from('community_photos')
      .select('*')
      .eq('initiative_id', id)
      .order('order_position');
    
    if (photosError) throw photosError;
    
    return {
      success: true,
      data: {
        ...initiative,
        volunteers: volunteers || [],
        photos: photos || []
      }
    };
  } catch (error) {
    console.error('Error fetching initiative details:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const createInitiative = async (initiative: Omit<CommunityInitiative, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('community_initiatives')
      .insert(initiative)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating initiative:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export default {
  // Fan Content
  fetchFanContent,
  updateFanContentStatus,
  toggleContentFeatured,
  deleteFanContent,
  
  // Polls and Surveys
  fetchPolls,
  fetchPollDetails,
  createPoll,
  addPollQuestion,
  addPollOption,
  
  // Fan Messaging
  fetchAudienceGroups,
  fetchSubscribers,
  fetchMessageTemplates,
  fetchMessages,
  createMessage,
  
  // Community Initiatives
  fetchCommunityInitiatives,
  fetchInitiativeDetails,
  createInitiative
};
