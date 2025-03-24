
// Re-export everything from the smaller files for backward compatibility
export {
  fetchFixturesFromSupabase,
  fetchResultsFromSupabase,
  fetchMatchesFromSupabase
} from './fixtures/fetchService';

export {
  storeFixtures
} from './fixtures/storeService';

export {
  logScrapeOperation
} from './fixtures/loggingService';

export {
  importHistoricFixtures,
  scrapeAndStoreFixtures
} from './fixtures/importExport';
