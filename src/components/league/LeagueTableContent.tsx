
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import LeagueTableHeader from './LeagueTableHeader';
import TeamRow from './TeamRow';
import { TeamStats } from './types';

interface LeagueTableContentProps {
  leagueData: TeamStats[];
}

const LeagueTableContent = ({ leagueData }: LeagueTableContentProps) => {
  // Make sure leagueData is sorted by position
  const sortedData = [...leagueData].sort((a, b) => a.position - b.position);
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <LeagueTableHeader />
        <TableBody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={11} className="py-6 text-center text-gray-500">
                No league data available
              </td>
            </tr>
          ) : (
            sortedData.map((team) => (
              <TeamRow key={team.position || team.id} team={team} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTableContent;
