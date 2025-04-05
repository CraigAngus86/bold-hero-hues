
import React, { useState, useEffect } from 'react';
import PlayerList from './team/PlayerList';
import PositionFilter from './team/PositionFilter';
import { useTeamStore } from '@/services/teamService';

// Adapter to convert TeamMember to the Player format expected by PlayerList
const adaptTeamMemberToPlayer = (member) => {
  return {
    id: member.id,
    name: member.name,
    position: member.position || '',
    imageUrl: member.image || '/placeholder-player.png', // Add default image if none exists
    number: member.number || 0
  };
};

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const { getPlayersByPosition, fetchTeamMembers, loading } = useTeamStore();
  
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);
  
  const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
  
  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
  };
  
  // Get players by position and adapt them to the format expected by PlayerList
  const players = getPlayersByPosition(selectedPosition).map(adaptTeamMemberToPlayer);

  if (loading) {
    return <div className="text-center py-8">Loading players...</div>;
  }

  return (
    <div>
      <PositionFilter
        positions={positions}
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
      />
      
      <PlayerList players={players} />
    </div>
  );
};

export default TeamGrid;
