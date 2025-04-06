
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, description, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-8 w-8 rounded-md bg-primary-800/10 flex items-center justify-center text-primary-800">
            {icon}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-baseline">
            <h4 className="text-2xl font-semibold">{value}</h4>
            {trend && (
              <span className={cn(
                "ml-2 text-xs font-medium flex items-center",
                trend.direction === 'up' ? "text-emerald-500" : 
                trend.direction === 'down' ? "text-red-500" : 
                "text-gray-500"
              )}>
                {trend.direction === 'up' && <ArrowUp className="mr-1 h-3 w-3" />}
                {trend.direction === 'down' && <ArrowDown className="mr-1 h-3 w-3" />}
                {trend.value}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
