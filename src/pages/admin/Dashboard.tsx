
import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { 
  Users, Calendar, Trophy, FileText, Image, 
  Award, ShoppingBag, Users2, Bell, PlusCircle, 
  CalendarPlus, Upload, UserPlus, Table, Cog, 
  BarChart3, Activity
} from 'lucide-react';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { QuickActionButton } from '@/components/admin/dashboard/QuickActionButton';
import { ActivityFeed, mockActivities } from '@/components/admin/dashboard/ActivityFeed';
import { StatusSummary } from '@/components/admin/dashboard/StatusSummary';
import { SystemStatus } from '@/components/admin/dashboard/SystemStatus';
import { EventsCalendar } from '@/components/admin/dashboard/EventsCalendar';
import { format, addDays, addHours } from 'date-fns';

// Mock data for the upcoming events
const mockEvents = [
  {
    id: '1',
    title: 'Home vs Aberdeen FC',
    date: addDays(new Date(), 2),
    type: 'match' as const,
    link: '/admin/fixtures'
  },
  {
    id: '2',
    title: 'Weekend Preview Article',
    date: addDays(new Date(), 1),
    type: 'publication' as const,
    link: '/admin/news'
  },
  {
    id: '3',
    title: 'System Maintenance',
    date: addDays(addHours(new Date(), 6), 3),
    type: 'maintenance' as const
  },
  {
    id: '4',
    title: 'Away vs Dundee United',
    date: addDays(new Date(), 5),
    type: 'match' as const,
    link: '/admin/fixtures'
  },
  {
    id: '5',
    title: 'Monthly Sponsor Update',
    date: addDays(new Date(), 7),
    type: 'publication' as const,
    link: '/admin/sponsors'
  }
];

// Mock data for content status items
const contentStatusItems = [
  {
    id: '1',
    title: '3 Draft Articles Pending',
    status: 'warning' as const,
    link: '/admin/news',
    description: 'Articles ready for review and publishing'
  },
  {
    id: '2',
    title: 'Match Results Missing',
    status: 'error' as const,
    link: '/admin/fixtures',
    description: 'Weekend match results need updating'
  },
  {
    id: '3',
    title: '12 Media Items Uncategorized',
    status: 'info' as const,
    link: '/admin/images',
    description: 'Recently uploaded images need categories'
  },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </span>
          </div>
        </div>
        
        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total News Articles" 
            value="24" 
            icon={<FileText className="h-4 w-4" />} 
            trend={{ direction: 'up', value: '+3 this week' }}
            description="18 published, 6 drafts"
          />
          <StatCard 
            title="Upcoming Fixtures" 
            value="6" 
            icon={<Calendar className="h-4 w-4" />}
            description="Next: Home vs Aberdeen FC"
          />
          <StatCard 
            title="League Position" 
            value="3rd" 
            icon={<Trophy className="h-4 w-4" />}
            trend={{ direction: 'up', value: '+2 places' }}
            description="12 wins, 3 draws, 2 losses"
          />
          <StatCard 
            title="Media Items" 
            value="157" 
            icon={<Image className="h-4 w-4" />}
            trend={{ direction: 'up', value: '+24 this month' }}
            description="42 photos, 8 videos, 7 albums"
          />
        </div>
        
        {/* Activity and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-5">
          <div className="col-span-full md:col-span-3">
            <ActivityFeed activities={mockActivities} />
          </div>
          
          <div className="col-span-full md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              <QuickActionButton 
                icon={<PlusCircle className="h-5 w-5" />} 
                label="Add News"
                href="/admin/news"
                description="Create article"
              />
              <QuickActionButton 
                icon={<CalendarPlus className="h-5 w-5" />} 
                label="Add Fixture"
                href="/admin/fixtures"
                description="Schedule match"
              />
              <QuickActionButton 
                icon={<Upload className="h-5 w-5" />} 
                label="Upload Media"
                href="/admin/images"
                description="Photos & videos"
              />
              <QuickActionButton 
                icon={<UserPlus className="h-5 w-5" />} 
                label="Add Player"
                href="/admin/team"
                description="Team roster"
              />
              <QuickActionButton 
                icon={<Table className="h-5 w-5" />} 
                label="League Table"
                href="/admin/league-table-management"
                description="Update standings"
              />
              <QuickActionButton 
                icon={<Cog className="h-5 w-5" />} 
                label="Settings"
                href="/admin/settings"
                description="Configuration"
              />
            </div>
          </div>
        </div>
        
        {/* Status Indicators and Events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <StatusSummary 
              items={contentStatusItems} 
              title="Content Status" 
              viewAllLink="/admin/settings"
            />
          </div>
          <div className="lg:col-span-1">
            <SystemStatus />
          </div>
          <div className="lg:col-span-1">
            <EventsCalendar events={mockEvents} />
          </div>
        </div>
        
        {/* Content Sections Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Site Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track visitor engagement</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Connect Google Analytics for detailed insight on visitor behavior, popular content, and user journeys.</p>
            </div>
          </div>
          
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Content Performance</h3>
                  <p className="text-sm text-muted-foreground">Measure engagement</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Track how users interact with your content. Identify popular articles, images, and match information.</p>
            </div>
          </div>
          
          <div className="col-span-full md:col-span-1">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage admin access</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Control who can access the admin area and what permissions they have for creating and editing content.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
