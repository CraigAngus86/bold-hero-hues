
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/layout';
import LeagueTableDashboard from '@/components/admin/league-table/LeagueTableDashboard';
import ScraperConfigPanel from '@/components/admin/league-table/ScraperConfigPanel';
import ScraperLogsPanel from '@/components/admin/league-table/ScraperLogsPanel';
import OverridePanel from '@/components/admin/league-table/OverridePanel';
import SeasonArchivePanel from '@/components/admin/league-table/SeasonArchivePanel';
import AlternativeViewsPanel from '@/components/admin/league-table/AlternativeViewsPanel';
import { LayoutDashboard, Settings, ScrollText, Edit, History, TableProperties } from 'lucide-react';

const LeagueTableManagement = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>League Table Management - Banks o' Dee FC Admin</title>
        </Helmet>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-team-blue">League Table Management</h1>
          <p className="text-gray-600 mt-2">
            Manage the Highland League table data scraped from the BBC website.
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="scraper-config" className="flex items-center gap-2">
              <Settings size={16} />
              Scraper Config
            </TabsTrigger>
            <TabsTrigger value="scraper-logs" className="flex items-center gap-2">
              <ScrollText size={16} />
              Scraper Logs
            </TabsTrigger>
            <TabsTrigger value="overrides" className="flex items-center gap-2">
              <Edit size={16} />
              Overrides
            </TabsTrigger>
            <TabsTrigger value="archives" className="flex items-center gap-2">
              <History size={16} />
              Season Archives
            </TabsTrigger>
            <TabsTrigger value="alt-views" className="flex items-center gap-2">
              <TableProperties size={16} />
              Alternative Views
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <LeagueTableDashboard />
          </TabsContent>
          
          <TabsContent value="scraper-config" className="space-y-4">
            <ScraperConfigPanel />
          </TabsContent>
          
          <TabsContent value="scraper-logs" className="space-y-4">
            <ScraperLogsPanel />
          </TabsContent>
          
          <TabsContent value="overrides" className="space-y-4">
            <OverridePanel />
          </TabsContent>
          
          <TabsContent value="archives" className="space-y-4">
            <SeasonArchivePanel />
          </TabsContent>
          
          <TabsContent value="alt-views" className="space-y-4">
            <AlternativeViewsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default LeagueTableManagement;
