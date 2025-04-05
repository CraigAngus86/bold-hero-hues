import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import { motion } from 'framer-motion';
import TeamStats from '@/components/team/TeamStats';
import ManagementTeam from '@/components/team/ManagementTeam';
import ClubOfficials from '@/components/team/ClubOfficials';
import ClubHonors from '@/components/team/ClubHonors';

const Team = () => {
  const profileImageUrl = "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png";
  
  const managementTeam = [
    { 
      name: "Josh Winton", 
      role: "Manager", 
      image: profileImageUrl,
      bio: "Josh took charge in 2020 and has led the team to multiple cup successes and improved league positions. Previously managed at junior level with great success. Holds a UEFA B License.",
      experience: "Previous clubs: Deveronvale FC (Assistant), Culter FC"
    },
    { 
      name: "Paul Livingstone", 
      role: "Assistant Manager", 
      image: profileImageUrl,
      bio: "Paul brings extensive tactical knowledge and provides vital support to the manager and players. Joined the club in 2021 after a successful playing career in the Highland League.",
      experience: "Playing career: Formartine United, Inverurie Locos"
    },
    { 
      name: "Andrew Douglas", 
      role: "Coach", 
      image: profileImageUrl,
      bio: "Andrew focuses on player development and implementing training regimes to improve performance. Specializes in attacking play and set pieces.",
      experience: "UEFA A License holder with 15 years coaching experience"
    },
    { 
      name: "Mark Wilson", 
      role: "Goalkeeping Coach", 
      image: profileImageUrl,
      bio: "Mark works specifically with our goalkeepers, drawing on his own professional playing experience. Former professional who made over 200 appearances in Scottish football.",
      experience: "Playing career: Aberdeen FC, Ross County FC"
    },
    { 
      name: "Brian Stewart", 
      role: "Physio", 
      image: profileImageUrl,
      bio: "Brian ensures players stay fit and healthy, managing their rehabilitation from injuries. Has a degree in Sports Therapy and over a decade of experience in sports medicine.",
      experience: "Previously worked with Aberdeen FC youth academy"
    },
    { 
      name: "Chris Thomson", 
      role: "First Team Analyst", 
      image: profileImageUrl,
      bio: "Chris provides in-depth analysis of opposition teams and our own performances to help the coaching staff make tactical decisions. Uses cutting-edge technology to track player performance metrics.",
      experience: "MSc in Performance Analysis from University of Stirling"
    }
  ];

  const clubOfficials = [
    { name: "Thomas Stewart", role: "Club Chairman", image: profileImageUrl, bio: "Serving as club chairman since 2018.", experience: "15 years in sports administration" },
    { name: "Margaret Wilson", role: "Vice Chairman", image: profileImageUrl, bio: "Dedicated to growing the club's community presence.", experience: "Former business consultant" },
    { name: "Craig Stevenson", role: "Club Secretary", image: profileImageUrl, bio: "Handles all administrative duties with precision.", experience: "10 years with the club" },
    { name: "Alan McRae", role: "Treasurer", image: profileImageUrl, bio: "Manages the club's finances efficiently.", experience: "Chartered accountant" },
    { name: "Gordon Smith", role: "Commercial Director", image: profileImageUrl, bio: "Leads commercial partnerships and sponsorships.", experience: "Background in marketing" },
    { name: "Eleanor Grant", role: "Community Relations", image: profileImageUrl, bio: "Develops our community outreach programs.", experience: "Former schoolteacher" }
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
          
          {/* Management Team Section */}
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <ManagementTeam />
            </div>
          </section>
          
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
