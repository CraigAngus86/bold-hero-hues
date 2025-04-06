
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlayerEditor from '@/components/admin/team/PlayerEditor';
import PlayersList from '@/components/admin/team/PlayersList';
import StaffList from '@/components/admin/team/StaffList';
import StaffEditor from '@/components/admin/team/StaffEditor';
import PlayerStatistics from '@/components/admin/team/PlayerStatistics';
import { TeamMember } from '@/types/team';

// Create a default player object
const createDefaultPlayer = (): TeamMember => ({
  id: '',
  name: '',
  member_type: 'player',
  position: '',
  image_url: '',
  bio: '',
  nationality: '',
  jersey_number: 0,
  previous_clubs: [],
  experience: '',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  stats: {}
});

// Create a default staff member object
const createDefaultStaff = (): TeamMember => ({
  id: '',
  name: '',
  member_type: 'management',
  position: '',
  image_url: '',
  bio: '',
  nationality: '',
  experience: '',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [playerView, setPlayerView] = useState<'list' | 'editor' | 'stats'>('list');
  const [staffView, setStaffView] = useState<'list' | 'editor'>('list');
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMember | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<TeamMember | null>(null);

  const handleSelectPlayer = (player: TeamMember) => {
    setSelectedPlayer(player);
    setPlayerView('editor');
  };
  
  const handleSelectStaff = (staff: TeamMember) => {
    setSelectedStaff(staff);
    setStaffView('editor');
  };

  const handleViewPlayerStats = (player: TeamMember) => {
    setSelectedPlayer(player);
    setPlayerView('stats');
  };

  const handleCreateNewPlayer = () => {
    setSelectedPlayer(createDefaultPlayer());
    setPlayerView('editor');
  };

  const handleCreateNewStaff = () => {
    setSelectedStaff(createDefaultStaff());
    setStaffView('editor');
  };

  // Go back to list view
  const handleBackToPlayers = () => {
    setPlayerView('list');
    setSelectedPlayer(null);
  };

  const handleBackToStaff = () => {
    setStaffView('list');
    setSelectedStaff(null);
  };

  // Render the player management tab
  const renderPlayerTab = () => {
    if (playerView === 'list') {
      return (
        <PlayersList
          onSelectPlayer={handleSelectPlayer}
          onViewPlayerStats={handleViewPlayerStats}
          onCreateNew={handleCreateNewPlayer}
        />
      );
    } else if (playerView === 'editor' && selectedPlayer) {
      return (
        <PlayerEditor
          player={selectedPlayer}
          onBack={handleBackToPlayers}
        />
      );
    } else if (playerView === 'stats' && selectedPlayer) {
      return (
        <PlayerStatistics
          player={selectedPlayer} 
          onBack={handleBackToPlayers}
        />
      );
    }
    return null;
  };

  // Render the staff management tab
  const renderStaffTab = () => {
    if (staffView === 'list') {
      return (
        <StaffList
          onSelectStaff={handleSelectStaff}
          onCreateNew={handleCreateNewStaff}
        />
      );
    } else if (staffView === 'editor' && selectedStaff) {
      return (
        <StaffEditor
          staff={selectedStaff}
          onBack={handleBackToStaff}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        {activeTab === 'players' && playerView === 'list' && (
          <Button onClick={handleCreateNewPlayer}>Add New Player</Button>
        )}
        {activeTab === 'staff' && staffView === 'list' && (
          <Button onClick={handleCreateNewStaff}>Add New Staff Member</Button>
        )}
      </div>

      <Tabs
        defaultValue="players"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="players" className="mt-4">
          {renderPlayerTab()}
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          {renderStaffTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
