
import { ImportResult, ScrapedFixture, Fixture } from '@/types/fixtures';

const createValidationError = (message: string): ImportResult => {
  return {
    valid: false,
    success: false, // Added success property
    message,
    added: 0,
    updated: 0,
    validFixtures: []
  };
};

export const validateFixtures = (data: any[]): ImportResult => {
  if (!Array.isArray(data)) {
    return createValidationError('Invalid data format: Expected an array of fixtures');
  }

  if (data.length === 0) {
    return createValidationError('No fixtures found in the provided data');
  }

  // Filter and transform the valid fixtures
  const validFixtures: ScrapedFixture[] = [];
  const currentDate = new Date().toISOString();

  for (const item of data) {
    if (!item.date || !item.time || !item.home_team || !item.away_team || !item.competition) {
      continue;
    }

    // Valid fixture, add it to our array
    const fixture: ScrapedFixture = {
      date: item.date,
      time: item.time,
      home_team: item.home_team,
      away_team: item.away_team,
      competition: item.competition,
      venue: item.venue,
      is_completed: item.is_completed || false,
      home_score: item.is_completed ? item.home_score : null,
      away_score: item.is_completed ? item.away_score : null,
      season: item.season || null,
      source: 'manual_import', // Add required source field
      import_date: currentDate, // Add required import_date field
    };

    validFixtures.push(fixture);
  }

  if (validFixtures.length === 0) {
    return createValidationError('No valid fixtures found in the provided data');
  }

  return {
    valid: true,
    success: true, // Added success property
    message: `Found ${validFixtures.length} valid fixtures`,
    added: 0, // Will be updated after import
    updated: 0, // Will be updated after import
    validFixtures
  };
};

export const createMockImportResult = (fixtures: ScrapedFixture[], added = 0, updated = 0): ImportResult => {
  return {
    valid: true,
    success: true, // Added success property
    message: `Processed ${fixtures.length} fixtures: ${added} added, ${updated} updated`,
    added,
    updated,
    validFixtures: fixtures,
  };
};
