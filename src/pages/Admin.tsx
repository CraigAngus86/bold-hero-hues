
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsManager from '@/components/admin/NewsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import TeamManager from '@/components/admin/TeamManager';
import LeagueTableManager from '@/components/admin/LeagueTableManager';
import ImageManager from '@/components/admin/image-manager/ImageManager';
import { Database, Globe, Server, Newspaper, Users, Award, Image, Calendar, Settings } from 'lucide-react';
import DataDashboard from '@/components/admin/data/DataDashboard';
import { createInitialFolders } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Admin = () => {
  useEffect(() => {
    // Create the initial folders when the Admin page loads
    createInitialFolders();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="news">
          <TabsList className="mb-4">
            <TabsTrigger value="news" className="flex items-center">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Sponsors
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="league" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              League Table
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
          
          <TabsContent value="sponsors">
            <SponsorsManager />
          </TabsContent>
          
          <TabsContent value="team">
            <TeamManager />
          </TabsContent>

          <TabsContent value="fixtures">
            <div className="mb-4 flex justify-end">
              <Button asChild>
                <Link to="/admin/fixtures">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Fixtures
                </Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Fixtures Management</CardTitle>
                <CardDescription>
                  Import, scrape and manage fixtures and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Use the dedicated fixtures section to manage all match fixtures and results.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="league">
            <LeagueTableManager />
          </TabsContent>
          
          <TabsContent value="images">
            <ImageManager />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;
