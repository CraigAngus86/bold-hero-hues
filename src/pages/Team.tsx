
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import { motion } from 'framer-motion';
import { Users, Trophy, Award, Briefcase } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const StaffCard = ({ staff }: { staff: { name: string; role: string; image: string; bio: string; experience: string } }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative">
            <div className="flex items-center p-4">
              <div className="w-16 h-16 overflow-hidden rounded-md mr-4">
                <img 
                  src={staff.image} 
                  alt={staff.name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{staff.name}</h3>
                <p className="text-[#00105a] font-medium text-sm">{staff.role}</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-gray-600 text-sm line-clamp-2">{staff.bio}</p>
            </div>
            <div className="absolute bottom-1 right-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-[#00105a] animate-pulse">
              Click for more
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="flex justify-between space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={staff.image} 
                alt={staff.name} 
                className="h-16 w-16 rounded-md object-cover object-top"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">{staff.name}</h4>
              <p className="text-[#00105a] font-medium text-sm">{staff.role}</p>
              <p className="text-sm text-gray-700">{staff.bio}</p>
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500">EXPERIENCE</p>
                <p className="text-sm text-gray-700">{staff.experience}</p>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );
};

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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-[#00105a] text-white rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
                  <h3 className="text-3xl font-bold mb-1">1902</h3>
                  <p className="text-white/70">Year Founded</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
                  <h3 className="text-3xl font-bold mb-1">23</h3>
                  <p className="text-white/70">First Team Players</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/20">
                  <h3 className="text-3xl font-bold mb-1">12</h3>
                  <p className="text-white/70">Major Trophies</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center">
                  <h3 className="text-3xl font-bold mb-1">6</h3>
                  <p className="text-white/70">Coaching Staff</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Management Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <Users className="w-6 h-6 text-[#00105a] mr-3" />
              <h2 className="text-3xl font-bold text-[#00105a]">Management Team</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {managementTeam.map((staff, index) => (
                <StaffCard key={staff.name} staff={staff} />
              ))}
            </div>
          </motion.div>
          
          {/* Player Squad Section */}
          <TeamGrid />
          
          {/* Club Officials */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16 mt-16"
          >
            <div className="flex items-center mb-8">
              <Briefcase className="w-6 h-6 text-[#00105a] mr-3" />
              <h2 className="text-3xl font-bold text-[#00105a]">Club Officials</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {clubOfficials.map((official) => (
                  <div key={official.name} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="w-2 h-2 bg-[#00105a] rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{official.name}</h4>
                      <p className="text-sm text-gray-500">{official.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Club Honors */}
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Team;
