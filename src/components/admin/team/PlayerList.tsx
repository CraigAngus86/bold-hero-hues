
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash, Loader2 } from 'lucide-react';
import { TeamMember } from '@/types/team';

interface PlayerListProps {
  players: TeamMember[];
  isLoading: boolean;
  onDeletePlayer: (id: string) => Promise<void>;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, isLoading, onDeletePlayer }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 py-8">No players found. Add a player to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => (
        <Card key={player.id} className="overflow-hidden">
          <div className="h-48 bg-gray-100 relative overflow-hidden">
            {player.image_url ? (
              <img 
                src={player.image_url} 
                alt={player.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{player.name}</h3>
                <p className="text-gray-600 text-sm">{player.position || 'No position'}</p>
                {player.jersey_number && (
                  <span className="inline-block mt-1 px-2 py-1 bg-team-blue text-white text-xs rounded-md">
                    #{player.jersey_number}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeletePlayer(player.id)}
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlayerList;
