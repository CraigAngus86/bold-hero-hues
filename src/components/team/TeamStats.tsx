
import { motion } from 'framer-motion';

const TeamStats = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-16"
    >
      <div className="bg-[#00105a] text-white rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
            <h3 className="text-3xl font-bold mb-1">1902</h3>
            <p className="text-white/70">Year Founded</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
            <h3 className="text-3xl font-bold mb-1">23</h3>
            <p className="text-white/70">First Team Players</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/20">
            <h3 className="text-3xl font-bold mb-1">12</h3>
            <p className="text-white/70">Major Trophies</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold mb-1">6</h3>
            <p className="text-white/70">Coaching Staff</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamStats;
