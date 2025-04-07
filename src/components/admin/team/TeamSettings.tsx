
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/types/team';

export interface TeamSettingsProps {
  memberType: 'player' | 'staff' | 'coach' | 'official' | 'management';
  members: TeamMember[];
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{memberType} Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Configure settings for {memberType}s here.</p>
        <p>You have {members.length} {memberType}s in total.</p>
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
