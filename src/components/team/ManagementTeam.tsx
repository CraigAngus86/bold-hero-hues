
import React from 'react';
import StaffCard from './StaffCard';
import { motion } from 'framer-motion';
import { useTeamStore, TeamMember } from '@/services/teamService';

interface ManagementTeamProps {
  staff?: TeamMember[];
}

const ManagementTeam = ({ staff }: ManagementTeamProps) => {
  const { getManagementStaff } = useTeamStore();
  const managementStaff = staff || getManagementStaff();
  
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Management Team</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {managementStaff.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StaffCard 
              name={member.name}
              role={member.role || ''}
              image={member.image}
              bio={member.bio || ''}
              experience={member.experience || ''}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManagementTeam;
