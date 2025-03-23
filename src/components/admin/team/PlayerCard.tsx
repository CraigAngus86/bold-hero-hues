
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Player } from './PlayerForm';

interface PlayerCardProps {
  player: Player;
  isEditing: boolean;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

const PlayerCard = ({ player, isEditing, onEdit, onDelete }: PlayerCardProps) => {
  return (
    <Card className={isEditing ? 'border-blue-500' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-sm font-medium bg-team-blue text-white w-6 h-6 rounded-full flex items-center justify-center">
                {player.number}
              </span>
              {player.name}
            </CardTitle>
            <p className="text-sm text-gray-500">{player.position}</p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(player)}
              disabled={isEditing}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(player.id)}
              disabled={isEditing}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          {player.image ? (
            <img 
              src={player.image} 
              alt={player.name}
              className="w-16 h-16 object-cover rounded-full" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="text-sm">
            <p><span className="font-medium">Age:</span> {player.age}</p>
            <p><span className="font-medium">Height:</span> {player.height}</p>
            {player.previousClubs && (
              <p><span className="font-medium">Previous:</span> {player.previousClubs}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
