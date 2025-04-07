
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PlayersList from '@/components/admin/team/PlayersList';
import TeamMembersManager from '@/components/admin/team/TeamMembersManager';
import TeamStats from '@/components/admin/team/TeamStats';
import TeamPositionsManager from '@/components/admin/team/TeamPositionsManager';
import TeamSettings from '@/components/admin/team/TeamSettings';
import { useTeamStore } from '@/services/teamStore';

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('players');
  const { loadTeamMembers, members } = useTeamStore();
  
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);
  
  // Separate members by type
  const players = members.filter(m => m.member_type === 'player');
  const coaches = members.filter(m => m.member_type === 'coach');
  const staff = members.filter(m => m.member_type === 'staff');
  const officials = members.filter(m => m.member_type === 'official');
  const management = members.filter(m => m.member_type === 'management');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            Manage players, coaches, staff, and team information
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="officials">Officials</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <Card>
          <TabsContent value="players" className="p-0 sm:p-6">
            <TeamMembersManager memberType="player" members={players} />
          </TabsContent>
          
          <TabsContent value="coaches" className="p-0 sm:p-6">
            <TeamMembersManager memberType="coach" members={coaches} />
          </TabsContent>
          
          <TabsContent value="staff" className="p-0 sm:p-6">
            <TeamMembersManager memberType="staff" members={staff} />
          </TabsContent>
          
          <TabsContent value="officials" className="p-0 sm:p-6">
            <TeamMembersManager memberType="official" members={officials} />
          </TabsContent>
          
          <TabsContent value="management" className="p-0 sm:p-6">
            <TeamMembersManager memberType="management" members={management} />
          </TabsContent>
          
          <TabsContent value="positions" className="p-0 sm:p-6">
            <TeamPositionsManager />
          </TabsContent>
          
          <TabsContent value="statistics" className="p-0 sm:p-6">
            <TeamStats />
          </TabsContent>
          
          <TabsContent value="settings" className="p-0 sm:p-6">
            <TeamSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
