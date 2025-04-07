
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
          {/* First column */}
          <div className="space-y-4">
            {/* System Status */}
            <SystemStatusPanel />
          </div>
          
          {/* Second column */}
          <div className="space-y-4">
            {/* Pending Tasks */}
            <PendingTasksWidget />
          </div>
          
          {/* Third column */}
          <div className="space-y-4">
            {/* Recent Activity */}
            <RecentActivityWidget />
            {/* Upcoming Matches */}
            <UpcomingMatchesWidget />
          </div>
        </div>
        
        {/* Stats Card Grid */}
        <StatsCardGrid />
        
        {/* Recent News */}
        <RecentNewsWidget />
      </div>
    </>
  );
};

export default Dashboard;
