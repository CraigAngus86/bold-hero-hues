
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

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
          <motion.div
            key={official.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center p-4">
                <div className="w-16 h-16 overflow-hidden rounded-md mr-4 bg-gray-100">
                  {official.image && (
                    <img 
                      src={official.image} 
                      alt={official.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{official.name}</h3>
                  <p className="text-[#00105a] font-medium text-sm">{official.role}</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <p className="text-gray-600 text-sm line-clamp-2">{official.bio}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClubOfficials;
