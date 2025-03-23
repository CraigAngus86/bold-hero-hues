
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import LeagueTableHeader from './LeagueTableHeader';
import TeamRow from './TeamRow';
import { TeamStats } from './types';

interface LeagueTableContentProps {
  leagueData: TeamStats[];
}

const LeagueTableContent = ({ leagueData }: LeagueTableContentProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <LeagueTableHeader />
        <TableBody>
          {leagueData.map((team) => (
            <TeamRow key={team.position} team={team} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTableContent;
