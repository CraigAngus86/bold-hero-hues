
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText, 
  Image
} from 'lucide-react';

// Mock data - in a real app, this would be fetched from an API
const stats = [
  {
    title: 'Total Visitors',
    value: '5,892',
    change: '+12%',
    trend: 'up',
    period: 'from last month',
    icon: <Users className="h-6 w-6 text-blue-500" />
  },
  {
    title: 'Upcoming Fixtures',
    value: '8',
    change: '+2',
    trend: 'up',
    period: 'from last week',
    icon: <Calendar className="h-6 w-6 text-green-500" />
  },
  {
    title: 'News Articles',
    value: '94',
    change: '+6',
    trend: 'up',
    period: 'from last month',
    icon: <FileText className="h-6 w-6 text-purple-500" />
  },
  {
    title: 'Media Gallery',
    value: '467',
    change: '+24',
    trend: 'up',
    period: 'from last month',
    icon: <Image className="h-6 w-6 text-orange-500" />
  }
];

const StatsCardGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            <div className="bg-gray-100 p-2 rounded-full">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs mt-1">
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stat.change}
              </span>
              <span className="text-gray-500 ml-1">{stat.period}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCardGrid;
