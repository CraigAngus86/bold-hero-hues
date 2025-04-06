import { TeamMember } from '@/types/team';

export const seedTeamData = async (): Promise<void> => {
  console.log('Seeding team data...');
  // This would typically populate the database with initial team members
  // For now, just a stub function
};

export const player1: Omit<TeamMember, 'id'> = {
  name: 'John Smith',
  member_type: 'player',
  position: 'Striker',
  image_url: '/path/to/image1.jpg',
  bio: 'Experienced striker with a keen eye for goal.',
  nationality: 'Scotland',
  jersey_number: 9,
  previous_clubs: ['Aberdeen FC Youth', 'Formartine United'],
  experience: '10 years',
  is_active: true,
  stats: {
    appearances: 45,
    goals: 32,
    assists: 12,
    yellowCards: 5,
    redCards: 1,
    minutesPlayed: 3890
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player2: Omit<TeamMember, 'id'> = {
  name: 'Michael Brown',
  member_type: 'player',
  position: 'Midfielder',
  image_url: '/path/to/image2.jpg',
  bio: 'Creative midfielder with excellent passing skills.',
  nationality: 'England',
  jersey_number: 7,
  previous_clubs: ['Manchester United Youth', 'Inverness CT'],
  experience: '8 years',
  is_active: true,
  stats: {
    appearances: 38,
    goals: 8,
    assists: 18,
    yellowCards: 3,
    redCards: 0,
    minutesPlayed: 3200
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player3: Omit<TeamMember, 'id'> = {
  name: 'David Wilson',
  member_type: 'player',
  position: 'Defender',
  image_url: '/path/to/image3.jpg',
  bio: 'Solid defender known for his tackling and aerial ability.',
  nationality: 'Wales',
  jersey_number: 5,
  previous_clubs: ['Cardiff City Youth', 'Peterhead FC'],
  experience: '12 years',
  is_active: true,
  stats: {
    appearances: 40,
    goals: 2,
    assists: 1,
    yellowCards: 7,
    redCards: 2,
    minutesPlayed: 3600
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player4: Omit<TeamMember, 'id'> = {
  name: 'Ryan Taylor',
  member_type: 'player',
  position: 'Goalkeeper',
  image_url: '/path/to/image4.jpg',
  bio: 'Reliable goalkeeper with great reflexes and command of his area.',
  nationality: 'Northern Ireland',
  jersey_number: 1,
  previous_clubs: ['Linfield FC Youth', 'Elgin City'],
  experience: '9 years',
  is_active: true,
  stats: {
    appearances: 42,
    cleanSheets: 18,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 3780
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player5: Omit<TeamMember, 'id'> = {
  name: 'Andrew Clark',
  member_type: 'player',
  position: 'Midfielder',
  image_url: '/path/to/image5.jpg',
  bio: 'Dynamic midfielder with a knack for scoring crucial goals.',
  nationality: 'Scotland',
  jersey_number: 8,
  previous_clubs: ['Rangers FC Youth', 'Dundee United'],
  experience: '11 years',
  is_active: true,
  stats: {
    appearances: 39,
    goals: 15,
    assists: 9,
    yellowCards: 4,
    redCards: 0,
    minutesPlayed: 3300
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player6: Omit<TeamMember, 'id'> = {
  name: 'Lewis Young',
  member_type: 'player',
  position: 'Defender',
  image_url: '/path/to/image6.jpg',
  bio: 'Versatile defender capable of playing in multiple positions.',
  nationality: 'England',
  jersey_number: 3,
  previous_clubs: ['Chelsea FC Youth', 'Stirling Albion'],
  experience: '7 years',
  is_active: true,
  stats: {
    appearances: 35,
    goals: 1,
    assists: 3,
    yellowCards: 6,
    redCards: 1,
    minutesPlayed: 3000
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player7: Omit<TeamMember, 'id'> = {
  name: 'Stuart Campbell',
  member_type: 'player',
  position: 'Striker',
  image_url: '/path/to/image7.jpg',
  bio: 'Pacy striker with a clinical finish.',
  nationality: 'Scotland',
  jersey_number: 11,
  previous_clubs: ['Celtic FC Youth', 'Alloa Athletic'],
  experience: '6 years',
  is_active: true,
  stats: {
    appearances: 30,
    goals: 20,
    assists: 7,
    yellowCards: 2,
    redCards: 0,
    minutesPlayed: 2500
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player8: Omit<TeamMember, 'id'> = {
  name: 'Gary MacDonald',
  member_type: 'player',
  position: 'Midfielder',
  image_url: '/path/to/image8.jpg',
  bio: 'Hardworking midfielder with a great engine and tackling ability.',
  nationality: 'Scotland',
  jersey_number: 6,
  previous_clubs: ['Hearts FC Youth', 'Brechin City'],
  experience: '13 years',
  is_active: true,
  stats: {
    appearances: 42,
    goals: 4,
    assists: 5,
    yellowCards: 8,
    redCards: 1,
    minutesPlayed: 3650
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player9: Omit<TeamMember, 'id'> = {
  name: 'Craig Robertson',
  member_type: 'player',
  position: 'Defender',
  image_url: '/path/to/image9.jpg',
  bio: 'Commanding center-back with excellent leadership qualities.',
  nationality: 'Scotland',
  jersey_number: 4,
  previous_clubs: ['Hibernian FC Youth', 'Cowdenbeath'],
  experience: '10 years',
  is_active: true,
  stats: {
    appearances: 41,
    goals: 3,
    assists: 2,
    yellowCards: 5,
    redCards: 0,
    minutesPlayed: 3500
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player10: Omit<TeamMember, 'id'> = {
  name: 'Scott McKenzie',
  member_type: 'player',
  position: 'Winger',
  image_url: '/path/to/image10.jpg',
  bio: 'Skillful winger with pace and trickery.',
  nationality: 'Scotland',
  jersey_number: 10,
  previous_clubs: ['Aberdeen FC Youth', 'Peterhead FC'],
  experience: '5 years',
  is_active: true,
  stats: {
    appearances: 32,
    goals: 6,
    assists: 10,
    yellowCards: 1,
    redCards: 0,
    minutesPlayed: 2700
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const player11: Omit<TeamMember, 'id'> = {
  name: 'Alan Davidson',
  member_type: 'player',
  position: 'Forward',
  image_url: '/path/to/image11.jpg',
  bio: 'Clinical forward with a natural goal-scoring instinct.',
  nationality: 'Scotland',
  jersey_number: 11,
  previous_clubs: ['Dundee FC Youth', 'Arbroath FC'],
  experience: '12 years',
  is_active: true,
  stats: {
    appearances: 40,
    goals: 25,
    assists: 8,
    yellowCards: 3,
    redCards: 0,
    minutesPlayed: 3400
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const management1: Omit<TeamMember, 'id'> = {
  name: 'Robert Thomson',
  member_type: 'management',
  position: 'Manager',
  image_url: '/path/to/management1.jpg',
  bio: 'Experienced manager with a proven track record.',
  nationality: 'Scotland',
  experience: '20 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const management2: Omit<TeamMember, 'id'> = {
  name: 'Susan White',
  member_type: 'management',
  position: 'Assistant Manager',
  image_url: '/path/to/management2.jpg',
  bio: 'Dedicated assistant manager with a keen eye for detail.',
  nationality: 'England',
  experience: '15 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const management3: Omit<TeamMember, 'id'> = {
  name: 'Peter Green',
  member_type: 'management',
  position: 'Coach',
  image_url: '/path/to/management3.jpg',
  bio: 'Passionate coach focused on player development.',
  nationality: 'Wales',
  experience: '10 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const management4: Omit<TeamMember, 'id'> = {
  name: 'Laura Black',
  member_type: 'management',
  position: 'Physiotherapist',
  image_url: '/path/to/management4.jpg',
  bio: 'Caring physiotherapist dedicated to player well-being.',
  nationality: 'Scotland',
  experience: '8 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const official1: Omit<TeamMember, 'id'> = {
  name: 'James MacDonald',
  member_type: 'official',
  position: 'Chairman',
  image_url: '/path/to/official1.jpg',
  bio: 'Dedicated chairman committed to the club\'s success.',
  nationality: 'Scotland',
  experience: '25 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const official2: Omit<TeamMember, 'id'> = {
  name: 'Fiona Campbell',
  member_type: 'official',
  position: 'Secretary',
  image_url: '/path/to/official2.jpg',
  bio: 'Efficient secretary ensuring smooth club operations.',
  nationality: 'Scotland',
  experience: '20 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const official3: Omit<TeamMember, 'id'> = {
  name: 'Brian Anderson',
  member_type: 'official',
  position: 'Treasurer',
  image_url: '/path/to/official3.jpg',
  bio: 'Reliable treasurer managing the club\'s finances.',
  nationality: 'England',
  experience: '15 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const official4: Omit<TeamMember, 'id'> = {
  name: 'Sarah Thompson',
  member_type: 'official',
  position: 'Marketing Manager',
  image_url: '/path/to/official4.jpg',
  bio: 'Creative marketing manager promoting the club\'s brand.',
  nationality: 'Wales',
  experience: '10 years',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
