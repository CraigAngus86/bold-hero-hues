
import { ChevronRight } from "lucide-react";

interface PlayerCardFrontProps {
  name: string;
  position: string;
  image: string;
}

const PlayerCardFront = ({ name, position, image }: PlayerCardFrontProps) => {
  return (
    <div className="absolute inset-0 backface-hidden">
      <div className="h-full flex flex-col">
        <div className="relative h-3/4 overflow-hidden bg-gradient-to-b from-[#00105a] to-[#00105a]/80">
          <img 
            src={image} 
            alt={name} 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-cover object-top"
          />
          
          {/* Click for more indicator */}
          <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1.5 rounded-full text-xs font-medium text-[#00105a] animate-pulse flex items-center">
            <span>Click for more</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        
        <div className="bg-white p-4 flex-1 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-center text-[#00105a]">{name}</h3>
          <p className="text-center text-gray-500 font-medium">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCardFront;
