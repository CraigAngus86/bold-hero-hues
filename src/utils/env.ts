
/**
 * Utility for safely accessing environment variables
 * Provides type safety and default values
 */

/**
 * Gets an environment variable with validation
 * 
 * @param key The environment variable name
 * @param defaultValue Optional default value if the variable is not set
 * @returns The environment variable value or default
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  const value = import.meta.env[`VITE_${key}`] || defaultValue;
  return value;
}

/**
 * Checks if an environment variable is set to a truthy value
 * 
 * @param key The environment variable name
 * @param defaultValue Optional default value if the variable is not set
 * @returns boolean indicating if the value is truthy
 */
export function isEnvEnabled(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[`VITE_${key}`];
  
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

/**
 * Environment configuration object with typed access to common variables
 */
export const env = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  apiUrl: getEnvVariable('API_URL', ''),
  apiKey: getEnvVariable('API_KEY', ''),
  proxyEndpoint: getEnvVariable('PROXY_ENDPOINT', ''),
  useMockData: isEnvEnabled('USE_MOCK_DATA', false),
  bbcSportUrl: getEnvVariable('BBC_SPORT_URL', ''),
};

/**
 * Validates that required environment variables are set
 * Logs warnings for missing variables in development
 */
export function validateEnvironment(): void {
  if (env.isDevelopment) {
    const requiredVars = ['API_URL'];
    const missingVars = requiredVars.filter(v => !getEnvVariable(v));
    
    if (missingVars.length > 0) {
      console.warn(
        `Missing required environment variables: ${missingVars.join(', ')}\n` +
        `Make sure to set them in your .env file as VITE_${missingVars[0]}, etc.`
      );
    }
  }
}

// Validate environment variables when this module loads
validateEnvironment();
