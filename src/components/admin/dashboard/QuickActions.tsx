
import React from 'react';
import { 
  PlusCircle, 
  CalendarPlus, 
  Upload, 
  UserPlus, 
  Table, 
  Settings 
} from 'lucide-react';
import { EnhancedQuickActionButton } from './EnhancedQuickActionButton';
import { contentStatusItems } from './mockData';

interface QuickActionsProps {
  draftArticlesCount?: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  draftArticlesCount 
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
      <EnhancedQuickActionButton 
        icon={<PlusCircle className="h-5 w-5" />} 
        label="Add News"
        href="/admin/news"
        description="Create article"
        tooltip="Add a new news article or blog post"
        badgeCount={draftArticlesCount}
      />
      
      <EnhancedQuickActionButton 
        icon={<CalendarPlus className="h-5 w-5" />} 
        label="Add Fixture"
        href="/admin/fixtures"
        description="Schedule match"
        tooltip="Add a new fixture to the calendar"
      />
      
      <EnhancedQuickActionButton 
        icon={<Upload className="h-5 w-5" />} 
        label="Upload Media"
        href="/admin/images"
        description="Photos & videos"
        tooltip="Upload and manage media files"
      />
      
      <EnhancedQuickActionButton 
        icon={<UserPlus className="h-5 w-5" />} 
        label="Add Player"
        href="/admin/team"
        description="Team roster"
        tooltip="Add or manage team members"
      />
      
      <EnhancedQuickActionButton 
        icon={<Table className="h-5 w-5" />} 
        label="League Table"
        href="/admin/league-table-management"
        description="Update standings"
        tooltip="View and manage league table data"
      />
      
      <EnhancedQuickActionButton 
        icon={<Settings className="h-5 w-5" />} 
        label="Settings"
        href="/admin/settings"
        description="Configuration"
        tooltip="Manage system settings"
        badgeCount={contentStatusItems.filter(item => item.status === 'error').length}
        badgeColor="bg-red-500"
      />
    </div>
  );
};

export default QuickActions;
