
export interface SystemStatusItem {
  name: string;
  status: 'ok' | 'warning' | 'error' | 'pending' | 'unknown';
  lastChecked: Date | string | null;
  metricValue?: string | number;
  tooltip?: string;
  icon?: React.ReactNode;
}

export interface SystemStatusData {
  supabase: {
    status: 'ok' | 'warning' | 'error' | 'unknown';
    lastChecked: Date | string | null;
    pingTime?: number;
  };
  fixtures: {
    status: 'ok' | 'warning' | 'error' | 'unknown';
    lastChecked: Date | string | null;
    count?: number;
  };
  storage: {
    status: 'ok' | 'warning' | 'error' | 'unknown';
    lastChecked: Date | string | null;
    usage?: string;
  };
  leagueTable: {
    status: 'ok' | 'warning' | 'error' | 'unknown';
    lastChecked: Date | string | null;
    teams?: number;
  };
}

export interface SystemStatusResponse {
  success: boolean;
  data?: SystemStatusData;
  error?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItem[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}
