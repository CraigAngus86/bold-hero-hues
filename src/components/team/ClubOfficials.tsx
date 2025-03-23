
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import OfficialCard from './OfficialCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ClubOfficial {
  name: string;
  role: string;
  image: string;
  bio?: string;
  experience?: string;
}

interface ClubOfficialsProps {
  officials: ClubOfficial[];
}

const ClubOfficials = ({ officials }: ClubOfficialsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Add default bio and experience for officials if they don't have one
  const officialsWithDefaults = officials.map((official) => ({
    ...official,
    bio: official.bio || `${official.name} serves as the ${official.role} at Banks o' Dee FC, contributing to the club's success through dedicated management and leadership.`,
    experience: official.experience || "Long-standing member of the Banks o' Dee FC team with extensive experience in club administration and management."
  }));

  // Show only first 12 officials initially, then the rest in collapsible content
  const initialOfficials = officialsWithDefaults.slice(0, 12);
  const remainingOfficials = officialsWithDefaults.slice(12);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-16 mt-16"
    >
      <div className="flex items-center justify-center mb-8">
        <Briefcase className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-xl font-semibold text-[#00105a]">Club Officials</h2>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {initialOfficials.map((official) => (
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
        
        {remainingOfficials.length > 0 && (
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {remainingOfficials.map((official) => (
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
          </CollapsibleContent>
        )}
        
        {remainingOfficials.length > 0 && (
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

export default ClubOfficials;
