
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

interface PlayerFilterProps {
  selectedPosition: string | null;
  setSelectedPosition: (position: string) => void;
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
}

const PlayerFilter = ({ 
  selectedPosition, 
  setSelectedPosition, 
  isAdding, 
  setIsAdding 
}: PlayerFilterProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="position-filter">Filter by Position:</Label>
        <Select value={selectedPosition || ''} onValueChange={setSelectedPosition}>
          <SelectTrigger id="position-filter" className="w-40">
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Positions</SelectItem>
            {POSITIONS.map(pos => (
              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {!isAdding && (
        <Button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Player</span>
        </Button>
      )}
    </div>
  );
};

export default PlayerFilter;
