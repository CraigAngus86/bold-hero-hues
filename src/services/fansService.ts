
import { FanContent, SocialPost, Poll, FanMessage, AudienceGroup, CommunityInitiative } from '@/types/fans';

// Mock data for fan content
export const mockFanContent: FanContent[] = [
  {
    id: '1',
    title: 'Match Day Experience',
    type: 'photo',
    submittedBy: 'John Smith',
    submittedOn: '2023-05-12T10:30:00',
    status: 'pending',
    featured: false,
  },
  {
    id: '2',
    title: 'My 30 Years Supporting Banks o\' Dee',
    type: 'story',
    submittedBy: 'Margaret Wilson',
    submittedOn: '2023-05-10T14:15:00',
    status: 'approved',
    featured: true,
    content: 'It all started in 1990 when my father took me to Spain Park for my first match. Little did I know that would be the beginning of a lifelong passion...',
  },
  {
    id: '3',
    title: 'Youth Team Champions',
    type: 'photo',
    submittedBy: 'David Brown',
    submittedOn: '2023-05-09T09:45:00',
    status: 'approved',
    featured: false,
    imageUrl: '/lovable-uploads/youth-team-champions.jpg',
  },
  {
    id: '4',
    title: 'Away Day Adventures',
    type: 'story',
    submittedBy: 'Robert Johnson',
    submittedOn: '2023-05-08T16:20:00',
    status: 'rejected',
    featured: false,
    content: 'Following the team around Scotland has given me some of the best memories. From the highlands to the lowlands, I\'ve seen it all.',
  },
  {
    id: '5',
    title: 'Fan of the Month Profile',
    type: 'profile',
    submittedBy: 'Admin',
    submittedOn: '2023-05-07T11:00:00',
    status: 'approved',
    featured: true,
    content: 'Meet Sarah, our fan of the month. Sarah has been supporting Banks o\' Dee for 15 years and never misses a home game!',
    imageUrl: '/lovable-uploads/fan-profile.jpg',
  },
];

// Mock data for social media posts
export const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content: 'What a match yesterday! @BanksODeeFc showing great form this season! #HighlandLeague #BOFC',
    author: 'FootballFan22',
    date: '2023-05-15T18:20:00',
    likes: 42,
    shares: 12,
    featured: true,
    scheduledFor: null,
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Congratulations to the team on another clean sheet! Solid defensive performance again. Looking forward to Saturday\'s match.',
    author: 'John Smith',
    date: '2023-05-14T10:15:00',
    likes: 87,
    shares: 5,
    featured: false,
    scheduledFor: '2023-05-18T09:00:00',
    imageUrl: '/lovable-uploads/match-celebration.jpg',
  },
  {
    id: '3',
    platform: 'instagram',
    content: 'Beautiful day at Spain Park! #matchday #banksodeefc',
    author: 'soccerfan_123',
    date: '2023-05-13T15:30:00',
    likes: 156,
    shares: 0,
    featured: true,
    scheduledFor: null,
    imageUrl: '/lovable-uploads/spain-park-sunny.jpg',
  },
  {
    id: '4',
    platform: 'youtube',
    content: 'Just uploaded highlights from yesterday\'s 3-0 win! Link in bio. #BanksODee #Highlights',
    author: 'FootballHighlights',
    date: '2023-05-12T20:45:00',
    likes: 210,
    shares: 32,
    featured: false,
    scheduledFor: null,
  },
  {
    id: '5',
    platform: 'twitter',
    content: 'That goal from McKenzie was absolute class! Goal of the month contender for sure. @BanksODeeFc #wondergoal',
    author: 'ScottishFootyFan',
    date: '2023-05-11T17:10:00',
    likes: 67,
    shares: 24,
    featured: false,
    scheduledFor: null,
  },
];

