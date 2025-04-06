
import React, { useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import EnhancedHero from '@/components/home/EnhancedHero';
import { FeaturedContentGrid } from '@/components/home/FeaturedContentGrid';
import MatchCenter from '@/components/home/MatchCenter';
import MediaGalleryPreview from '@/components/home/MediaGalleryPreview';
import FanEngagement from '@/components/home/FanEngagement';
import SponsorsSection from '@/components/home/SponsorsSection';
import { useNewsStore } from '@/services/news';
import { useFeaturedContent } from '@/hooks/useFeaturedContent';
import { motion } from 'framer-motion';

const Index = () => {
  const newsStore = useNewsStore();
  const { featuredArticle, nextMatch, leaguePosition, isLoading } = useFeaturedContent();
  
  // Get recent news
  useEffect(() => {
    if (newsStore.fetchRecentNews) {
      newsStore.fetchRecentNews();
    }
  }, [newsStore]);
  
  // Format featured content items
  const getFeaturedContentItems = () => {
    const items = [];
    
    // Add featured article if available
    if (featuredArticle) {
      items.push({
        id: featuredArticle.id,
        title: featuredArticle.title,
        description: featuredArticle.content ? featuredArticle.content.substring(0, 120) + '...' : '',
        image: featuredArticle.image_url,
        link: `/news/${featuredArticle.id}`,
        linkText: 'Read More',
        type: 'news',
        category: featuredArticle.category,
        date: featuredArticle.publish_date
      });
    }
    
    // Add next match if available
    if (nextMatch) {
      items.push({
        id: nextMatch.id,
        title: `${nextMatch.home_team} vs ${nextMatch.away_team}`,
        description: `${nextMatch.competition} match at ${nextMatch.venue}`,
        image: '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
        link: `/fixtures/${nextMatch.id}`,
        linkText: 'Match Details',
        type: 'fixture',
        category: 'Upcoming Match',
        date: nextMatch.date
      });
    }
    
    // Add league position if available
    if (leaguePosition) {
      items.push({
        id: 'league-position',
        title: 'Current League Position',
        description: `Banks o' Dee currently sit ${leaguePosition.position}${getOrdinalSuffix(leaguePosition.position)} in the table with ${leaguePosition.points} points from ${leaguePosition.played} games.`,
        image: '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
        link: '/table',
        linkText: 'View League Table',
        type: 'team',
        category: 'League Update'
      });
    }
    
    return items;
  };
  
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (i) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };

  // Define animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero />
      
      <div className="flex-grow">
        {/* Featured Content Grid - Animated */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <FeaturedContentGrid items={getFeaturedContentItems()} isLoading={isLoading} />
        </motion.section>
        
        {/* Match Center - Animated */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <MatchCenter />
        </motion.section>
        
        {/* Media Gallery Preview - Animated */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <MediaGalleryPreview />
        </motion.section>
        
        {/* Fan Engagement Section - Animated */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <FanEngagement />
        </motion.section>
        
        {/* Sponsors Section - Animated */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <SponsorsSection />
        </motion.section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
