
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, Minus } from 'lucide-react';

interface QuickStatProps {
  title: string;
  value: string | number;
  description?: React.ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label?: string;
  };
}

const QuickStat = ({ title, value, description, trend }: QuickStatProps) => {
  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case 'up': return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendClass = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trend && (
            <>
              {getTrendIcon(trend.direction)}
              <span className={getTrendClass(trend.direction)}>{trend.value}</span>
              {trend.label && (
                <span className="text-muted-foreground">{trend.label}</span>
              )}
            </>
          )}
          {description && !trend && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const QuickStatsPanel = () => {
  // In a real application, these would be fetched from your API
  const stats = [
    { 
      title: 'Total Users',
      value: '1,234',
      trend: { 
        direction: "up" as const, 
        value: '+12%', 
        label: 'vs last month' 
      }
    },
    { 
      title: 'Active Subscribers',
      value: '834',
      trend: { 
        direction: "up" as const, 
        value: '+5%', 
        label: 'vs last month' 
      }
    },
    { 
      title: 'Page Views',
      value: '45.2K',
      trend: { 
        direction: "down" as const, 
        value: '-3%', 
        label: 'vs last month' 
      }
    },
    { 
      title: 'Average Session',
      value: '3m 12s',
      trend: { 
        direction: "neutral" as const, 
        value: '0%', 
        label: 'vs last month' 
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <QuickStat 
          key={index} 
          title={stat.title} 
          value={stat.value} 
          trend={stat.trend} 
        />
      ))}
    </div>
  );
};

export default QuickStatsPanel;
