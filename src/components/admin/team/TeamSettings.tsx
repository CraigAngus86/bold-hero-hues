
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamSettingsProps {
  memberType: string;
  members: any[];
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ memberType, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{memberType} Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Configure settings for {memberType}s here.</div>
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
