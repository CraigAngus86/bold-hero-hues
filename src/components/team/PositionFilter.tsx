
import { motion } from 'framer-motion';

interface PositionFilterProps {
  positions: string[];
  selectedPosition: string;
  onPositionChange: (position: string) => void;
}

const PositionFilter = ({
  positions,
  selectedPosition,
  onPositionChange
}: PositionFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {positions.map((position) => (
        <motion.button
          key={position}
          onClick={() => onPositionChange(position)}
          className={`relative px-5 py-2 rounded-full transition-colors ${
            selectedPosition === position
              ? 'text-white'
              : 'text-[#00105a] bg-gray-100 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selectedPosition === position && (
            <motion.div
              layoutId="position-background"
              className="absolute inset-0 rounded-full bg-[#00105a]"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{position}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default PositionFilter;
