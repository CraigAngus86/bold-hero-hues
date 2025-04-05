
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import { motion } from 'framer-motion';
import TeamStats from '@/components/team/TeamStats';
import ManagementTeam from '@/components/team/ManagementTeam';
import ClubOfficials from '@/components/team/ClubOfficials';
import ClubHonors from '@/components/team/ClubHonors';
import { useTeamStore } from '@/services/teamService';

const Team = () => {
  const { loadTeamMembers, isLoading } = useTeamStore();
  
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#00105a] mb-4">Team & Management</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the players and staff who represent Banks o' Dee FC on and off the pitch.
            </p>
          </motion.div>
          
          {/* Team Stats Section */}
          <TeamStats />
          
          {/* Management Team Section */}
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <ManagementTeam />
            </div>
          </section>
          
          {/* Player Squad Section */}
          <TeamGrid />
          
          {/* Club Officials */}
          <ClubOfficials />
          
          {/* Club Honors */}
          <ClubHonors />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Team;
