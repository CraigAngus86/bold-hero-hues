
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import RecentResults from './fixtures/RecentResults';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { TeamStats } from './league/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';

const FixturesSection = () => {
  const [activeTab, setActiveTab] = useState('fixtures');
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLeagueTableFromSupabase();
        setLeagueData(data);
      } catch (error) {
        console.error('Error fetching league data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueData();
  }, []);

  return (
    <section className="py-16 bg-team-gray">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold text-team-blue mb-6"
        >
          Fixtures, Results & Table
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="fixtures" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6 bg-white">
                <TabsTrigger value="fixtures">Upcoming Fixtures</TabsTrigger>
                <TabsTrigger value="results">Recent Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fixtures" className="mt-0">
                <UpcomingFixtures />
              </TabsContent>
              
              <TabsContent value="results" className="mt-0">
                <RecentResults />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <LeagueTablePreview leagueData={leagueData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
