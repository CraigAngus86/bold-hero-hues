
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, PlusCircle, User, X, Group } from 'lucide-react';
import { TeamMember } from '@/types/team';
import { useTeamStore } from '@/services/teamService';

interface Squad {
  id: string;
  name: string;
  memberIds: string[];
}

const SquadsManager: React.FC = () => {
  const { teamMembers, loadTeamMembers } = useTeamStore();
  const [isLoading, setIsLoading] = useState(false);
  const [squads, setSquads] = useState<Squad[]>([
    { id: '1', name: 'First Team', memberIds: [] },
    { id: '2', name: 'Reserves', memberIds: [] },
    { id: '3', name: 'Youth Team', memberIds: [] }
  ]);
  const [newSquadName, setNewSquadName] = useState('');
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    loadTeamMembers().then(() => {
      setIsLoading(false);
    });
  }, [loadTeamMembers]);
  
  useEffect(() => {
    // Filter players not already in a squad
    const assignedMemberIds = squads.flatMap(squad => squad.memberIds);
    const unassignedMembers = teamMembers.filter(
      member => member.member_type === 'player' && !assignedMemberIds.includes(member.id)
    );
    setAvailableMembers(unassignedMembers);
  }, [teamMembers, squads]);
  
  const handleAddSquad = () => {
    if (!newSquadName.trim()) return;
    
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name: newSquadName,
      memberIds: []
    };
    
    setSquads(prev => [...prev, newSquad]);
    setNewSquadName('');
  };
  
  const handleRemoveSquad = (squadId: string) => {
    setSquads(prev => prev.filter(squad => squad.id !== squadId));
  };
  
  const handleAddMemberToSquad = (squadId: string, memberId: string) => {
    setSquads(prev => prev.map(squad => {
      if (squad.id === squadId) {
        return {
          ...squad,
          memberIds: [...squad.memberIds, memberId]
        };
      }
      return squad;
    }));
  };
  
  const handleRemoveMemberFromSquad = (squadId: string, memberId: string) => {
    setSquads(prev => prev.map(squad => {
      if (squad.id === squadId) {
        return {
          ...squad,
          memberIds: squad.memberIds.filter(id => id !== memberId)
        };
      }
      return squad;
    }));
  };
  
  const getTeamMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading squads...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield size={18} className="mr-2" /> Squad Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="New squad name..." 
              value={newSquadName}
              onChange={(e) => setNewSquadName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleAddSquad} disabled={!newSquadName.trim()}>
              <PlusCircle size={16} className="mr-2" /> Add Squad
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Players */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User size={16} /> Available Players
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                {availableMembers.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    All players have been assigned to squads
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {availableMembers.map(member => (
                      <li key={member.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden mr-2">
                            {member.image_url ? (
                              <img 
                                src={member.image_url} 
                                alt={member.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500">
                                <User size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.position || 'No position'}</p>
                          </div>
                        </div>
                        <div>
                          <select 
                            className="text-xs border rounded px-2 py-1"
                            onChange={(e) => handleAddMemberToSquad(e.target.value, member.id)}
                            value="placeholder"
                          >
                            <option value="placeholder" disabled>Add to squad...</option>
                            {squads.map(squad => (
                              <option key={squad.id} value={squad.id}>
                                {squad.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* Squads */}
            <div className="space-y-4">
              {squads.map(squad => (
                <Card key={squad.id}>
                  <CardHeader className="py-3 flex flex-row justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Group size={16} /> {squad.name}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveSquad(squad.id)}
                    >
                      <X size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {squad.memberIds.length === 0 ? (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No players in this squad
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {squad.memberIds.map(memberId => {
                          const member = getTeamMemberById(memberId);
                          return member ? (
                            <li key={memberId} className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-100 rounded-full overflow-hidden mr-2">
                                  {member.image_url ? (
                                    <img 
                                      src={member.image_url} 
                                      alt={member.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-500">
                                      <User size={12} />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm">{member.name}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleRemoveMemberFromSquad(squad.id, memberId)}
                              >
                                <X size={14} />
                              </Button>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SquadsManager;
