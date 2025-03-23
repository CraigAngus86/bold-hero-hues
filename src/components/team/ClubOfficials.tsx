
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import OfficialCard from './OfficialCard';

interface ClubOfficial {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  experience?: string;
}

interface ClubOfficialsProps {
  officials: ClubOfficial[];
}

const ClubOfficials = ({ officials }: ClubOfficialsProps) => {
  // Add default images for officials if they don't have one
  const officialsWithImages = officials.map((official, index) => ({
    ...official,
    image: official.image || `https://images.unsplash.com/photo-${1560250097 + index}-0b93528c311a?auto=format&fit=crop&w=800&q=80`,
    bio: official.bio || `${official.name} serves as the ${official.role} at Banks o' Dee FC, contributing to the club's success through dedicated management and leadership.`,
    experience: official.experience || "Long-standing member of the Banks o' Dee FC team with extensive experience in club administration and management."
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-16 mt-16"
    >
      <div className="flex items-center mb-8">
        <Briefcase className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-3xl font-bold text-[#00105a]">Club Officials</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {officialsWithImages.map((official) => (
          <OfficialCard
            key={official.name}
            name={official.name}
            role={official.role}
            image={official.image}
            bio={official.bio}
            experience={official.experience}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ClubOfficials;
