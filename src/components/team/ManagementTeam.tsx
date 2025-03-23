
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import StaffMemberCard from './StaffMemberCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StaffMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
}

interface ManagementTeamProps {
  staff: StaffMember[];
}

const ManagementTeam = ({ staff }: ManagementTeamProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const visibleStaff = isOpen ? staff : staff.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-16"
    >
      <div className="flex items-center justify-center mb-8">
        <Users className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-2xl font-semibold text-[#00105a]">Management Team</h2>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleStaff.map((member) => (
            <StaffMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
              bio={member.bio}
              experience={member.experience}
            />
          ))}
        </div>
        
        {staff.length > 4 && (
          <div className="flex justify-center mt-6">
            <CollapsibleTrigger className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-[#00105a]/20 flex items-center justify-center">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#00105a]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#00105a]" />
              )}
            </CollapsibleTrigger>
          </div>
        )}
        
        {staff.length > 4 && (
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {staff.slice(4).map((member) => (
                <StaffMemberCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  bio={member.bio}
                  experience={member.experience}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </motion.div>
  );
};

export default ManagementTeam;
