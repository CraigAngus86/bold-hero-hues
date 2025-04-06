
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { PlusCircle, Users, Shield, Briefcase, LineChart, Palette } from 'lucide-react';
import TeamMembersManager from '@/components/admin/team/TeamMembersManager';
import TeamMemberEditor from '@/components/admin/team/TeamMemberEditor';
import PositionsManager from '@/components/admin/team/PositionsManager';
import SquadsManager from '@/components/admin/team/SquadsManager';
import PlayerStatistics from '@/components/admin/team/PlayerStatistics';
import FormationBuilder from '@/components/admin/team/FormationBuilder';
import { useSquadStore } from '@/services/squadService';
import { useTeamStore } from '@/services/teamService';
import { Alert } from '@/components/ui/alert';

const { H2 } = Typography;

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { loadSquads } = useSquadStore();
  const { loadTeamMembers, isLoading } = useTeamStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadTeamMembers();
        await loadSquads();
      } catch (err) {
        setError('Failed to load team data. Please try refreshing the page.');
        console.error('Error initializing team management:', err);
      }
    };
    
    initialize();
  }, [loadTeamMembers, loadSquads]);

  const handleAddNewMember = () => {
    setSelectedMember(null);
    setIsEditing(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setSelectedMember(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <H2 className="mb-1">Team Management</H2>
            <p className="text-gray-500">Manage players, coaching staff, and club officials</p>
          </div>
          <div className="flex gap-2">
            <Button className="flex items-center gap-1" onClick={handleAddNewMember}>
              <PlusCircle size={16} />
              New Team Member
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>{error}</div>
          </Alert>
        )}

        {isEditing ? (
          <TeamMemberEditor 
            member={selectedMember} 
            onClose={handleCloseEditor} 
          />
        ) : (
          <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users size={16} />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="squads" className="flex items-center gap-2">
                <Shield size={16} />
                Squads
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2">
                <Briefcase size={16} />
                Positions
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <LineChart size={16} />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="formations" className="flex items-center gap-2">
                <Palette size={16} />
                Formations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members">
              <TeamMembersManager onEditMember={handleEditMember} />
            </TabsContent>
            
            <TabsContent value="squads">
              <SquadsManager />
            </TabsContent>
            
            <TabsContent value="positions">
              <PositionsManager />
            </TabsContent>
            
            <TabsContent value="statistics">
              <PlayerStatistics />
            </TabsContent>
            
            <TabsContent value="formations">
              <FormationBuilder />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
