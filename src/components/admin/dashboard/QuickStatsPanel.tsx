
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, Users, Calendar, Image, TrendingUp, 
  MessageSquare, Mail, Ticket 
} from 'lucide-react';
import StatCard from '@/components/admin/common/StatCard';

const QuickStatsPanel = () => {
  // In a real app, these would be fetched from APIs
  const stats = [
    { 
      title: 'Total Articles', 
      value: '42', 
      icon: <FileText className="h-4 w-4" />,
      trend: { direction: 'up', value: '+12%', label: 'vs last month' },
    },
    { 
      title: 'Site Visitors', 
      value: '1,234', 
      icon: <Users className="h-4 w-4" />,
      trend: { direction: 'up', value: '+8%', label: 'vs last month' },
    },
    { 
      title: 'Upcoming Events', 
      value: '6', 
      icon: <Calendar className="h-4 w-4" />,
      description: 'Next 30 days',
    },
    { 
      title: 'Media Items', 
      value: '243', 
      icon: <Image className="h-4 w-4" />,
      description: 'Images, videos and files',
    },
    { 
      title: 'Social Engagement', 
      value: '821', 
      icon: <TrendingUp className="h-4 w-4" />,
      trend: { direction: 'up', value: '+31%', label: 'vs last month' },
      description: 'Interactions across platforms',
    },
    { 
      title: 'Fan Messages', 
      value: '52', 
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Pending responses',
    },
    { 
      title: 'Newsletter Subscribers', 
      value: '3,724', 
      icon: <Mail className="h-4 w-4" />,
      trend: { direction: 'up', value: '+5%', label: 'vs last month' },
    },
    { 
      title: 'Ticket Sales', 
      value: '£5,214', 
      icon: <Ticket className="h-4 w-4" />,
      trend: { direction: 'up', value: '+18%', label: 'vs last month' },
      description: 'Current month',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          description={stat.description}
          variant={i < 4 ? 'default' : 'secondary'}
        />
      ))}
    </div>
  );
};

export default QuickStatsPanel;
