
import React, { useState, useEffect } from 'react';
import PlayerList from './team/PlayerList';
import PositionFilter from './team/PositionFilter';
import { useTeamStore } from '@/services/teamStore';

// Adapter to convert TeamMember to the Player format expected by PlayerList
const adaptTeamMemberToPlayer = (member) => {
  return {
    id: member.id,
    name: member.name,
    position: member.position || '',
    imageUrl: member.image_url || '/placeholder.svg',
    number: member.jersey_number || 0
  };
};

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const { getPlayersByPosition, loadTeamMembers, isLoading } = useTeamStore();
  
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);
  
  // Define positions used for filtering
  const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
  
  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
  };
  
  // Get players by position and adapt them to the format expected by PlayerList
  const players = getPlayersByPosition(selectedPosition).map(adaptTeamMemberToPlayer);

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-team-blue mb-6">Our Squad</h2>
      
      <PositionFilter
        positions={positions}
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
      />
      
      {isLoading ? (
        <div className="text-center py-8">Loading players...</div>
      ) : players.length > 0 ? (
        <PlayerList players={players} />
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No players found for the selected position.</p>
          <p className="text-gray-400 text-sm mt-2">
            {selectedPosition !== "All" ? 
              `Try selecting a different position filter` : 
              `Add players in the Team Management section of the admin area`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamGrid;
