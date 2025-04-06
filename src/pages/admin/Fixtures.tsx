
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export default function FixturesAdmin() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      // Placeholder for actual fetch logic
      setMatches([]);
      toast.success(`Loaded fixtures and results`);
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
              onClick={() => toast.success('Fixtures exported')}
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
            <TabsTrigger value="manage">Manage Fixtures ({matches.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <p>Fixtures Scraper will be displayed here</p>
              <p>Fixtures Importer will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="docs">
            <p>Documentation will be displayed here</p>
          </TabsContent>
          
          <TabsContent value="manage">
            {matches.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">No fixtures found. Import fixtures first.</p>
              </div>
            ) : (
              <p>Fixtures Manager will be displayed here</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
