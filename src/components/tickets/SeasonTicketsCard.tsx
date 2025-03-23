
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const SeasonTicketsCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-team-blue text-white rounded-lg shadow-md p-4"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-2 md:mb-0">
          <h3 className="text-lg font-bold mb-1">Season Tickets 2023/24</h3>
          <p className="text-white/80 text-sm">
            Get access to all home league games. Adults from £120.
          </p>
        </div>
        <a 
          href="#" 
          className="bg-white text-team-blue px-4 py-1.5 rounded font-medium text-sm hover:bg-team-lightBlue transition-colors"
        >
          View Details
        </a>
      </div>
    </motion.div>
  );
};

export default SeasonTicketsCard;
