
interface PlayerCardBackProps {
  name: string;
  position: string;
  image: string;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  biography?: string;
}

const PlayerCardBack = ({
  name,
  position,
  image,
  stats,
  biography,
}: PlayerCardBackProps) => {
  // Determine which stats to show based on position
  const showCleanSheets = position === "Goalkeeper";
  
  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-[#00105a]">{name}</h3>
            <p className="text-gray-500">{position}</p>
          </div>
          <div className="w-14 h-14 overflow-hidden rounded-md">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {stats.appearances !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-[#00105a]">{stats.appearances}</p>
                <p className="text-sm text-gray-500">Appearances</p>
              </div>
            )}
            {showCleanSheets && stats.cleanSheets !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-[#00105a]">{stats.cleanSheets}</p>
                <p className="text-sm text-gray-500">Clean Sheets</p>
              </div>
            )}
            {!showCleanSheets && stats.goals !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-[#00105a]">{stats.goals}</p>
                <p className="text-sm text-gray-500">Goals</p>
              </div>
            )}
          </div>
        )}
        
        {biography && (
          <div className="flex-1 overflow-y-auto text-gray-600 text-sm pr-2">
            <p>{biography}</p>
          </div>
        )}
        
        <div className="mt-auto pt-4 text-xs text-center text-gray-400">
          Click for more
        </div>
      </div>
    </div>
  );
};

export default PlayerCardBack;
