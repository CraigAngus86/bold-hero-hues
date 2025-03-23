
import React from 'react';
import OfficialCard from './OfficialCard';
import { motion } from 'framer-motion';
import { useTeamStore, TeamMember } from '@/services/teamService';

interface ClubOfficialsProps {
  officials?: TeamMember[];
}

const ClubOfficials = ({ officials }: ClubOfficialsProps) => {
  const { getClubOfficials } = useTeamStore();
  const clubOfficials = officials || getClubOfficials();
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Club Officials</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubOfficials.map((official) => (
          <motion.div
            key={official.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OfficialCard 
              name={official.name}
              role={official.role || ''}
              image={official.image}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClubOfficials;
