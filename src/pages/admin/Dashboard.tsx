
import { AdminLayout } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, Users, Calendar, Trophy, FileText, Image, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Management</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage players, staff, positions, and team information
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/team">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage Team <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fixtures & Results</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage fixtures, results, competitions, and venues
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/fixtures-management">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage Fixtures <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">League Table</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage league tables, standings, and statistics
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/league">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage Tables <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News & Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage news articles, categories, and featured content
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/news">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage News <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media Gallery</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage photos, videos, and media albums
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/media">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage Media <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage push notifications and alerts
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/notifications">
                <Button variant="ghost" className="h-8 w-full justify-start px-2 text-xs">
                  Manage Notifications <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
