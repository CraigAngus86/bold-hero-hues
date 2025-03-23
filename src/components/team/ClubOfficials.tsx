
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClubOfficial {
  name: string;
  role: string;
}

interface ClubOfficialsProps {
  officials: ClubOfficial[];
}

const ClubOfficials = ({ officials }: ClubOfficialsProps) => {
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
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {officials.map((official) => (
            <div key={official.name} className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="w-2 h-2 bg-[#00105a] rounded-full mr-3"></div>
              <div>
                <h4 className="font-medium text-gray-900">{official.name}</h4>
                <p className="text-sm text-gray-500">{official.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ClubOfficials;
