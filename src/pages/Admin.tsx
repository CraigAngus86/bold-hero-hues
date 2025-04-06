import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, 
  Users, 
  Award, 
  Image, 
  Calendar, 
  Settings,
  Globe,
  RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

import NewsManager from '@/components/admin/NewsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import TeamManager from '@/components/admin/TeamManager';
import LeagueTableManager from '@/components/admin/LeagueTableManager';
import ImageManager from '@/components/admin/image-manager/ImageManager';
import DataDashboard from '@/components/admin/data/DataDashboard';
import { createInitialFolders } from '@/integrations/supabase/client';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create the initial folders when the Admin page loads
    // Commented out for now as it might not be available
    // createInitialFolders();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="news" className="space-y-4">
          <div className="border-b">
            <TabsList className="mb-0">
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
          </div>
          
          {/* Tab content sections */}
          <TabsContent value="news" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">News Management</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <NewsManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sponsors" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">Sponsors Management</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <SponsorsManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">Team Management</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <TeamManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixtures" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">Fixtures Management</h2>
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
                <Button 
                  variant="default" 
                  onClick={() => navigate('/admin/fixtures')}
                  className="mt-2"
                >
                  Go to Fixtures Manager
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="league" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">League Table Management</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <LeagueTableManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">Image Management</h2>
              <Button variant="outline" size="sm" onClick={() => toast.success("Images refreshed")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <ImageManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold">System Settings</h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
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
