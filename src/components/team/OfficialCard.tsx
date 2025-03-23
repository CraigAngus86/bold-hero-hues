import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface OfficialProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
}

const OfficialCard = ({
  name,
  role,
  image,
  bio,
  experience,
}: OfficialProps) => {
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
            "relative w-full rounded-lg overflow-hidden transition-all duration-700 preserve-3d cursor-pointer shadow-lg hover:shadow-xl h-64",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={toggleFlip}
          onDoubleClick={openDialog}
        >
          {/* Front Card */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full flex flex-col">
              <div className="relative h-4/5 overflow-hidden bg-gradient-to-b from-[#00105a] to-[#00105a]/80">
                <img 
                  src={image} 
                  alt={name} 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-cover object-top"
                />
              </div>
              
              <div className="bg-white p-3 flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-center text-[#00105a]">{name}</h3>
                <p className="text-center text-gray-500 font-medium text-sm">{role}</p>
              </div>
            </div>
            
            <div className="absolute bottom-12 right-4 bg-white/80 px-3 py-1.5 rounded-full text-xs font-medium text-[#00105a] animate-pulse flex items-center">
              <span>View Official</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          {/* Back Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-[#00105a]">{name}</h3>
                  <p className="text-gray-500 text-sm">{role}</p>
                </div>
                <div className="w-12 h-12 overflow-hidden rounded-md">
                  <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              <div className="mt-auto pt-2 text-center">
                <button 
                  className="bg-[#00105a] text-white px-4 py-2 rounded-md text-sm inline-flex items-center"
                  onClick={openDialog}
                >
                  View Official
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
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
              <h3 className="text-lg font-semibold text-[#00105a]">Official Details</h3>
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

export default OfficialCard;
