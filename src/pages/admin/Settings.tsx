
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/settings/user-management';
import SiteConfiguration from '@/components/admin/settings/SiteConfiguration';
import ScraperConfiguration from '@/components/admin/settings/ScraperConfiguration';
import SupabaseConnection from '@/components/admin/settings/SupabaseConnection';
import EmailConfiguration from '@/components/admin/settings/EmailConfiguration';
import SystemLogs from '@/components/admin/settings/SystemLogs';
import ImportExportTools from '@/components/admin/settings/ImportExportTools';
import DatabaseManagement from '@/components/admin/settings/DatabaseManagement';
import SystemLogViewer from '@/components/admin/settings/SystemLogViewer';
import { spacing, typography } from '@/styles/designTokens';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>('users');

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Settings & Configuration"
        description="Configure system-wide settings and manage administrative tools"
      >
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className={spacing.contentGap}>
          <div className="bg-card rounded-md p-2 overflow-x-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="site">Site Config</TabsTrigger>
              <TabsTrigger value="scraper">Scraper</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="data">Import/Export</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <UserManagement />
          </TabsContent>

          <TabsContent value="site" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <SiteConfiguration />
          </TabsContent>

          <TabsContent value="scraper" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <ScraperConfiguration />
          </TabsContent>

          <TabsContent value="database" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <DatabaseManagement />
            <SupabaseConnection />
          </TabsContent>

          <TabsContent value="email" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <EmailConfiguration />
          </TabsContent>

          <TabsContent value="logs" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <SystemLogViewer
              initialLogs={[]}
              title="System Logs"
              description="View and filter system events, errors, and activities"
              onRefresh={() => {}}
            />
            <SystemLogs />
          </TabsContent>

          <TabsContent value="data" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <ImportExportTools />
          </TabsContent>

          <TabsContent value="advanced" className={`space-y-4 mt-2 ${spacing.sectionMargin}`}>
            <div className="bg-card rounded-md border p-6">
              <h3 className={typography.sectionHeader}>Advanced System Settings</h3>
              <p className="text-muted-foreground mt-2">
                These settings can significantly impact system behavior. Use with caution.
              </p>
              {/* Advanced settings would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </AdminPageLayout>
    </AdminLayout>
  );
};

export default Settings;
