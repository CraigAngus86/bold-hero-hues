
// API configuration interface
export interface ApiConfig {
  useProxy: boolean;
  proxyUrl?: string;
  apiKey?: string;
  useLocalStorage: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  apiServerUrl?: string; // URL for the Node.js scraper server - making this optional
}

// Default API configuration
export const DEFAULT_API_CONFIG: ApiConfig = {
  useProxy: false,
  proxyUrl: '',
  apiKey: '',
  useLocalStorage: true,
  autoRefresh: true,
  refreshInterval: 360, // 6 hours
  apiServerUrl: 'http://localhost:3001' // Default Node.js server URL
};

// Cache keys for local storage
export const CACHE_KEYS = {
  LEAGUE_TABLE: 'highland_league_table_cache',
  FIXTURES: 'highland_league_fixtures_cache',
  RESULTS: 'highland_league_results_cache',
  TIMESTAMP: 'highland_league_cache_timestamp',
  API_CONFIG: 'highland_league_api_config'
};

// Cache TTL in milliseconds (6 hours)
export const CACHE_TTL = 6 * 60 * 60 * 1000;

// Get API configuration from local storage or use defaults
export const getApiConfig = (): ApiConfig => {
  try {
    const storedConfig = localStorage.getItem(CACHE_KEYS.API_CONFIG);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
  } catch (error) {
    console.error('Error reading API config from localStorage:', error);
  }
  return DEFAULT_API_CONFIG;
};

// Save API configuration to local storage
export const saveApiConfig = (config: ApiConfig): void => {
  try {
    localStorage.setItem(CACHE_KEYS.API_CONFIG, JSON.stringify(config));
    console.log('API configuration saved');
  } catch (error) {
    console.error('Error saving API config to localStorage:', error);
  }
};
