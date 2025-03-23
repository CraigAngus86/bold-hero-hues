
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataScraperControl from '@/components/admin/DataScraperControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Database, Users, FileSpreadsheet, Settings } from 'lucide-react';
import BackendScraper from '@/components/admin/BackendScraper';
import AdminDatabaseSection from '@/components/admin/AdminDatabaseSection';
import AdminUsersSection from '@/components/admin/AdminUsersSection';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage website data and settings</p>
          
          <Tabs defaultValue="scraper" className="w-full">
            <TabsList className="mb-6 flex justify-start overflow-x-auto">
              <TabsTrigger value="scraper" className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Data Scraper
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Database
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scraper">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Data Scraping Controls</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DataScraperControl />
                  <BackendScraper />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="database">
              <AdminDatabaseSection />
            </TabsContent>
            
            <TabsContent value="users">
              <AdminUsersSection />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
                <p className="text-gray-500">
                  This section will be implemented in a future update. It will include controls for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>Site configuration</li>
                  <li>Theme customization</li>
                  <li>API connections</li>
                  <li>Data backup and restore</li>
                </ul>
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
