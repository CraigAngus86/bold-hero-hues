
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Users, FileText, Image, Calendar } from 'lucide-react';

// In a real application, this data would come from an API
const stats = [
  {
    title: 'Total Users',
    value: '2,834',
    change: {
      direction: 'up',
      value: '12.5%',
      label: 'from last month'
    },
    icon: <Users className="h-4 w-4 text-muted-foreground" />
  },
  {
    title: 'News Articles',
    value: '127',
    change: {
      direction: 'up',
      value: '8.2%',
      label: 'from last month'
    },
    icon: <FileText className="h-4 w-4 text-muted-foreground" />
  },
  {
    title: 'Media Files',
    value: '498',
    change: {
      direction: 'down',
      value: '3.1%',
      label: 'from last month'
    },
    icon: <Image className="h-4 w-4 text-muted-foreground" />
  },
  {
    title: 'Upcoming Fixtures',
    value: '12',
    change: {
      direction: 'up',
      value: '20%',
      label: 'from last month'
    },
    icon: <Calendar className="h-4 w-4 text-muted-foreground" />
  }
];

const QuickStatsPanel = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <div className="mt-4 text-2xl font-bold">{stat.value}</div>
                <div className="mt-2 flex items-center text-xs">
                  {stat.change.direction === 'up' ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.change.direction === 'up' ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {stat.change.value}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    {stat.change.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsPanel;
