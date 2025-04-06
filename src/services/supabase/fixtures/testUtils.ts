
import { ScrapedFixture } from '@/types/fixtures';

/**
 * Generate test fixture data for development and testing
 */
export const generateTestFixtures = (count = 5, completed = false): ScrapedFixture[] => {
  const fixtures: ScrapedFixture[] = [];
  const teams = ['Banks o\' Dee', 'Fraserburgh', 'Buckie Thistle', 'Brechin City', 'Formartine United', 
                'Inverurie Locos', 'Keith', 'Huntly', 'Deveronvale', 'Turriff United'];
  const venues = ['Spain Park', 'Bellslea Park', 'Victoria Park', 'Glebe Park', 'North Lodge Park', 
                 'Harlaw Park', 'Kynoch Park', 'Christie Park', 'Princess Royal Park', 'The Haughs'];
  const competitions = ['Highland League', 'Scottish Cup', 'Aberdeenshire Cup', 'Aberdeenshire Shield', 'Morrison Motors Cup'];
  
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random teams - ensure they're different
    const homeTeamIndex = Math.floor(Math.random() * teams.length);
    let awayTeamIndex = Math.floor(Math.random() * teams.length);
    // Make sure home and away teams are different
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length);
    }
    
    // Random date - either past (for completed) or future (for upcoming)
    const randDays = completed ? 
      -Math.floor(Math.random() * 60) : // Past date for completed fixtures
      Math.floor(Math.random() * 60);   // Future date for upcoming fixtures
    
    const fixtureDate = new Date();
    fixtureDate.setDate(today.getDate() + randDays);
    
    // Format date as YYYY-MM-DD
    const formattedDate = fixtureDate.toISOString().split('T')[0];
    
    // Random times between 13:00 and 19:30
    const hours = Math.floor(Math.random() * 7) + 13; // 13 to 19
    const mins = Math.floor(Math.random() * 2) * 30; // 0 or 30
    const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    const competition = competitions[Math.floor(Math.random() * competitions.length)];
    const venue = venues[homeTeamIndex]; // Use the venue corresponding to the home team
    
    let fixture: ScrapedFixture = {
      home_team: teams[homeTeamIndex],
      away_team: teams[awayTeamIndex],
      date: formattedDate,
      time: time,
      competition: competition,
      venue: venue,
      is_completed: completed,
      source: 'test'
    };
    
    // Add scores for completed fixtures
    if (completed) {
      fixture.home_score = Math.floor(Math.random() * 5);
      fixture.away_score = Math.floor(Math.random() * 5);
    }
    
    fixtures.push(fixture);
  }
  
  // Add a specific fixture with Banks o' Dee as home team for testing
  const specialFixture: ScrapedFixture = {
    home_team: 'Banks o\' Dee',
    away_team: teams[Math.floor(Math.random() * teams.length)],
    date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '15:00',
    competition: 'Highland League',
    venue: 'Spain Park',
    is_completed: false,
    source: 'test'
  };
  
  fixtures.push(specialFixture);
  
  return fixtures;
};

export default generateTestFixtures;
