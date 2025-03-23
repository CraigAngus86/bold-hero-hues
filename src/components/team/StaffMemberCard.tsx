
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface StaffMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
}

const StaffMemberCard = ({
  name,
  role,
  image,
  bio,
  experience,
}: StaffMemberProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const openDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="w-full perspective"
      >
        <div 
          className={cn(
            "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-24",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={toggleFlip}
          onDoubleClick={openDialog}
        >
          {/* Front Card */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full flex">
              <div className="relative h-full w-1/3 overflow-hidden bg-[#00105a]">
                <img 
                  src={image} 
                  alt={name} 
                  className="h-full w-full object-cover object-top"
                />
              </div>
              
              <div className="bg-white px-2 py-1 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#00105a] line-clamp-1">{name}</h3>
                    <p className="text-gray-500 font-medium text-xs line-clamp-1">{role}</p>
                  </div>
                  <button 
                    className="text-[#00105a] p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={openDialog}
                    aria-label="View details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
            <div className="flex h-full p-2">
              <div className="w-10 h-10 overflow-hidden rounded-md self-center mr-2">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#00105a]">{name}</h3>
                    <p className="text-gray-500 text-xs">{role}</p>
                  </div>
                  <button 
                    className="text-[#00105a] p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={openDialog}
                    aria-label="View details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00105a]">{name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-auto aspect-square object-cover object-top"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#00105a]">Staff Details</h3>
              <div className="bg-gray-50 p-3 rounded-md mt-2">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{role}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#00105a] mb-2">Biography</h3>
              <p className="text-gray-600 mb-4">{bio}</p>
              
              <h3 className="text-lg font-semibold text-[#00105a] mb-2">Experience</h3>
              <p className="text-gray-600">{experience}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffMemberCard;