// Mock data for polls and surveys
export const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Player of the Month - April',
    type: 'poll',
    createdAt: '2023-04-28T10:00:00',
    startDate: '2023-05-01T00:00:00',
    endDate: '2023-05-07T23:59:59',
    status: 'ended',
    responses: 342,
    questions: [
      {
        id: '1-q1',
        text: 'Who was your Banks o\' Dee player of the month for April?',
        options: [
          { id: '1-q1-o1', text: 'Jamie Buglass', votes: 124 },
          { id: '1-q1-o2', text: 'Lachie MacLeod', votes: 87 },
          { id: '1-q1-o3', text: 'Mark Gilmour', votes: 105 },
          { id: '1-q1-o4', text: 'Kane Winton', votes: 26 },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Match Day Experience Survey',
    type: 'survey',
    createdAt: '2023-05-05T14:30:00',
    startDate: '2023-05-10T00:00:00',
    endDate: '2023-05-24T23:59:59',
    status: 'active',
    responses: 118,
    questions: [
      {
        id: '2-q1',
        text: 'How would you rate your overall match day experience?',
        options: [
          { id: '2-q1-o1', text: 'Excellent', votes: 42 },
          { id: '2-q1-o2', text: 'Good', votes: 56 },
          { id: '2-q1-o3', text: 'Average', votes: 15 },
          { id: '2-q1-o4', text: 'Poor', votes: 5 },
        ]
      },
      {
        id: '2-q2',
        text: 'What aspect of the match day experience could be improved?',
        options: [
          { id: '2-q2-o1', text: 'Food and beverages', votes: 38 },
          { id: '2-q2-o2', text: 'Seating/viewing areas', votes: 27 },
          { id: '2-q2-o3', text: 'Parking facilities', votes: 41 },
          { id: '2-q2-o4', text: 'Pre-match entertainment', votes: 12 },
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Kit Design Vote 2023/24',
    type: 'poll',
    createdAt: '2023-05-12T09:45:00',
    startDate: '2023-05-15T00:00:00',
    endDate: '2023-05-31T23:59:59',
    status: 'scheduled',
    responses: 0,
    questions: [
      {
        id: '3-q1',
        text: 'Which home kit design do you prefer for next season?',
        options: [
          { id: '3-q1-o1', text: 'Design A - Traditional stripes', votes: 0 },
          { id: '3-q1-o2', text: 'Design B - Modern pattern', votes: 0 },
          { id: '3-q1-o3', text: 'Design C - Solid with trim', votes: 0 },
        ]
      }
    ]
  }
];

// Mock data for fan messaging
export const mockMessages: FanMessage[] = [
  {
    id: '1',
    title: 'May Newsletter',
    type: 'email',
    sentDate: '2023-05-01T09:00:00',
    status: 'sent',
    audienceSize: 2456,
    opens: 1247,
    clicks: 583,
    template: 'newsletter',
    content: 'Monthly newsletter content with match reports, upcoming fixtures, and club news...'
  },
  {
    id: '2',
    title: 'Match Postponed Announcement',
    type: 'notification',
    sentDate: '2023-05-10T16:15:00',
    status: 'sent',
    audienceSize: 3128,
    opens: 2876,
    clicks: 1245,
    template: 'alert',
    content: 'Due to adverse weather conditions, tomorrow\'s match against Formartine United has been postponed...'
  },
  {
    id: '3',
    title: 'Season Ticket Early Bird Offer',
    type: 'email',
    sentDate: null,
    status: 'draft',
    audienceSize: 0,
    opens: 0,
    clicks: 0,
    template: 'promotion',
    content: 'Get ready for the new season with our early bird season ticket offer...'
  },
  {
    id: '4',
    title: 'June Newsletter',
    type: 'email',
    sentDate: null,
    status: 'scheduled',
    audienceSize: 2460,
    opens: 0,
    clicks: 0,
    template: 'newsletter',
    content: 'June newsletter draft with summer updates and pre-season information...'
  }
];

// Mock data for audience groups
export const mockAudienceGroups: AudienceGroup[] = [
  {
    id: '1',
    name: 'All Subscribers',
    count: 3214,
    tags: ['subscribers', 'all']
  },
  {
    id: '2',
    name: 'Season Ticket Holders',
    count: 547,
    tags: ['subscribers', 'season-tickets']
  },
  {
    id: '3',
    name: 'Youth Supporters',
    count: 689,
    tags: ['subscribers', 'youth']
  },
  {
    id: '4',
    name: 'Sponsors and Partners',
    count: 42,
    tags: ['subscribers', 'sponsors']
  }
];

// Mock data for community initiatives
export const mockCommunityInitiatives: CommunityInitiative[] = [
  {
    id: '1',
    title: 'Youth Football Camp',
    type: 'youth',
    date: '2023-06-15T09:00:00',
    location: 'Spain Park Training Fields',
    status: 'upcoming',
    volunteers: 15,
    participants: 120,
    description: 'A week-long football camp for young players aged 7-14, focusing on skills development and team building.',
    impact: 'Provides high-quality football coaching to local youth and promotes community engagement with the club.',
    images: [
      '/lovable-uploads/youth-camp-1.jpg',
      '/lovable-uploads/youth-camp-2.jpg'
    ]
  },
  {
    id: '2',
    title: 'Food Bank Collection',
    type: 'charity',
    date: '2023-05-20T12:00:00',
    location: 'Spain Park Stadium',
    status: 'upcoming',
    volunteers: 8,
    participants: 0,
    description: 'Match day food collection for the local food bank. Fans are encouraged to bring non-perishable food items.',
    impact: 'Supporting families in need within our local community and raising awareness of food poverty issues.',
    images: []
  },
  {
    id: '3',
    title: 'School Visits Program',
    type: 'education',
    date: '2023-04-10T10:00:00',
    location: 'Various Aberdeen Schools',
    status: 'completed',
    volunteers: 6,
    participants: 450,
    description: 'Players and staff visiting local schools to promote physical activity and healthy lifestyles.',
    impact: 'Engaged with over 450 children across 5 local schools, promoting both education and physical activity.',
    images: [
      '/lovable-uploads/school-visit-1.jpg',
      '/lovable-uploads/school-visit-2.jpg'
    ]
  },
  {
    id: '4',
    title: 'Community Clean-Up Day',
    type: 'community',
    date: '2023-03-25T09:30:00',
    location: 'Bridge of Dee Area',
    status: 'completed',
    volunteers: 35,
    participants: 62,
    description: 'Club-organized community clean-up day, focusing on the areas around Bridge of Dee and the riverside.',
    impact: 'Collected over 100 bags of litter and improved local green spaces for community enjoyment.',
    images: [
      '/lovable-uploads/cleanup-1.jpg'
    ]
  }
];

// Service functions for fan content
export const fetchFanContent = (): Promise<FanContent[]> => {
  return Promise.resolve(mockFanContent);
};

export const fetchSocialPosts = (): Promise<SocialPost[]> => {
  return Promise.resolve(mockSocialPosts);
};

export const fetchPolls = (): Promise<Poll[]> => {
  return Promise.resolve(mockPolls);
};

export const fetchFanMessages = (): Promise<FanMessage[]> => {
  return Promise.resolve(mockMessages);
};

export const fetchAudienceGroups = (): Promise<AudienceGroup[]> => {
  return Promise.resolve(mockAudienceGroups);
};

export const fetchCommunityInitiatives = (): Promise<CommunityInitiative[]> => {
  return Promise.resolve(mockCommunityInitiatives);
};

// More functions would be added for creating, updating, and deleting each type of content
