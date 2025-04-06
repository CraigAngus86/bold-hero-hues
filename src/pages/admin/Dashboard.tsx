
import React from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/admin/charts/ChartContainer';
import StatusItems from '@/components/admin/dashboard/StatusItems';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';
import { formatTimeAgo } from '@/utils/date';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityLog from '@/components/admin/dashboard/ActivityLog';
import { SystemStatusData } from '@/services/logs/systemLogsService';

const Dashboard: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    refresh,
    lastRefreshed
  } = useDashboardRefresh();

  const handleRefresh = () => {
    refresh();
  };

  const systemStatus: SystemStatusData | null = data?.system || null;

  return (
    <AdminPageLayout 
      title="Dashboard" 
      description="Overview of your Banks o' Dee FC admin panel"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">System Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
          {!isLoading && (
            <span className="text-xs ml-2 text-muted-foreground">
              ({formatTimeAgo(lastRefreshed.toISOString())})
            </span>
          )}
        </Button>
      </div>

      <div className="mb-8">
        <StatusItems status={systemStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>System activity over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer 
                  type="area" 
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions from administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLog />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <QuickActions metrics={systemStatus?.metrics} />
      </div>
    </AdminPageLayout>
  );
};

export default Dashboard;
