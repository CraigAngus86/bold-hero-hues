
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NextMatch,
  RecentResultsList,
  UpcomingFixturesList,
  FixturesLoading,
  useFixturesData,
  formatMatchDate,
  isBanksODee
} from './fixtures';

const FixturesSection: React.FC = () => {
  const { upcomingFixtures, recentResults, isLoading, nextMatch } = useFixturesData();
  
  return (
    <section className="py-16 bg-team-gray">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-team-blue">Fixtures & Results</h2>
            
            <Button asChild variant="outline" className="bg-team-lightBlue hover:bg-team-blue hover:text-white text-team-blue">
              <Link to="/fixtures" className="inline-flex items-center">
                View All Fixtures <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <FixturesLoading />
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* Next Match Feature */}
              <div className="col-span-12 lg:col-span-6">
                <NextMatch 
                  match={nextMatch} 
                  formatMatchDate={formatMatchDate}
                  isBanksODee={isBanksODee}
                />
              </div>
              
              {/* Results & Upcoming Fixtures */}
              <div className="col-span-12 lg:col-span-6">
                <div className="grid grid-cols-1 gap-4 h-full">
                  {/* Recent Results */}
                  <RecentResultsList 
                    results={recentResults}
                    formatMatchDate={formatMatchDate}
                    isBanksODee={isBanksODee}
                  />
                  
                  {/* More Upcoming Fixtures */}
                  {upcomingFixtures.length > 1 && (
                    <UpcomingFixturesList 
                      fixtures={upcomingFixtures.slice(1, 4)}
                      formatMatchDate={formatMatchDate}
                      isBanksODee={isBanksODee} 
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FixturesSection;
