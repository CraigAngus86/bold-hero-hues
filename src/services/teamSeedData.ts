
import { TeamMember } from '@/types/team';

// Sample team data for development/testing
export const seedTeamData: TeamMember[] = [
  {
    id: 'player-1',
    name: 'John Smith',
    member_type: 'player',
    position: 'Goalkeeper',
    image_url: '/lovable-uploads/player-generic.png',
    bio: 'Experienced goalkeeper with excellent reflexes.',
    nationality: 'Scotland',
    jersey_number: 1,
    experience: '10 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'player-2',
    name: 'David Williams',
    member_type: 'player',
    position: 'Defender',
    image_url: '/lovable-uploads/player-generic.png',
    bio: 'Solid center back with good aerial ability.',
    nationality: 'England',
    jersey_number: 5,
    experience: '8 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'player-3',
    name: 'Andrew Brown',
    member_type: 'player',
    position: 'Midfielder',
    image_url: '/lovable-uploads/player-generic.png',
    bio: 'Creative midfielder with excellent passing range.',
    nationality: 'Scotland',
    jersey_number: 8,
    experience: '7 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'player-4',
    name: 'James Wilson',
    member_type: 'player',
    position: 'Forward',
    image_url: '/lovable-uploads/player-generic.png',
    bio: 'Prolific striker with good movement.',
    nationality: 'Wales',
    jersey_number: 9,
    experience: '6 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'staff-1',
    name: 'Robert Johnson',
    member_type: 'management',
    position: 'Head Coach',
    image_url: '/lovable-uploads/coach-generic.png',
    bio: 'Experienced coach with a focus on attacking football.',
    nationality: 'Scotland',
    experience: '15 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'official-1',
    name: 'Thomas Clark',
    member_type: 'official',
    position: 'Club Chairman',
    image_url: '/lovable-uploads/official-generic.png',
    bio: 'Leading the club since 2018.',
    nationality: 'Scotland',
    experience: '12 years',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to initialize team store with seed data
export const initializeTeamStore = (addTeamMember) => {
  seedTeamData.forEach(member => {
    addTeamMember(member);
  });
};
