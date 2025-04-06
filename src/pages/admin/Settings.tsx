
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/settings/UserManagement';
import SiteConfiguration from '@/components/admin/settings/SiteConfiguration';
import ScraperConfiguration from '@/components/admin/settings/ScraperConfiguration';
import SupabaseConnection from '@/components/admin/settings/SupabaseConnection';
import EmailConfiguration from '@/components/admin/settings/EmailConfiguration';
import SystemLogs from '@/components/admin/settings/SystemLogs';
import ImportExportTools from '@/components/admin/settings/ImportExportTools';
import { Helmet } from 'react-helmet-async';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>('users');

  return (
    <AdminLayout>
      <Helmet>
        <title>Settings & Configuration | Banks o' Dee FC Admin</title>
      </Helmet>
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings & Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure system-wide settings and manage administrative tools
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-card rounded-md p-2 overflow-x-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="site">Site Config</TabsTrigger>
              <TabsTrigger value="scraper">Scraper</TabsTrigger>
              <TabsTrigger value="supabase">Database</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="data">Import/Export</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="space-y-4 mt-2">
            <UserManagement />
          </TabsContent>

          <TabsContent value="site" className="space-y-4 mt-2">
            <SiteConfiguration />
          </TabsContent>

          <TabsContent value="scraper" className="space-y-4 mt-2">
            <ScraperConfiguration />
          </TabsContent>

          <TabsContent value="supabase" className="space-y-4 mt-2">
            <SupabaseConnection />
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-2">
            <EmailConfiguration />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4 mt-2">
            <SystemLogs />
          </TabsContent>

          <TabsContent value="data" className="space-y-4 mt-2">
            <ImportExportTools />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-2">
            <div className="bg-card rounded-md border p-6">
              <h3 className="text-xl font-semibold mb-4">Advanced System Settings</h3>
              <p className="text-muted-foreground">
                These settings can significantly impact system behavior. Use with caution.
              </p>
              {/* Advanced settings would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
