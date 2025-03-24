
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsManager from '@/components/admin/NewsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import TeamManager from '@/components/admin/TeamManager';
import LeagueTableManager from '@/components/admin/LeagueTableManager';
import FixturesManager from '@/components/admin/fixtures/FixturesManager';
import { Database, Globe, Server, Calendar } from 'lucide-react';
import DataDashboard from '@/components/admin/data/DataDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Manage website content and settings</p>
          
          <Tabs defaultValue="data" className="space-y-6">
            <TabsList className="grid grid-cols-6 gap-2 md:w-auto">
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="data" className="flex items-center justify-center">
                <Globe className="h-4 w-4 mr-2" />
                Data Scrapers
              </TabsTrigger>
              <TabsTrigger value="league">League Table</TabsTrigger>
              <TabsTrigger value="fixtures" className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2" />
                Fixtures
              </TabsTrigger>
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
                  <CardTitle>Data Scraping & Import Tools</CardTitle>
                  <CardDescription>
                    Import fixtures, results, and league data from external sources including Transfermarkt and Highland League websites.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataDashboard />
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
