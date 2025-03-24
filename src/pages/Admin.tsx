
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsManager from '@/components/admin/NewsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import TeamManager from '@/components/admin/TeamManager';
import LeagueTableManager from '@/components/admin/LeagueTableManager';
import ImageManager from '@/components/admin/ImageManager';
import { Database, Globe, Server, Newspaper, Users, Award, Image } from 'lucide-react';
import DataDashboard from '@/components/admin/data/DataDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Manage website content and data</p>
          
          <div className="space-y-8">
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
                <TabsTrigger value="images" className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="news">
                <Card>
                  <CardHeader>
                    <CardTitle>News Management</CardTitle>
                    <CardDescription>
                      Add, edit or remove news articles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <NewsManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sponsors">
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsors Management</CardTitle>
                    <CardDescription>
                      Manage club sponsors and their logos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <SponsorsManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>
                      Manage player and staff information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <TeamManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Management</CardTitle>
                    <CardDescription>
                      Organize and upload match photos and sponsor logos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ImageManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle>League & Fixtures Data</CardTitle>
                    <CardDescription>
                      Manage league table and data scraping
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Tabs defaultValue="league">
                      <TabsList className="mb-4">
                        <TabsTrigger value="league">League Table</TabsTrigger>
                        <TabsTrigger value="data">Data Management</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="league">
                        <LeagueTableManager />
                      </TabsContent>
                      
                      <TabsContent value="data">
                        <DataDashboard />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
