
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Match } from '@/components/fixtures/types';

interface FixturesListProps {
  fixtures: Match[];
  onEdit: (fixture: Match) => void;
  onDelete: (fixtureId: string) => void;
}

export const FixturesList: React.FC<FixturesListProps> = ({ fixtures, onEdit, onDelete }) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Home</TableHead>
          <TableHead>Away</TableHead>
          <TableHead>Competition</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Ticket Link</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fixtures.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
              No fixtures found
            </TableCell>
          </TableRow>
        ) : (
          fixtures.map((fixture) => (
            <TableRow key={fixture.id}>
              <TableCell>
                {formatDate(fixture.date)} - {fixture.time}
              </TableCell>
              <TableCell>{fixture.homeTeam}</TableCell>
              <TableCell>{fixture.awayTeam}</TableCell>
              <TableCell>{fixture.competition}</TableCell>
              <TableCell>{fixture.venue || 'TBD'}</TableCell>
              <TableCell>
                {fixture.ticketLink ? (
                  <a 
                    href={fixture.ticketLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ticket Link
                  </a>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(fixture)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(fixture.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
