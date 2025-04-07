
// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  Database,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import useDashboardRefresh from '@/hooks/useDashboardRefresh';

const Dashboard = () => {
  const { 
    refresh, 
    isRefreshing, 
    lastRefreshed, 
    systemStatus, 
    isLoading, 
    error 
  } = useDashboardRefresh();

  // Format the last refreshed time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefreshed ? formatTime(lastRefreshed) : 'Never'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* System Status Section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatusCard
                title="Database"
                status={systemStatus?.services?.database || false}
                icon={<Database className="h-5 w-5" />}
              />
              <StatusCard
                title="Storage"
                status={systemStatus?.services?.storage || false}
                icon={<Server className="h-5 w-5" />}
              />
              <StatusCard
                title="Authentication"
                status={systemStatus?.services?.authentication || false}
                icon={<ShieldAlert className="h-5 w-5" />}
              />
              <StatusCard
                title="API Services"
                status={systemStatus?.services?.api || false}
                icon={<Clock className="h-5 w-5" />}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <QuickStatsCard title="Total Users" value="1,245" change="+12%" />
        <QuickStatsCard title="Active Sessions" value="267" change="+5%" />
        <QuickStatsCard title="Page Views" value="8,431" change="+24%" />
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivityItem
                key={i}
                action="Updated content"
                resource="Homepage"
                user="Admin User"
                time={`${i + 1}h ago`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Status card component
const StatusCard = ({ title, status, icon }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg">
      <div
        className={`p-2 rounded-full mr-3 ${
          status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p
          className={`text-sm ${
            status ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

// Quick stats card component
const QuickStatsCard = ({ title, value, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {change}
          </span>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
};

// Activity item component
const ActivityItem = ({ action, resource, user, time }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          {user.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">
            {user} {action} <span className="font-semibold">{resource}</span>
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
};

export default Dashboard;
