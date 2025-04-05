
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  name: string;
  position: string;
  number: number;
  imageUrl: string;
  variant?: 'default' | 'compact';
}

const PlayerCard = ({ 
  name, 
  position, 
  number, 
  imageUrl, 
  variant = 'default' 
}: PlayerCardProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md bg-white",
        variant === 'compact' ? "h-full" : ""
      )}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 bg-[#00105a] text-white px-2 py-1 text-lg font-bold">
          {number}
        </div>
        
        {variant === 'default' ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-64 object-cover object-center"
          />
        ) : (
          <div className="p-4 flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600 text-sm">{position}</p>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
