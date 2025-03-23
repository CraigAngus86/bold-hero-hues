
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import StaffMemberCard from './StaffMemberCard';

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-16"
    >
      <div className="flex items-center mb-8">
        <Users className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-3xl font-bold text-[#00105a]">Management Team</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {staff.map((member) => (
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
    </motion.div>
  );
};

export default ManagementTeam;
