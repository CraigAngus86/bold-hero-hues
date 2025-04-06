
export * from './status';
export * from './log';

export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  unit: string;
  status: 'up' | 'down' | 'same';
}
