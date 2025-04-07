
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import SystemStatusPanel from '@/components/admin/dashboard/SystemStatusPanel';
import RecentActivityWidget from '@/components/admin/dashboard/RecentActivityWidget';
import PendingTasksWidget from '@/components/admin/dashboard/PendingTasksWidget';
import StatsCardGrid from '@/components/admin/dashboard/StatsCardGrid';
import UpcomingMatchesWidget from '@/components/admin/dashboard/UpcomingMatchesWidget';
import RecentNewsWidget from '@/components/admin/dashboard/RecentNewsWidget';
import { useSystemStatus } from '@/hooks/useSystemStatus';

const Dashboard = () => {
  const { status, isLoading, refreshStatus } = useSystemStatus();
  
  return (
    <>
      <Helmet>
        <title>Dashboard | Banks o' Dee FC Admin</title>
      </Helmet>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <SystemStatusPanel />
          </div>
          
          {/* Middle column */}
          <div className="space-y-4">
            <PendingTasksWidget />
          </div>
          
          {/* Right column */}
          <div className="space-y-4">
            <RecentActivityWidget />
            <UpcomingMatchesWidget />
          </div>
        </div>
        
        <StatsCardGrid />
        
        <RecentNewsWidget />
      </div>
    </>
  );
};

export default Dashboard;
