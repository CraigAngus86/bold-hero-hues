
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clearLeagueDataCache } from '@/services/leagueDataService';
import { toast } from 'sonner';
import { PenSquare, Users, Trophy, Calendar, Newspaper, RotateCcw } from 'lucide-react';
import AdminNewsSection from '@/components/admin/AdminNewsSection';
import AdminTeamSection from '@/components/admin/AdminTeamSection';
import AdminLeagueSection from '@/components/admin/AdminLeagueSection';
import AdminFixturesSection from '@/components/admin/AdminFixturesSection';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('news');

  const handleResetMockData = () => {
    clearLeagueDataCache();
    toast.success("Mock data has been reset to default values");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-team-blue">Admin Dashboard</h1>
              <p className="text-gray-600">Manage website content and data</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleResetMockData}
              className="flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Mock Data
            </Button>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="news" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                <span>News</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="league" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                <span>League</span>
              </TabsTrigger>
              <TabsTrigger value="fixtures" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Fixtures</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white p-6 rounded-lg shadow-sm min-h-[500px]">
              <TabsContent value="news">
                <AdminNewsSection />
              </TabsContent>
              
              <TabsContent value="team">
                <AdminTeamSection />
              </TabsContent>
              
              <TabsContent value="league">
                <AdminLeagueSection />
              </TabsContent>
              
              <TabsContent value="fixtures">
                <AdminFixturesSection />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
