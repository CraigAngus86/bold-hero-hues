import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, BarChart2 } from 'lucide-react';
import { TeamMember } from '@/types/team';
import { useTeamStore } from '@/services/teamStore';
import { useMutation } from '@tanstack/react-query';
import { deleteTeamMember } from '@/services/teamDbService';
import { toast } from 'sonner';

interface PlayersListProps {
  onSelectPlayer: (player: TeamMember) => void;
  onViewPlayerStats: (player: TeamMember) => void;
  onCreateNew: () => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  onSelectPlayer, 
  onViewPlayerStats, 
  onCreateNew 
}) => {
  const { teamMembers, isLoading, error, loadTeamMembers } = useTeamStore(state => ({
    teamMembers: state.teamMembers.filter(m => m.member_type === 'player'),
    isLoading: state.isLoading,
    error: state.error,
    loadTeamMembers: state.loadTeamMembers
  }));

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTeamMember(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete player');
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Player deleted successfully');
      loadTeamMembers();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete player');
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">
            Error loading players: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Players</CardTitle>
        <Button onClick={onCreateNew} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No players found. Add your first player to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 font-semibold">Name</th>
                  <th className="pb-2 font-semibold">Position</th>
                  <th className="pb-2 font-semibold">Nationality</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((player) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3">{player.name}</td>
                    <td className="py-3">{player.position}</td>
                    <td className="py-3">{player.nationality}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        player.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {player.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewPlayerStats(player)}
                        >
                          <BarChart2 className="h-4 w-4" />
                          <span className="sr-only">View Stats</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectPlayer(player)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayersList;
