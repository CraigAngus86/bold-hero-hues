
import { SystemLog } from './logs';

/**
 * System status information
 */
export interface SystemStatus {
  overall_status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  status?: 'healthy' | 'warning' | 'error' | 'unknown';
  services?: Array<{
    name: string;
    status: string;
    uptime: number;
    message: string;
    lastChecked: string;
  }>;
  metrics?: {
    performance?: Array<{name: string, value: number, unit: string}>;
    storage?: Array<{name: string, value: number, unit: string}>;
    usage?: Array<{name: string, value: number, unit: string}>;
  };
  logs?: SystemLog[];
  uptime?: number;
  last_updated: string;
}
