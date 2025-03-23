
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlayerCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  position: string;
  number: number;
  image: string;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  biography?: string;
}

const PlayerCardDialog = ({
  isOpen,
  onOpenChange,
  name,
  position,
  number,
  image,
  stats,
  biography,
}: PlayerCardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00105a]">{name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-auto aspect-square object-cover object-top"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#00105a]">Player Details</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{position}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Squad Number</p>
                  <p className="font-medium">#{number}</p>
                </div>
              </div>
            </div>
            
            {stats && <PlayerCardStats stats={stats} position={position} />}
            
            {biography && (
              <div>
                <h3 className="text-lg font-semibold text-[#00105a] mb-2">Biography</h3>
                <p className="text-gray-600">{biography}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PlayerCardStats = ({ stats, position }: { 
  stats: { 
    appearances?: number; 
    goals?: number; 
    assists?: number; 
    cleanSheets?: number; 
  },
  position: string
}) => {
  const isGoalkeeper = position === "Goalkeeper";
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-[#00105a] mb-2">Season Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.appearances !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-[#00105a]">{stats.appearances}</p>
            <p className="text-sm text-gray-500">Appearances</p>
          </div>
        )}
        {!isGoalkeeper && stats.goals !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-[#00105a]">{stats.goals}</p>
            <p className="text-sm text-gray-500">Goals</p>
          </div>
        )}
        {stats.assists !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-[#00105a]">{stats.assists}</p>
            <p className="text-sm text-gray-500">Assists</p>
          </div>
        )}
        {isGoalkeeper && stats.cleanSheets !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-[#00105a]">{stats.cleanSheets}</p>
            <p className="text-sm text-gray-500">Clean Sheets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCardDialog;
