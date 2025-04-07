
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamStatsProps {
  memberType: string;
  members: any[];
}

const TeamStats: React.FC<TeamStatsProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{memberType} Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Total {memberType}s: {members.length}</div>
        <div>Active {memberType}s: {members.filter(m => m.is_active).length}</div>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
