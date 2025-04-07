
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SponsorsList from './SponsorsList';
import SponsorEditor from './SponsorEditor';
import SponsorTierManagement from './SponsorTierManagement';
import { getSponsors } from '@/services/sponsorsService';
import { Sponsor } from '@/types/sponsors';
import { Loader2Icon } from 'lucide-react';

const SponsorsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | undefined>(undefined);
  
  const loadSponsors = async () => {
    setIsLoading(true);
    try {
      const response = await getSponsors();
      if (response.success) {
        setSponsors(response.data || []);
      } else {
        throw new Error(response.error || 'Failed to load sponsors');
      }
    } catch (error) {
      console.error('Error loading sponsors:', error);
      toast.error('Failed to load sponsors');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadSponsors();
  }, []);
  
  const handleNewSponsor = () => {
    setSelectedSponsorId(undefined);
    setShowEditor(true);
  };
  
  const handleEditSponsor = (id: string) => {
    setSelectedSponsorId(id);
    setShowEditor(true);
  };
  
  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedSponsorId(undefined);
  };
  
  const handleSponsorSaved = () => {
    loadSponsors();
    handleCloseEditor();
  };
  
  if (isLoading && sponsors.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2Icon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {showEditor ? (
        <SponsorEditor 
          sponsorId={selectedSponsorId} 
          onClose={handleCloseEditor}
          onSaved={handleSponsorSaved}
          onCancel={handleCloseEditor}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Sponsors Management</h2>
            <Button onClick={handleNewSponsor}>Add New Sponsor</Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Sponsors</TabsTrigger>
              <TabsTrigger value="active">Active Sponsors</TabsTrigger>
              <TabsTrigger value="tiers">Tier Management</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <SponsorsList 
                sponsors={sponsors} 
                onEditSponsor={handleEditSponsor}
                onDeleteSponsor={() => loadSponsors()}
              />
            </TabsContent>
            
            <TabsContent value="active">
              <SponsorsList 
                sponsors={sponsors.filter(s => s.is_active)} 
                onEditSponsor={handleEditSponsor}
                onDeleteSponsor={() => loadSponsors()}
              />
            </TabsContent>
            
            <TabsContent value="tiers">
              <SponsorTierManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sponsor Display Settings</h3>
                <p className="text-gray-500">Sponsor display settings is coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SponsorsManager;
