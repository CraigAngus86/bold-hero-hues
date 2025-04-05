
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, 
  Calendar, 
  Image, 
  Users, 
  Award, 
  PlusCircle,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const { H2, H3, Body, Small } = Typography;

// Mock data for dashboard
const stats = [
  { 
    title: 'News Articles', 
    value: 32, 
    icon: Newspaper, 
    change: '+5 this week', 
    trend: 'up',
    link: '/admin/news'
  },
  { 
    title: 'Upcoming Fixtures', 
    value: 8, 
    icon: Calendar, 
    change: 'Next: Aberdeen FC', 
    trend: 'neutral',
    link: '/admin/fixtures'
  },
  { 
    title: 'Media Items', 
    value: 124, 
    icon: Image, 
    change: '+12 this month', 
    trend: 'up',
    link: '/admin/media'
  },
  { 
    title: 'Team Members', 
    value: 28, 
    icon: Users, 
    change: '3 new players', 
    trend: 'up',
    link: '/admin/team'
  },
];

const recentActivities = [
  { type: 'news', title: 'Banks o\' Dee Victorious in Cup Final', time: '2 hours ago' },
  { type: 'fixture', title: 'Added fixture: Banks o\' Dee vs Aberdeen FC', time: '1 day ago' },
  { type: 'team', title: 'Updated player profile: John Smith', time: '2 days ago' },
  { type: 'sponsor', title: 'Added new sponsor: Highland League', time: '3 days ago' },
];

const quickActions = [
  { title: 'Add News Article', icon: Newspaper, link: '/admin/news' },
  { title: 'Add Fixture', icon: Calendar, link: '/admin/fixtures/new' },
  { title: 'Upload Media', icon: Image, link: '/admin/media/upload' },
  { title: 'Add Team Member', icon: Users, link: '/admin/team' },
  { title: 'Add Sponsor', icon: Award, link: '/admin/sponsors/new' },
];

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <H2 className="mb-1">Admin Dashboard</H2>
            <Body className="text-gray-500">Welcome back, Admin User</Body>
          </div>
          <div className="flex gap-2">
            <Button className="gap-1">
              <PlusCircle size={16} />
              New Content
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Link to={stat.link} key={index}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Small className="text-gray-500">{stat.title}</Small>
                        <div className="flex items-baseline mt-1">
                          <H3 className="mr-2 mb-0">{stat.value}</H3>
                          <Small className={cn(
                            stat.trend === 'up' ? 'text-green-500' : 
                            stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          )}>{stat.change}</Small>
                        </div>
                      </div>
                      <div className="bg-primary-50 p-2 rounded-md">
                        <StatIcon size={24} className="text-primary-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock size={18} className="mr-2" /> Recent Activity
              </CardTitle>
              <CardDescription>Latest updates across the site</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <Body className="font-medium mb-0">{activity.title}</Body>
                        <div className="flex items-center">
                          <span className={cn(
                            "inline-block w-2 h-2 rounded-full mr-2",
                            activity.type === 'news' ? 'bg-blue-500' : 
                            activity.type === 'fixture' ? 'bg-green-500' : 
                            activity.type === 'team' ? 'bg-purple-500' : 'bg-yellow-500'
                          )}></span>
                          <Small>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</Small>
                        </div>
                      </div>
                      <Small className="text-gray-500">{activity.time}</Small>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp size={18} className="mr-2" /> Quick Actions
              </CardTitle>
              <CardDescription>Common content management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      asChild
                    >
                      <Link to={action.link}>
                        <ActionIcon size={16} className="mr-2" /> 
                        {action.title}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
