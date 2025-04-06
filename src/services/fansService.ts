
import { Poll, PollQuestion, FanContent, AudienceGroup, CommunityInitiative } from '@/types/fans';

// Generate mock data for demos
export const getMockFanContent = (): FanContent[] => {
  return [
    {
      id: '1',
      title: 'Match Day Experience',
      type: 'photo',
      submittedBy: 'John Smith',
      submittedOn: new Date(2023, 4, 12).toISOString(),
      status: 'pending',
      featured: false,
      imageUrl: 'https://placehold.co/600x400/png'
    },
    {
      id: '2',
      title: 'My 30 Years Supporting Banks o\' Dee',
      type: 'story',
      submittedBy: 'Margaret Wilson',
      submittedOn: new Date(2023, 4, 10).toISOString(),
      status: 'approved',
      featured: true,
      content: 'It all started in 1990 when my father took me to Spain Park for my first match. Little did I know that would be the beginning of a lifelong passion...'
    },
    {
      id: '3',
      title: 'Youth Team Champions',
      type: 'photo',
      submittedBy: 'David Brown',
      submittedOn: new Date(2023, 4, 9).toISOString(),
      status: 'approved',
      featured: false,
      imageUrl: 'https://placehold.co/600x400/png'
    },
    {
      id: '4',
      title: 'Away Day Adventures',
      type: 'story',
      submittedBy: 'Robert Johnson',
      submittedOn: new Date(2023, 4, 8).toISOString(),
      status: 'rejected',
      featured: false,
      content: 'Following the team to away matches has led to some incredible adventures...'
    }
  ];
};

export const getMockPolls = (): Poll[] => {
  const playerOfMonthPoll: Poll = {
    id: '1',
    title: 'Player of the Month - April',
    description: 'Vote for your Banks o\' Dee player of the month for April',
    type: 'poll',
    createdAt: new Date(2023, 3, 28).toISOString(),
    startDate: new Date(2023, 3, 1).toISOString(),
    endDate: new Date(2023, 3, 30).toISOString(),
    status: 'ended',
    responses: 253,
    questions: [
      {
        id: '1',
        text: 'Who was the standout player for April?',
        type: 'single_choice',
        required: true,
        options: [
          { id: '1', text: 'John Smith', votes: 85 },
          { id: '2', text: 'Michael Johnson', votes: 67 },
          { id: '3', text: 'David Williams', votes: 101 },
        ]
      }
    ]
  };

  const matchDayExperienceSurvey: Poll = {
    id: '2',
    title: 'Match Day Experience Survey',
    description: 'Help us improve your experience at Spain Park',
    type: 'survey',
    createdAt: new Date(2023, 4, 1).toISOString(),
    startDate: new Date(2023, 4, 1).toISOString(),
    endDate: new Date(2023, 4, 31).toISOString(),
    status: 'active',
    responses: 78,
    questions: [
      {
        id: '1',
        text: 'How would you rate your overall match day experience?',
        type: 'rating',
        required: true,
        options: []
      },
      {
        id: '2',
        text: 'Which aspects of the match day experience could be improved?',
        type: 'multiple_choice',
        required: false,
        options: [
          { id: '1', text: 'Food and beverages', votes: 45 },
          { id: '2', text: 'Seating comfort', votes: 32 },
          { id: '3', text: 'Access and parking', votes: 51 },
          { id: '4', text: 'Pre-match entertainment', votes: 22 },
        ]
      },
      {
        id: '3',
        text: 'Any additional comments or suggestions?',
        type: 'text',
        required: false,
      }
    ]
  };

  const kitDesignPoll: Poll = {
    id: '3',
    title: 'Kit Design Vote 2023/24',
    description: 'Choose your favorite design for next season\'s kit',
    type: 'poll',
    createdAt: new Date(2023, 4, 5).toISOString(), 
    startDate: new Date(2023, 5, 1).toISOString(),
    endDate: new Date(2023, 5, 15).toISOString(),
    status: 'scheduled',
    responses: 0,
    questions: [
      {
        id: '1',
        text: 'Which home kit design do you prefer?',
        type: 'single_choice',
        required: true,
        options: [
          { id: '1', text: 'Design A - Traditional stripes', votes: 0 },
          { id: '2', text: 'Design B - Modern pattern', votes: 0 },
          { id: '3', text: 'Design C - Classic solid', votes: 0 },
        ]
      }
    ]
  };

  return [playerOfMonthPoll, matchDayExperienceSurvey, kitDesignPoll];
};

export const getMockAudienceGroups = (): AudienceGroup[] => {
  return [
    {
      id: '1',
      name: 'Season Ticket Holders',
      count: 457,
      tags: ['season-ticket', 'supporters'],
      description: 'All current season ticket holders'
    },
    {
      id: '2',
      name: 'Newsletter Subscribers',
      count: 1248,
      tags: ['newsletter', 'email'],
      description: 'Fans who have subscribed to the weekly newsletter'
    },
    {
      id: '3',
      name: 'Youth Team Parents',
      count: 126,
      tags: ['youth', 'parents', 'academy'],
      description: 'Parents of players in the youth academy'
    },
    {
      id: '4',
      name: 'Club Members',
      count: 315,
      tags: ['members', 'supporters'],
      description: 'Official club members with paid membership'
    }
  ];
};

export const getMockCommunityInitiatives = (): CommunityInitiative[] => {
  return [
    {
      id: '1',
      title: 'Youth Football Camp',
      description: 'A week-long football camp for young players aged 7-14, focusing on skills development and team building.',
      impact: 'Provides high-quality football coaching to local youth and promotes community engagement with the club.',
      type: 'youth',
      date: new Date(2023, 6, 15).toISOString(),
      end_date: new Date(2023, 6, 22).toISOString(),
      location: 'Spain Park Training Fields',
      status: 'upcoming',
      volunteers: 12,
      participants: 45
    },
    {
      id: '2',
      title: 'Food Bank Collection',
      description: 'Match day food collection for the local food bank. Fans are encouraged to bring non-perishable food items.',
      impact: 'Supporting families in need within our local community and raising awareness of food poverty issues.',
      type: 'charity',
      date: new Date(2023, 4, 20).toISOString(),
      location: 'Spain Park Stadium',
      status: 'upcoming',
      volunteers: 5,
      participants: 0
    },
    {
      id: '3',
      title: 'School Visits Program',
      description: 'Players and staff visiting local schools to promote physical activity and healthy lifestyles.',
      impact: 'Engaged with over 450 children across 5 local schools, promoting both education and physical activity.',
      type: 'education',
      date: new Date(2023, 3, 10).toISOString(),
      end_date: new Date(2023, 3, 14).toISOString(),
      location: 'Various Aberdeen Schools',
      status: 'completed',
      volunteers: 8,
      participants: 450
    },
    {
      id: '4',
      title: 'Community Clean-up Day',
      description: 'Staff, players, and volunteers coming together to clean up the local area around Spain Park.',
      impact: 'Improving the local environment and showing the club\'s commitment to the community.',
      type: 'community',
      date: new Date(2023, 5, 5).toISOString(),
      location: 'Spain Park and surrounding areas',
      status: 'completed',
      volunteers: 24,
      participants: 35
    }
  ];
};
