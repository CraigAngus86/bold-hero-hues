import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getSponsors } from '@/services/sponsorsService';
import SponsorsList from './SponsorsList';
import SponsorEditor from './SponsorEditor';
import SponsorsSettings from './SponsorsSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SponsorsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sponsors');
  const [editingSponsor, setEditingSponsor] = useState<string | null>(null);
  
  const { data: sponsors, isLoading, error, refetch } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const response = await getSponsors();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load sponsors');
      }
      return response.data;
    }
  });

  const handleEditSponsor = (sponsorId: string) => {
    setEditingSponsor(sponsorId);
    setActiveTab('add-edit');
  };
  
  const handleAddNew = () => {
    setEditingSponsor(null);
    setActiveTab('add-edit');
  };
  
  const handleSaved = () => {
    refetch();
    setEditingSponsor(null);
    setActiveTab('sponsors');
  };

  return (
    <div className="container py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Sponsor Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="sponsors">Sponsors List</TabsTrigger>
          <TabsTrigger value="add-edit">
            {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
          </TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="settings">Display Settings</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {isLoading && activeTab === 'sponsors' ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="sponsors">
                <SponsorsList 
                  sponsors={sponsors || []}
                  onEdit={handleEditSponsor}
                  onAddNew={handleAddNew}
                  onRefresh={refetch}
                />
              </TabsContent>
              
              <TabsContent value="add-edit">
                <SponsorEditor 
                  sponsorId={editingSponsor}
                  onSaved={handleSaved}
                  onCancel={() => setActiveTab('sponsors')}
                />
              </TabsContent>
              
              <TabsContent value="tiers">
                <TierManagement />
              </TabsContent>
              
              <TabsContent value="settings">
                <SponsorsSettings />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default SponsorsManager;
