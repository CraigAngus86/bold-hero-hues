
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/types/team';

export interface TeamPositionsManagerProps {
  memberType: string;
  members: TeamMember[];
}

const TeamPositionsManager: React.FC<TeamPositionsManagerProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{memberType} Positions Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div>This component allows managing positions for {memberType}s.</div>
      </CardContent>
    </Card>
  );
};

export default TeamPositionsManager;
