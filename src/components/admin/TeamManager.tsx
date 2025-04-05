
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerList from './team/PlayerList';
import ManagementEditor from './ManagementEditor';
import TeamMembersManager from './team/TeamMembersManager';
import { TeamMember } from '@/services/teamService';
import { deleteTeamMember } from '@/services/teamDbService';
import { useTeamStore } from '@/services/teamService';

const TeamManager = () => {
  const [activeTab, setActiveTab] = useState('players');
  const { teamMembers, loadTeamMembers } = useTeamStore();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  // Function to handle player deletion
  const handleDeletePlayer = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteTeamMember(id);
      await loadTeamMembers();
      toast.success("Player deleted successfully");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Team Management</h2>
        <p className="text-gray-500 mb-6">
          Manage players, coaching staff, and club officials.
        </p>
      </div>
      
      <Tabs defaultValue="players" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="officials">Officials</TabsTrigger>
          <TabsTrigger value="all">All Team Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          <PlayerList 
            players={teamMembers.filter(m => m.member_type === 'player')}
            isLoading={isLoading}
            onDeletePlayer={handleDeletePlayer}
          />
        </TabsContent>
        
        <TabsContent value="management">
          <ManagementEditor />
        </TabsContent>
        
        <TabsContent value="officials">
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-4">Club Officials</h3>
            
            <div className="text-center py-8">
              <p className="text-gray-500">Officials management coming soon...</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('all')}
              >
                Use Team Members Manager
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <TeamMembersManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManager;
