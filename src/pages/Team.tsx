
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import { motion } from 'framer-motion';
import TeamStats from '@/components/team/TeamStats';
import ManagementTeam from '@/components/team/ManagementTeam';
import ClubOfficials from '@/components/team/ClubOfficials';
import ClubHonors from '@/components/team/ClubHonors';

const Team = () => {
  const managementTeam = [
    { 
      name: "Josh Winton", 
      role: "Manager", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      bio: "Josh took charge in 2020 and has led the team to multiple cup successes and improved league positions. Previously managed at junior level with great success. Holds a UEFA B License.",
      experience: "Previous clubs: Deveronvale FC (Assistant), Culter FC"
    },
    { 
      name: "Paul Livingstone", 
      role: "Assistant Manager", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
      bio: "Paul brings extensive tactical knowledge and provides vital support to the manager and players. Joined the club in 2021 after a successful playing career in the Highland League.",
      experience: "Playing career: Formartine United, Inverurie Locos"
    },
    { 
      name: "Andrew Douglas", 
      role: "Coach", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      bio: "Andrew focuses on player development and implementing training regimes to improve performance. Specializes in attacking play and set pieces.",
      experience: "UEFA A License holder with 15 years coaching experience"
    },
    { 
      name: "Mark Wilson", 
      role: "Goalkeeping Coach", 
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      bio: "Mark works specifically with our goalkeepers, drawing on his own professional playing experience. Former professional who made over 200 appearances in Scottish football.",
      experience: "Playing career: Aberdeen FC, Ross County FC"
    },
    { 
      name: "Brian Stewart", 
      role: "Physio", 
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      bio: "Brian ensures players stay fit and healthy, managing their rehabilitation from injuries. Has a degree in Sports Therapy and over a decade of experience in sports medicine.",
      experience: "Previously worked with Aberdeen FC youth academy"
    },
    { 
      name: "Chris Thomson", 
      role: "First Team Analyst", 
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      bio: "Chris provides in-depth analysis of opposition teams and our own performances to help the coaching staff make tactical decisions. Uses cutting-edge technology to track player performance metrics.",
      experience: "MSc in Performance Analysis from University of Stirling"
    }
  ];

  const clubOfficials = [
    { name: "Thomas Stewart", role: "Club Chairman" },
    { name: "Margaret Wilson", role: "Vice Chairman" },
    { name: "Craig Stevenson", role: "Club Secretary" },
    { name: "Alan McRae", role: "Treasurer" },
    { name: "Gordon Smith", role: "Commercial Director" },
    { name: "Eleanor Grant", role: "Community Relations" }
  ];

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
          
          {/* Management Section */}
          <ManagementTeam staff={managementTeam} />
          
          {/* Player Squad Section */}
          <TeamGrid />
          
          {/* Club Officials */}
          <ClubOfficials officials={clubOfficials} />
          
          {/* Club Honors */}
          <ClubHonors />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Team;
