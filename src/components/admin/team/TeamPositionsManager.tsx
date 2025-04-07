
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/types/team';

export interface TeamPositionsManagerProps {
  memberType: 'player' | 'staff' | 'coach' | 'official' | 'management';
  members: TeamMember[];
}

const TeamPositionsManager: React.FC<TeamPositionsManagerProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Positions Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage positions for {memberType}s here.</p>
        <p>You have {members.length} {memberType}s.</p>
      </CardContent>
    </Card>
  );
};

export default TeamPositionsManager;
