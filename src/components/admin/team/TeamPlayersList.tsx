
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Player } from './PlayerForm';

interface TeamPlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export const TeamPlayersList = ({ players, onEdit, onDelete }: TeamPlayersListProps) => {
  // Sort players by position groups
  const sortedPlayers = [...players].sort((a, b) => {
    const positionOrder = {
      'Goalkeeper': 1,
      'Defender': 2,
      'Midfielder': 3,
      'Forward': 4
    };
    
    const aOrder = positionOrder[a.position as keyof typeof positionOrder] || 5;
    const bOrder = positionOrder[b.position as keyof typeof positionOrder] || 5;
    
    if (aOrder === bOrder) {
      // If same position, sort by number
      return a.number - b.number;
    }
    
    return aOrder - bOrder;
  });
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="hidden md:table-cell">Height</TableHead>
            <TableHead className="hidden md:table-cell">Previous Clubs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.length > 0 ? (
            sortedPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.number}</TableCell>
                <TableCell className="font-semibold">{player.name}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell className="hidden md:table-cell">{player.height}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {player.previousClubs || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(player)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(player.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center p-4 text-gray-500">
                No players found. Add players using the button above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
