
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataScraperControl from '@/components/admin/DataScraperControl';
import NewsManager from '@/components/admin/NewsManager';
import TeamManager from '@/components/admin/TeamManager';
import ManagementManager from '@/components/admin/ManagementManager';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("scraper");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage website data and settings</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="scraper">Data Scraper</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scraper">
              <DataScraperControl />
            </TabsContent>
            
            <TabsContent value="news">
              <NewsManager />
            </TabsContent>
            
            <TabsContent value="team">
              <TeamManager />
            </TabsContent>
            
            <TabsContent value="management">
              <ManagementManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
