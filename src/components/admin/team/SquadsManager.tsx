import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeamStore } from '@/services/teamStore';
import { TeamMember } from '@/types/team';

interface SquadsManagerProps {
  // Define any props here
}

const SquadsManager: React.FC<SquadsManagerProps> = ({ /* props */ }) => {
  const { teamMembers, isLoading, error } = useTeamStore();

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
            Error loading team members: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Squads Management</CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No team members found.
          </div>
        ) : (
          <ul>
            {teamMembers.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default SquadsManager;

