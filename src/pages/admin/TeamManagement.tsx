
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamStore } from '@/services/teamStore';
import type { TeamMember } from '@/types/team';
import { MemberType } from '@/services/teamService';
import TeamMembersManager from '@/components/admin/team/TeamMembersManager';
import TeamStats from '@/components/admin/team/TeamStats';
import TeamPositionsManager from '@/components/admin/team/TeamPositionsManager';
import TeamSettings from '@/components/admin/team/TeamSettings';

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('players');
  const [activeMemberType, setActiveMemberType] = useState<MemberType>('player');

  // Using the teamStore to get members
  const { teamMembers } = useTeamStore();

  // Filter members based on active member type
  const filteredMembers = teamMembers.filter(
    (member) => member.member_type === activeMemberType
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger 
              value="players" 
              onClick={() => setActiveMemberType('player')}
            >
              Players
            </TabsTrigger>
            <TabsTrigger 
              value="coaches" 
              onClick={() => setActiveMemberType('coach')}
            >
              Coaches
            </TabsTrigger>
            <TabsTrigger 
              value="staff" 
              onClick={() => setActiveMemberType('staff')}
            >
              Staff
            </TabsTrigger>
            <TabsTrigger 
              value="officials" 
              onClick={() => setActiveMemberType('official')}
            >
              Officials
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              onClick={() => setActiveMemberType('management')}
            >
              Management
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="players">
          <TeamMembersManager memberType="player" members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="coaches">
          <TeamMembersManager memberType="coach" members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="staff">
          <TeamMembersManager memberType="staff" members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="officials">
          <TeamMembersManager memberType="official" members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="management">
          <TeamMembersManager memberType="management" members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="positions">
          <TeamPositionsManager memberType={activeMemberType} members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="stats">
          <TeamStats memberType={activeMemberType} members={filteredMembers} />
        </TabsContent>
        
        <TabsContent value="settings">
          <TeamSettings memberType={activeMemberType} members={filteredMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
