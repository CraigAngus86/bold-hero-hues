
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
  biography,
}: PlayerCardBackProps) => {
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
