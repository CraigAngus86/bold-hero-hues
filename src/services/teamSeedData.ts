
import { TeamMember } from '@/types/team';

// Sample team data for initial state or demo purposes
const sampleTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Mark Wilson',
    member_type: 'player',
    position: 'Goalkeeper',
    image_url: '/lovable-uploads/player1.jpg',
    bio: 'Experienced goalkeeper with strong leadership skills.',
    nationality: 'Scotland',
    experience: '10 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jersey_number: 1,
    previous_clubs: ['Aberdeen FC', 'Inverness CT'],
    stats: {
      appearances: 45,
      cleanSheets: 20
    }
  },
  {
    id: '2',
    name: 'Jamie McDonald',
    member_type: 'player',
    position: 'Defender',
    image_url: '/lovable-uploads/player2.jpg',
    bio: 'Strong, reliable defender with excellent tackling ability.',
    nationality: 'Scotland',
    experience: '8 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jersey_number: 5,
    previous_clubs: ['Ross County', 'Inverness CT'],
    stats: {
      appearances: 52,
      goals: 3
    }
  },
  {
    id: '3',
    name: 'Ryan Stewart',
    member_type: 'player',
    position: 'Midfielder',
    image_url: '/lovable-uploads/player3.jpg',
    bio: 'Creative midfielder with excellent vision and passing ability.',
    nationality: 'Scotland',
    experience: '7 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jersey_number: 8,
    previous_clubs: ['Hearts', 'Falkirk'],
    stats: {
      appearances: 49,
      goals: 8,
      assists: 15
    }
  },
  {
    id: '4',
    name: 'David Campbell',
    member_type: 'player',
    position: 'Forward',
    image_url: '/lovable-uploads/player4.jpg',
    bio: 'Prolific striker with exceptional finishing ability.',
    nationality: 'Scotland',
    experience: '9 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    jersey_number: 10,
    previous_clubs: ['Dundee', 'St. Johnstone'],
    stats: {
      appearances: 50,
      goals: 23,
      assists: 7
    }
  },
  {
    id: '5',
    name: 'Alan Thompson',
    member_type: 'management',
    position: 'Head Coach',
    image_url: '/lovable-uploads/coach.jpg',
    bio: 'Experienced manager with a track record of developing young talent.',
    nationality: 'Scotland',
    experience: '12 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Ian MacLeod',
    member_type: 'management',
    position: 'Assistant Coach',
    image_url: '/lovable-uploads/assistant.jpg',
    bio: 'Former professional player turned coach with tactical expertise.',
    nationality: 'Scotland',
    experience: '8 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'John Edwards',
    member_type: 'official',
    position: 'Club Chairman',
    image_url: '/lovable-uploads/chairman.jpg',
    bio: 'Businessman and long-time supporter of the club.',
    nationality: 'Scotland',
    experience: '15 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Sarah Mitchell',
    member_type: 'official',
    position: 'Club Secretary',
    image_url: '/lovable-uploads/secretary.jpg',
    bio: 'Dedicated administrator ensuring smooth club operations.',
    nationality: 'Scotland',
    experience: '10 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to seed the team data
export const seedTeamData = () => {
  return sampleTeamMembers;
};

export default seedTeamData;
