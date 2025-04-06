
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronsRight, LayoutDashboard, ListChecks, LucideIcon, Sparkles, Trophy } from 'lucide-react';
import BaseText from '@/components/ui/BaseText';
import { TeamStats } from '@/components/league/types';
import { Match } from '@/components/fixtures/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { getAllFixtures } from '@/services/fixturesService';

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

const DashboardCard: React.FC<CardProps> = ({ title, description, icon: Icon, link }) => (
  <Link to={link} className="group relative block bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
    <div className="px-6 py-5">
      <div className="flex items-center space-x-3 mb-3">
        <Icon className="h-6 w-6 text-primary-800" />
        <BaseText variant="h4" className="text-gray-800 mb-0">{title}</BaseText>
      </div>
      <BaseText variant="body" className="text-gray-600">{description}</BaseText>
    </div>
    <div className="absolute bottom-0 left-0 w-full bg-primary-100 text-primary-800 py-2 px-6 flex items-center justify-between group-hover:bg-primary-200 transition-colors duration-300">
      <BaseText variant="small" className="font-medium">Go to {title}</BaseText>
      <ChevronsRight className="h-4 w-4" />
    </div>
  </Link>
);

// Create the FixturePreview component
const FixturePreview: React.FC<{ fixtures: Match[] | null; isLoading: boolean }> = ({ fixtures, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <BaseText variant="h3" className="text-primary-800">Upcoming Fixtures</BaseText>
        <Link to="/fixtures" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
          See all
        </Link>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading fixtures...</p>
        </div>
      ) : fixtures && fixtures.length > 0 ? (
        <div className="space-y-3">
          {fixtures.map((match, idx) => (
            <div key={match.id || idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()} - {match.competition}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="font-medium">{match.homeTeam}</span>
                <span className="text-sm px-3">vs</span>
                <span className="font-medium">{match.awayTeam}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500">No upcoming fixtures found</div>
      )}
    </div>
  );
};

// Create the LeagueTablePreview component 
const LeagueTablePreview: React.FC<{ leagueData: TeamStats[] | null }> = ({ leagueData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <BaseText variant="h3" className="text-primary-800">League Table</BaseText>
        <Link to="/table" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
          Full table
        </Link>
      </div>
      
      {!leagueData ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading table...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-4 py-2">Pos</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">P</th>
                <th className="px-4 py-2">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leagueData.slice(0, 5).map((team) => (
                <tr key={team.teamName} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{team.position}</td>
                  <td className="px-4 py-2 font-medium">{team.teamName}</td>
                  <td className="px-4 py-2">{team.played}</td>
                  <td className="px-4 py-2 font-medium">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Create the NewsPreview component
const NewsPreview: React.FC<{ news: any[] | null; isLoading: boolean }> = ({ news, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <BaseText variant="h3" className="text-primary-800">Latest News</BaseText>
        <Link to="/news" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
          All news
        </Link>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading news...</p>
        </div>
      ) : news && news.length > 0 ? (
        <div className="space-y-3">
          {news.map((article) => (
            <div key={article.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="text-xs text-gray-500 mb-1">{new Date(article.date || article.publish_date).toLocaleDateString()}</div>
              <Link to={`/news/${article.id || article.slug}`} className="block">
                <BaseText variant="h4" className="text-gray-800 hover:text-primary-700 mb-1 line-clamp-2">
                  {article.title}
                </BaseText>
              </Link>
              {article.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500">No news articles found</div>
      )}
    </div>
  );
};

const HeroSection = () => {
  const [nextFixtures, setNextFixtures] = useState<Match[] | null>(null);
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [latestNews, setLatestNews] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch league table data
      const leagueResult = await fetchLeagueTableFromSupabase();
      setLeagueData(leagueResult);
      
      // Fetch upcoming fixtures
      const fixturesResult = await getAllFixtures();
      if (fixturesResult.success && fixturesResult.data) {
        // Get upcoming fixtures (not completed yet)
        const today = new Date();
        const upcoming = fixturesResult.data
          .filter(fixture => !fixture.isCompleted && new Date(fixture.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        
        setNextFixtures(upcoming);
      }
      
      // Since we don't have fetchLatestNews anymore, we'll just set an empty array
      // This would be replaced with actual news fetching in a production environment
      setLatestNews([]);
      
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  return (
    <section className="bg-team-gray py-12">
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <BaseText variant="h1" className="text-team-blue font-extrabold mb-4">
            Welcome to Banks o' Dee FC
          </BaseText>
          <BaseText variant="body" className="text-gray-700 max-w-3xl mx-auto">
            Get the latest news, fixtures, and league standings for the Highland League's most exciting team.
          </BaseText>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Fixtures"
            description="View upcoming matches and get the latest results."
            icon={CalendarDays}
            link="/fixtures"
          />
          <DashboardCard
            title="League Table"
            description="See the latest Highland League standings."
            icon={Trophy}
            link="/table"
          />
          <DashboardCard
            title="News"
            description="Read the latest news and updates from the club."
            icon={Sparkles}
            link="/news"
          />
          <DashboardCard
            title="Admin Dashboard"
            description="Manage website content and settings."
            icon={LayoutDashboard}
            link="/admin"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FixturePreview fixtures={nextFixtures} isLoading={isLoading} />
          <LeagueTablePreview leagueData={leagueData} />
          <NewsPreview news={latestNews} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
