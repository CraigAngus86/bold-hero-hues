import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronsRight, LayoutDashboard, ListChecks, LucideIcon, Sparkles, Trophy } from 'lucide-react';
import FixturePreview from '@/components/fixtures/FixturePreview';
import LeagueTablePreview from '@/components/fixtures/LeagueTablePreview';
import NewsPreview from '@/components/news/NewsPreview';
import BaseText from '@/components/ui/BaseText';
import { TeamStats } from '@/components/league/types';
import { Match } from '@/components/fixtures/types';
import { Article } from '@/components/news/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { fetchNextFixtures } from '@/services/supabase/fixturesService';
import { fetchLatestNews } from '@/services/supabase/newsService';

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
      <BaseText variant="body2" className="text-gray-600">{description}</BaseText>
    </div>
    <div className="absolute bottom-0 left-0 w-full bg-primary-100 text-primary-800 py-2 px-6 flex items-center justify-between group-hover:bg-primary-200 transition-colors duration-300">
      <BaseText variant="body2" className="font-medium">Go to {title}</BaseText>
      <ChevronsRight className="h-4 w-4" />
    </div>
  </Link>
);

const HeroSection = () => {
  const [nextFixtures, setNextFixtures] = useState<Match[] | null>(null);
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [latestNews, setLatestNews] = useState<Article[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch data concurrently
      const [fixtures, league, news] = await Promise.all([
        fetchNextFixtures(3),
        fetchLeagueTableFromSupabase(),
        fetchLatestNews(3)
      ]);
      
      setNextFixtures(fixtures);
      setLeagueData(league);
      setLatestNews(news);
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
          <BaseText variant="body1" className="text-gray-700 max-w-3xl mx-auto">
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
