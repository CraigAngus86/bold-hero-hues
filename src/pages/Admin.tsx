
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewspaperIcon, Users, Cog, HeartHandshake } from 'lucide-react';
import NewsManager from '@/components/admin/NewsManager';
import TeamManager from '@/components/admin/TeamManager';
import ManagementEditor from '@/components/admin/ManagementEditor';
import SponsorsManager from '@/components/admin/SponsorsManager';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage website content and settings</p>
          
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="mb-6 flex justify-start overflow-x-auto">
              <TabsTrigger value="news" className="flex items-center">
                <NewspaperIcon className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Team & Staff
              </TabsTrigger>
              <TabsTrigger value="sponsors" className="flex items-center">
                <HeartHandshake className="h-4 w-4 mr-2" />
                Sponsors
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>News Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team & Staff Management</CardTitle>
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
                </CardHeader>
                <CardContent>
                  <SponsorsManager />
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
