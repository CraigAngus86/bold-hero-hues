
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityItem } from './ActivityItem';
import { Clock, Filter } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import { LastUpdatedInfo } from '../common/LastUpdatedInfo';

export type ActivityType = 'create' | 'update' | 'delete' | 'publish' | 'login' | 'other';

export interface ActivityItemData {
  id: string;
  type: ActivityType;
  title: string;
  user: string;
  timestamp: Date | string;
  entityType: string;
  entityId: string;
  editLink?: string;
}

interface EnhancedActivityFeedProps {
  activities: ActivityItemData[];
  maxItems?: number;
  isLoading?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

export function EnhancedActivityFeed({
  activities,
  maxItems = 10,
  isLoading = false,
  lastUpdated,
  onRefresh
}: EnhancedActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expanded, setExpanded] = useState<boolean>(false);
  
  // Process and group activities by date
  const groupedActivities = useMemo(() => {
    if (!activities?.length) return {};
    
    // Helper to get date group key
    const getDateGroup = (timestamp: Date | string) => {
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
      
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      if (isThisWeek(date)) return 'This Week';
      return 'Earlier';
    };
    
    // Group by date
    const groups: Record<string, ActivityItemData[]> = {};
    
    activities.forEach(activity => {
      const dateGroup = getDateGroup(activity.timestamp);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(activity);
    });
    
    return groups;
  }, [activities]);
  
  // Filter activities based on active tab
  const filteredActivities = useMemo(() => {
    if (activeTab === 'all') return activities;
    return activities.filter(activity => {
      if (activeTab === 'content') return ['create', 'update', 'publish'].includes(activity.type);
      if (activeTab === 'system') return activity.type === 'other' || activity.entityType === 'system';
      return activity.type === activeTab;
    });
  }, [activities, activeTab]);
  
  // Determine how many items to display
  const displayedActivities = expanded 
    ? filteredActivities 
    : filteredActivities.slice(0, maxItems);
  
  // Get unique entity types for filters
  const entityTypes = useMemo(() => {
    const types = new Set<string>();
    activities.forEach(activity => types.add(activity.entityType));
    return Array.from(types);
  }, [activities]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest actions across the site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-3 py-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across the site</CardDescription>
          </div>
          <LastUpdatedInfo 
            lastUpdated={lastUpdated || null}
            onRefresh={onRefresh}
            variant="badge"
            className="ml-auto"
          />
        </div>
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4 h-7">
              <TabsTrigger value="all" className="text-xs px-2 py-1">All</TabsTrigger>
              <TabsTrigger value="create" className="text-xs px-2 py-1">Created</TabsTrigger>
              <TabsTrigger value="update" className="text-xs px-2 py-1">Updated</TabsTrigger>
              <TabsTrigger value="content" className="text-xs px-2 py-1">Content</TabsTrigger>
            </TabsList>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter
            </div>
          </div>
          
          {/* All tabs share the same content with different filtering */}
          <TabsContent value="all" className="mt-0 pt-0"></TabsContent>
          <TabsContent value="create" className="mt-0 pt-0"></TabsContent>
          <TabsContent value="update" className="mt-0 pt-0"></TabsContent>
          <TabsContent value="content" className="mt-0 pt-0"></TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent className="divide-y">
        {Object.entries(groupedActivities).length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No activities to display</p>
          </div>
        )}
        
        {Object.entries(groupedActivities).map(([dateGroup, items]) => {
          // Only process items that match the current filter
          const groupItems = items.filter(item => filteredActivities.some(fa => fa.id === item.id));
          if (groupItems.length === 0) return null;
          
          return (
            <div key={dateGroup} className="pt-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-2">{dateGroup}</h3>
              <div className="space-y-2">
                {groupItems.map((activity) => (
                  <ActivityItem key={activity.id} {...activity} />
                ))}
              </div>
            </div>
          );
        })}
        
        {filteredActivities.length > maxItems && !expanded && (
          <div className="pt-3">
            <Button 
              variant="link" 
              size="sm" 
              className="w-full"
              onClick={() => setExpanded(true)}
            >
              Show All ({filteredActivities.length - maxItems} more)
            </Button>
          </div>
        )}
        
        {expanded && (
          <div className="pt-3">
            <Button 
              variant="link" 
              size="sm" 
              className="w-full"
              onClick={() => setExpanded(false)}
            >
              Show Less
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedActivityFeed;
