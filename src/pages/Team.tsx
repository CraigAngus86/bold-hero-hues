
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import ManagementTeam from '@/components/team/ManagementTeam';
import ClubOfficials from '@/components/team/ClubOfficials';
import ClubHonors from '@/components/team/ClubHonors';
import TeamStats from '@/components/team/TeamStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useTeamStore } from '@/services/teamService';

const Team = () => {
  const { players, staff, officials } = useTeamStore();
  const [activeTab, setActiveTab] = useState('players');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00105a] to-[#00349a] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The players, coaches and staff that make Banks o' Dee FC a club we can all be proud of.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 w-full max-w-lg mx-auto grid grid-cols-3 h-auto p-1">
              <TabsTrigger value="players" className="py-3">
                Players
              </TabsTrigger>
              <TabsTrigger value="management" className="py-3">
                Management
              </TabsTrigger>
              <TabsTrigger value="club" className="py-3">
                Club
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="players">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <TeamGrid players={players} />
                <TeamStats />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="management">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <ManagementTeam staff={staff} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="club">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-16"
              >
                <ClubOfficials officials={officials} />
                <ClubHonors />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Team;
