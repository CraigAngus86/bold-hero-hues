
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface StaffMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
}

interface StaffCardProps {
  staff: StaffMember;
}

const StaffCard = ({ staff }: StaffCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative">
            <div className="flex items-center p-4">
              <div className="w-16 h-16 overflow-hidden rounded-md mr-4">
                <img 
                  src={staff.image} 
                  alt={staff.name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{staff.name}</h3>
                <p className="text-[#00105a] font-medium text-sm">{staff.role}</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-gray-600 text-sm line-clamp-2">{staff.bio}</p>
            </div>
            <div className="absolute bottom-1 right-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-[#00105a] animate-pulse">
              Click for more
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="flex justify-between space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={staff.image} 
                alt={staff.name} 
                className="h-16 w-16 rounded-md object-cover object-top"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">{staff.name}</h4>
              <p className="text-[#00105a] font-medium text-sm">{staff.role}</p>
              <p className="text-sm text-gray-700">{staff.bio}</p>
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500">EXPERIENCE</p>
                <p className="text-sm text-gray-700">{staff.experience}</p>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );
};

export default StaffCard;
