
import React, { useCallback } from 'react';
import { Table, TableBody } from '@/components/ui/Table';
import LeagueTableHeader from './LeagueTableHeader';
import TeamRow from './TeamRow';
import { TeamStats } from './types';
import ErrorBoundary from '@/components/ErrorBoundary'; // Fixed: Changed from named import to default import

/**
 * Displays the league table with team standings
 */
const LeagueTableContent: React.FC<LeagueTableContentProps> = ({ leagueData }) => {
  // Memoize sort function to prevent recreating on every render
  const sortedData = React.useMemo(() => {
    return [...leagueData].sort((a, b) => {
      // Ensure we have valid positions to compare
      const posA = a.position || 0;
      const posB = b.position || 0;
      return posA - posB;
    });
  }, [leagueData]);
  
  // Render team row with error boundary
  const renderTeamRow = useCallback((team: TeamStats) => {
    const key = team.id?.toString() || team.position?.toString() || team.team;
    
    return (
      <ErrorBoundary key={key} fallback={<tr><td colSpan={11}>Error displaying team data</td></tr>}>
        <TeamRow team={team} />
      </ErrorBoundary>
    );
  }, []);
  
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
            sortedData.map(renderTeamRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default React.memo(LeagueTableContent);
