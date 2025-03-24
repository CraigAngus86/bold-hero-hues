
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsManager from '@/components/admin/NewsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import TeamManager from '@/components/admin/TeamManager';
import AdminDatabaseSection from '@/components/admin/AdminDatabaseSection';
import LeagueTableManager from '@/components/admin/LeagueTableManager';
import FixturesManager from '@/components/admin/fixtures/FixturesManager';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4">Manage website content and settings</p>
          
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">API Key Required</AlertTitle>
            <AlertDescription className="text-blue-600">
              To use the fixtures scraper feature, you'll need a Firecrawl API key. 
              <a 
                href="https://firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-blue-700 ml-1 hover:text-blue-800"
              >
                Sign up at Firecrawl.dev
              </a> to get your API key.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 md:w-auto">
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
              <TabsTrigger value="league">League Table</TabsTrigger>
              <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            </TabsList>
            
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>News Management</CardTitle>
                  <CardDescription>
                    Add, edit or delete news items for the website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Manage players, staff, and club officials.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sponsors">
              <Card>
                <CardHeader>
                  <CardTitle>Sponsors Management</CardTitle>
                  <CardDescription>
                    Manage club sponsors and their information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SponsorsManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Configure data sources, import/export data, and manage API settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminDatabaseSection />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="league">
              <Card>
                <CardHeader>
                  <CardTitle>League Table Management</CardTitle>
                  <CardDescription>
                    Manage Highland League team logos and table data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LeagueTableManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="fixtures">
              <Card>
                <CardHeader>
                  <CardTitle>Fixtures & Results Management</CardTitle>
                  <CardDescription>
                    Manage all match fixtures and results, import/export data, and control what appears on the website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FixturesManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
