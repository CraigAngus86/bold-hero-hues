
import React from 'react';
import { BarChart3, Activity, Users } from 'lucide-react';

export const ContentSections: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-6">
      <div className="col-span-full md:col-span-1">
        <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-5 w-5 text-primary-800" />
            <div>
              <h3 className="text-lg font-semibold text-primary-800">Site Analytics</h3>
              <p className="text-sm text-muted-foreground">Track visitor engagement</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Connect Google Analytics for detailed insight on visitor behavior, popular content, and user journeys.</p>
        </div>
      </div>
      
      <div className="col-span-full md:col-span-1">
        <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-4">
            <Activity className="h-5 w-5 text-primary-800" />
            <div>
              <h3 className="text-lg font-semibold text-primary-800">Content Performance</h3>
              <p className="text-sm text-muted-foreground">Measure engagement</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Track how users interact with your content. Identify popular articles, images, and match information.</p>
        </div>
      </div>
      
      <div className="col-span-full md:col-span-1">
        <div className="grid gap-4 bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-4">
            <Users className="h-5 w-5 text-primary-800" />
            <div>
              <h3 className="text-lg font-semibold text-primary-800">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage admin access</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Control who can access the admin area and what permissions they have for creating and editing content.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentSections;
