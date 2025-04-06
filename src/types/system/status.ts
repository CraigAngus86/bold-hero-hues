
import React from 'react';

export interface SystemStatusItemProps {
  name: string;
  status?: 'healthy' | 'warning' | 'error' | 'info' | 'offline' | 'active' | 'degraded' | 'online';
  metricValue?: string | number;
  count?: number;
  icon?: React.ElementType;
  color?: string;
  viewAllLink?: string;
  lastChecked?: string | Date | null;
  tooltip?: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  responseTime: number;
  uptime: number;
  fixturesCount?: number;
  newsCount?: number;
  dailyActiveUsers?: number;
}

export interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastUpdated: string;
  details?: string;
}

export interface SystemIncident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  updatedAt: string;
  message: string;
  affectedComponents?: string[];
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'unknown';
  isHealthy?: boolean;
  lastUpdated: string;
  metrics: SystemMetrics;
  components?: SystemComponent[];
  incidents?: SystemIncident[];
}

export interface SystemStatusResponse {
  success: boolean;
  data?: SystemStatus;
  error?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItem[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}

export interface SystemStatusItem {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown' | 'info';
  lastChecked?: Date | string | null;
  metricValue?: string | number;
  tooltip?: string;
  icon?: React.ElementType;
}

export enum BucketType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  DOCUMENTS = 'documents',
  AVATARS = 'avatars',
  POSTS = 'posts',
  PRODUCTS = 'products',
  GENERAL = 'general',
  MEDIA = 'media',
  SPONSORS = 'sponsors',
  PLAYERS = 'players',
  PUBLIC = 'public',
  TEAMS = 'teams'
}
