
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, FileText, Users, Settings, Trophy, 
  MessageSquare, Image, Mail, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusItem from './StatusItem';

interface QuickActionsProps {
  metrics?: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ metrics }) => {
  const actions = [
    { 
      name: 'Fixtures', 
      icon: Calendar, 
      path: '/admin/fixtures',
      count: metrics?.fixturesCount || 0,
      color: 'bg-green-50',
      viewAllLink: '/admin/fixtures',
      status: 'healthy' as const
    },
    { 
      name: 'News', 
      icon: FileText, 
      path: '/admin/news',
      count: metrics?.newsCount || 0,
      color: 'bg-blue-50',
      viewAllLink: '/admin/news',
      status: 'healthy' as const
    },
    { 
      name: 'Users', 
      icon: Users, 
      path: '/admin/users',
      count: metrics?.usersCount || 0,
      color: 'bg-purple-50',
      viewAllLink: '/admin/users',
      status: 'healthy' as const
    },
    { 
      name: 'Team', 
      icon: Trophy, 
      path: '/admin/team',
      color: 'bg-amber-50',
      viewAllLink: '/admin/team',
      status: 'healthy' as const
    },
    { 
      name: 'Media', 
      icon: Image, 
      path: '/admin/media',
      color: 'bg-emerald-50',
      viewAllLink: '/admin/media',
      status: 'healthy' as const
    },
    { 
      name: 'Messages', 
      icon: Mail, 
      path: '/admin/messages',
      count: metrics?.messagesCount || 0,
      color: 'bg-pink-50',
      viewAllLink: '/admin/messages',
      status: 'healthy' as const
    },
    { 
      name: 'Fan Engagement', 
      icon: MessageSquare, 
      path: '/admin/fans',
      color: 'bg-indigo-50',
      viewAllLink: '/admin/fans',
      status: 'healthy' as const
    },
    { 
      name: 'Sponsors', 
      icon: Tag, 
      path: '/admin/sponsors',
      count: metrics?.sponsorsCount || 0,
      color: 'bg-orange-50',
      viewAllLink: '/admin/sponsors',
      status: 'healthy' as const
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/admin/settings',
      color: 'bg-gray-50',
      viewAllLink: '/admin/settings',
      status: 'healthy' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link to={action.path} key={action.name}>
          <StatusItem
            name={action.name}
            status={action.status}
            icon={action.icon}
            count={action.count}
            color={action.color}
            viewAllLink={action.viewAllLink}
          />
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
