
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  FilePlus2, 
  FileEdit, 
  UserPlus, 
  User, 
  Settings, 
  MessageSquare,
  CircleCheck
} from 'lucide-react';

const activities = [
  {
    id: '1',
    action: 'News article published',
    user: 'Admin User',
    time: '2 hours ago',
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    id: '2',
    action: 'New user registered',
    user: 'System',
    time: '4 hours ago',
    icon: <UserPlus className="h-4 w-4 text-green-500" />
  },
  {
    id: '3',
    action: 'System settings updated',
    user: 'Admin User',
    time: '6 hours ago',
    icon: <Settings className="h-4 w-4 text-yellow-500" />
  },
  {
    id: '4',
    action: 'New comment approved',
    user: 'Moderator',
    time: '12 hours ago',
    icon: <MessageSquare className="h-4 w-4 text-purple-500" />
  },
  {
    id: '5',
    action: 'News article edited',
    user: 'Editor',
    time: '1 day ago',
    icon: <FileEdit className="h-4 w-4 text-blue-500" />
  },
  {
    id: '6',
    action: 'New page created',
    user: 'Content Manager',
    time: '1 day ago',
    icon: <FilePlus2 className="h-4 w-4 text-green-500" />
  },
  {
    id: '7',
    action: 'User profile updated',
    user: 'John Doe',
    time: '2 days ago',
    icon: <User className="h-4 w-4 text-gray-500" />
  },
  {
    id: '8',
    action: 'System maintenance completed',
    user: 'System',
    time: '2 days ago',
    icon: <CircleCheck className="h-4 w-4 text-green-500" />
  }
];

const RecentActivityPanel = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="bg-gray-100 p-2 rounded-full">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.action}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;
