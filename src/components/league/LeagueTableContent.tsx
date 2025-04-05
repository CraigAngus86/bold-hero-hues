
import React from 'react';
import { Table, TableBody } from '@/components/ui/Table';
import LeagueTableHeader from './LeagueTableHeader';
import TeamRow from './TeamRow';
import { TeamStats } from './types';

interface LeagueTableContentProps {
  leagueData: TeamStats[];
}

const LeagueTableContent = ({ leagueData }: LeagueTableContentProps) => {
  // Make sure leagueData is sorted by position and valid
  const sortedData = [...leagueData].sort((a, b) => {
    // Ensure we have valid positions to compare
    const posA = a.position || 0;
    const posB = b.position || 0;
    return posA - posB;
  });
  
  console.log('Rendering league table with data:', sortedData);
  
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
              <TeamRow 
                key={team.id?.toString() || team.position?.toString() || team.team} 
                team={team} 
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTableContent;
