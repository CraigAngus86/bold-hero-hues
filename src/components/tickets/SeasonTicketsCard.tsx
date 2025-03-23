
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const SeasonTicketsCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 bg-team-blue text-white rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Season Tickets 2023/24</h3>
          <p className="text-white/80">
            Get access to all home league games for the season. Adult season tickets start from just £120.
          </p>
        </div>
        <a 
          href="#" 
          className="bg-white text-team-blue px-5 py-2 rounded font-medium hover:bg-team-lightBlue transition-colors"
        >
          View Season Tickets
        </a>
      </div>
    </motion.div>
  );
};

export default SeasonTicketsCard;
