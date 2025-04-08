
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, TicketIcon, ClipboardIcon, CalendarDaysIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MatchCard from './MatchCard';

interface MatchProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
  matchReportLink?: string;
}

const MatchCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fixtures' | 'results'>('fixtures');
  
  // Mock fixtures data
  const fixtures: MatchProps[] = [
    {
      id: 'fixture-1',
      homeTeam: "Banks o' Dee",
      awayTeam: "Formartine United",
      date: "2025-05-15",
      time: "15:00",
      venue: "Spain Park",
      competition: "Highland League",
      ticketLink: "/tickets/fixture-1"
    },
    {
      id: 'fixture-2',
      awayTeam: "Banks o' Dee",
      homeTeam: "Turriff United",
      date: "2025-05-22",
      time: "15:00",
      venue: "The Haughs",
      competition: "Highland League",
      ticketLink: "/tickets/fixture-2"
    },
    {
      id: 'fixture-3',
      homeTeam: "Banks o' Dee",
      awayTeam: "Huntly FC",
      date: "2025-06-05",
      time: "19:45",
      venue: "Spain Park",
      competition: "Highland League Cup",
      ticketLink: "/tickets/fixture-3"
    }
  ];
  
  // Mock results data
  const results: MatchProps[] = [
    {
      id: 'result-1',
      homeTeam: "Banks o' Dee",
      awayTeam: "Keith FC",
      date: "2025-05-01",
      time: "15:00",
      venue: "Spain Park",
      competition: "Highland League",
      isCompleted: true,
      homeScore: 3,
      awayScore: 1,
      matchReportLink: "/match-reports/result-1"
    },
    {
      id: 'result-2',
      awayTeam: "Banks o' Dee",
      homeTeam: "Buckie Thistle",
      date: "2025-04-24",
      time: "15:00",
      venue: "Victoria Park",
      competition: "Highland League",
      isCompleted: true,
      homeScore: 2,
      awayScore: 2,
      matchReportLink: "/match-reports/result-2"
    },
    {
      id: 'result-3',
      homeTeam: "Banks o' Dee",
      awayTeam: "Brechin City",
      date: "2025-04-17",
      time: "15:00",
      venue: "Spain Park",
      competition: "Highland League",
      isCompleted: true,
      homeScore: 0,
      awayScore: 1,
      matchReportLink: "/match-reports/result-3"
    }
  ];
  
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
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-team-blue mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Match Center
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-accent-500 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Stay updated with the latest fixtures and results for Banks o' Dee FC
          </motion.p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none",
                activeTab === 'fixtures'
                  ? "bg-team-blue text-white"
                  : "bg-white text-team-blue hover:bg-gray-50"
              )}
              onClick={() => setActiveTab('fixtures')}
            >
              <CalendarDaysIcon className="inline-block h-4 w-4 mr-2" />
              Upcoming Fixtures
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none",
                activeTab === 'results'
                  ? "bg-team-blue text-white"
                  : "bg-white text-team-blue hover:bg-gray-50"
              )}
              onClick={() => setActiveTab('results')}
            >
              <ClipboardIcon className="inline-block h-4 w-4 mr-2" />
              Recent Results
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'fixtures' ? (
            <motion.div
              className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {fixtures.map((fixture) => (
                <motion.div
                  key={fixture.id}
                  variants={itemVariants}
                >
                  <MatchCard
                    homeTeam={fixture.homeTeam}
                    awayTeam={fixture.awayTeam}
                    date={fixture.date}
                    time={fixture.time}
                    venue={fixture.venue}
                    competition={fixture.competition}
                    ticketLink={fixture.ticketLink}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  variants={itemVariants}
                >
                  <MatchCard
                    homeTeam={result.homeTeam}
                    awayTeam={result.awayTeam}
                    date={result.date}
                    time={result.time}
                    venue={result.venue}
                    competition={result.competition}
                    isCompleted={result.isCompleted}
                    homeScore={result.homeScore}
                    awayScore={result.awayScore}
                    matchReportLink={result.matchReportLink}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-team-blue text-team-blue hover:bg-team-blue/5"
            asChild
          >
            <a href={activeTab === 'fixtures' ? "/fixtures" : "/results"}>
              View All {activeTab === 'fixtures' ? 'Fixtures' : 'Results'}
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
        
        {/* Call to Action - Season Tickets */}
        <motion.div
          className="mt-16 bg-team-blue rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-white font-bold text-2xl md:text-3xl mb-4">
                Season 2025/26 Tickets
              </h3>
              <p className="text-white/80 mb-6">
                Get your season ticket now for priority access to all home league fixtures at Spain Park. Enjoy special member benefits and discounts throughout the season.
              </p>
              <div className="flex items-center space-x-2">
                <a 
                  href="/tickets/season"
                  className="inline-block bg-accent-500 text-team-blue font-bold px-6 py-3 rounded hover:bg-accent-600 transition-colors shadow-md"
                >
                  <TicketIcon className="inline-block h-5 w-5 mr-2" />
                  Buy Season Tickets
                </a>
                <a 
                  href="/tickets/info"
                  className="inline-block bg-white/20 text-white font-medium px-6 py-3 rounded hover:bg-white/30 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img 
                src="/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png"
                alt="Fans celebrating at Spain Park"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-team-blue to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MatchCenter;
