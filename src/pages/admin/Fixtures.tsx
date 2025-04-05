
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FixturesScraper from '@/components/admin/fixtures/FixturesScraper';
import FixturesImporter from '@/components/admin/fixtures/FixturesImporter';
import ScraperDocumentation from '@/components/admin/fixtures/ScraperDocumentation';
import { fetchMatchesFromSupabase } from '@/services/supabase/fixturesService';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { generateFixturesExport } from '@/services/supabase/fixtures/testUtils';

export default function FixturesAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const fixturesData = await fetchMatchesFromSupabase();
      const convertedMatches = convertToMatches(fixturesData);
      setMatches(convertedMatches);
      toast.success(`Loaded ${convertedMatches.length} fixtures and results`);
    } catch (error) {
      console.error('Error loading fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Fixtures Management</h1>
          <div className="flex space-x-2">
            <Button
              onClick={generateFixturesExport}
              variant="outline"
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button
              onClick={fetchMatches}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="import">
          <TabsList className="mb-4">
            <TabsTrigger value="import">Import Fixtures</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="manage" disabled={matches.length === 0}>Manage Fixtures ({matches.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FixturesScraper />
              <FixturesImporter />
            </div>
          </TabsContent>
          
          <TabsContent value="docs">
            <ScraperDocumentation />
          </TabsContent>
          
          <TabsContent value="manage">
            {matches.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">No fixtures found. Import fixtures first.</p>
              </div>
            ) : (
              <div className="border rounded-md p-4">
                <p className="text-gray-500 mb-4">This section will allow editing and managing fixtures. Currently showing {matches.length} fixtures and results.</p>
                <p className="text-sm text-amber-600">Fixture editing functionality coming soon.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
