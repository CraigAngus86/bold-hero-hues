
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/types/team';

export interface TeamStatsProps {
  memberType: 'player' | 'staff' | 'coach' | 'official' | 'management';
  members: TeamMember[];
}

const TeamStats: React.FC<TeamStatsProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{memberType} Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>View statistics for {memberType}s here.</p>
        <p>You have {members.length} {memberType}s in total.</p>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
