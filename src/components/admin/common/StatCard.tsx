
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LastUpdatedInfo } from './LastUpdatedInfo';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label?: string;
  };
  description?: string;
  lastUpdated?: Date | string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description, 
  lastUpdated,
  isLoading = false,
  onRefresh,
  className,
  variant = 'default'
}) => {
  const variantClasses = {
    primary: "border-t-4 border-primary-800",
    secondary: "border-t-4 border-secondary-300",
    accent: "border-t-4 border-accent-500",
    default: "",
  };
  
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", variantClasses[variant], className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", 
      variantClasses[variant], 
      className
    )}>
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
                {trend.label && <span className="text-gray-500 ml-1">({trend.label})</span>}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          
          {lastUpdated && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <LastUpdatedInfo 
                lastUpdated={lastUpdated}
                onRefresh={onRefresh}
                variant="inline"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
