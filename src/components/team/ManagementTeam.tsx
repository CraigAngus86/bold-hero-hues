
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import StaffMemberCard from './StaffMemberCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTeamStore } from '@/services/teamService';

const ManagementTeam = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getManagementStaff } = useTeamStore();
  
  const staff = getManagementStaff();
  
  // Show only first 12 staff members initially, then the rest in collapsible content
  const initialStaff = staff.slice(0, 12);
  const remainingStaff = staff.slice(12);

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
          {initialStaff.map((member) => (
            <StaffMemberCard
              key={member.name}
              name={member.name}
              role={member.role || ''}
              image={member.image}
              bio={member.bio || ''}
              experience={member.experience || ''}
            />
          ))}
        </div>
        
        {remainingStaff.length > 0 && (
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {remainingStaff.map((member) => (
                <StaffMemberCard
                  key={member.name}
                  name={member.name}
                  role={member.role || ''}
                  image={member.image}
                  bio={member.bio || ''}
                  experience={member.experience || ''}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
        
        {remainingStaff.length > 0 && (
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
      </Collapsible>
    </motion.div>
  );
};

export default ManagementTeam;
