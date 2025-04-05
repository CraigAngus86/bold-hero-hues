
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Filter, Settings } from 'lucide-react';
import { FixturesList } from '@/components/admin/fixtures/FixturesList';
import { DateRange } from '@/components/admin/fixtures/DateRange';
import { LoadingIndicator } from '@/components/admin/fixtures/LoadingIndicator';

const FixturesManagement = () => {
  const [loading, setLoading] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [dateFilter, setDateFilter] = useState({ from: undefined, to: undefined });
  
  const handleDateFilterChange = (range) => {
    setDateFilter(range);
    // Here you would typically fetch fixtures based on the date range
  };
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Fixtures Management</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by date:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-auto">
              <DateRange 
                onChange={handleDateFilterChange}
                value={dateFilter}
                className="w-full"
              />
              
              <Button variant="default" disabled={loading} className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </div>
        </Card>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All Fixtures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            {loading ? (
              <LoadingIndicator />
            ) : fixtures.length > 0 ? (
              <FixturesList 
                fixtures={fixtures} 
                onEdit={(fixture) => console.log('Editing fixture:', fixture)}
                onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
              />
            ) : (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">No upcoming fixtures found.</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            {loading ? (
              <LoadingIndicator />
            ) : (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">No past fixtures found.</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            {loading ? (
              <LoadingIndicator />
            ) : (
              <div className="text-center p-12 border border-dashed rounded-md">
                <p className="text-gray-500">No fixtures found.</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FixturesManagement;
