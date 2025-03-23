
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubHonors = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center mb-8">
        <Trophy className="w-6 h-6 text-[#00105a] mr-3" />
        <h2 className="text-3xl font-bold text-[#00105a]">Club Honours</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
            <h3 className="font-bold text-xl mb-4">Highland League</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-[#00105a] rounded-full mr-2"></span>
                <span>Champions: 2021-22</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-[#00105a] rounded-full mr-2"></span>
                <span>Runners-up: 2020-21, 2019-20</span>
              </li>
            </ul>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl mb-4">Cup Competitions</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-[#00105a] rounded-full mr-2"></span>
                <span>Highland League Cup: 2022-23, 2019-20</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-[#00105a] rounded-full mr-2"></span>
                <span>Aberdeenshire Cup: 2021-22, 2018-19</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-[#00105a] rounded-full mr-2"></span>
                <span>Aberdeenshire Shield: 2020-21</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubHonors;
