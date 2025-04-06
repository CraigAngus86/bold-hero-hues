
import { ScrapedFixture, ImportResult } from '@/types/fixtures';

/**
 * Validates the fixture data structure
 */
export default function validateFixtureData(data: any): ImportResult {
  if (!data || !Array.isArray(data)) {
    return {
      valid: false,
      message: 'Invalid data format: Expected an array of fixtures',
      added: 0,
      updated: 0,
      validFixtures: []
    };
  }

  // Check if empty
  if (data.length === 0) {
    return {
      valid: false,
      message: 'No fixtures found in the data',
      added: 0,
      updated: 0,
      validFixtures: []
    };
  }

  const validFixtures: ScrapedFixture[] = [];
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const fixture = data[i];
    
    // Check if it has the necessary fields
    if (!fixture.date) {
      errors.push(`Fixture at index ${i} is missing date`);
      continue;
    }
    
    // Check if it's the standard format
    if (fixture.home_team && fixture.away_team && fixture.competition) {
      validFixtures.push(fixture as ScrapedFixture);
      continue;
    }
    
    // Check if it's Claude's format
    if (fixture.opposition && fixture.location && fixture.competition) {
      // Convert to standard format
      const isHome = fixture.location.toLowerCase() === 'home';
      const homeTeam = isHome ? "Banks o' Dee" : fixture.opposition;
      const awayTeam = isHome ? fixture.opposition : "Banks o' Dee";
      
      // Parse score if available
      let homeScore, awayScore;
      let isCompleted = false;
      
      if (fixture.score && typeof fixture.score === 'string') {
        const scoreParts = fixture.score.split('-').map(s => s.trim());
        if (scoreParts.length === 2) {
          const score1 = parseInt(scoreParts[0]);
          const score2 = parseInt(scoreParts[1]);
          
          if (!isNaN(score1) && !isNaN(score2)) {
            homeScore = isHome ? score1 : score2;
            awayScore = isHome ? score2 : score1;
            isCompleted = true;
          }
        }
      } else if (fixture.isCompleted) {
        isCompleted = true;
      }
      
      validFixtures.push({
        date: fixture.date,
        time: fixture.kickOffTime || fixture.time || '15:00',
        home_team: homeTeam,
        away_team: awayTeam,
        competition: fixture.competition,
        venue: fixture.venue || (isHome ? "Spain Park" : "Away"),
        is_completed: isCompleted,
        home_score: homeScore,
        away_score: awayScore,
        season: fixture.season || undefined
      });
      
      continue;
    }
    
    errors.push(`Fixture at index ${i} has invalid format`);
  }

  if (errors.length > 0) {
    return {
      valid: validFixtures.length > 0,
      message: `Found ${validFixtures.length} valid fixtures and ${errors.length} errors: ${errors.join('; ')}`,
      added: 0,
      updated: 0,
      validFixtures
    };
  }

  return {
    valid: true,
    message: `All ${validFixtures.length} fixtures are valid`,
    added: 0,
    updated: 0,
    validFixtures
  };
}

export { validateFixtureData };
