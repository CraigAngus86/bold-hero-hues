
import React from 'react';
import { Navbar, Footer } from '@/components/layout';
import Hero from '@/components/home/Hero';
import FeaturedContentGrid from '@/components/home/FeaturedContentGrid';
import MatchCenter from '@/components/home/MatchCenter';
import MediaGalleryPreview from '@/components/home/MediaGalleryPreview';
import FanEngagement from '@/components/home/FanEngagement';
import SponsorsSection from '@/components/home/SponsorsSection';
import ShopPreview from '@/components/home/ShopPreview';
import { useNewsStore } from '@/services/news';
import { useFeaturedContent } from '@/hooks/useFeaturedContent';
import { motion } from 'framer-motion';

const Home = () => {
  const newsStore = useNewsStore();
  const { featuredArticle, nextMatch, leaguePosition, isLoading } = useFeaturedContent();
  
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with Dynamic Slider, Match Countdown and Latest Result */}
      <Hero />
      
      <div className="flex-grow">
        {/* Featured Content Grid - Row 1 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <FeaturedContentGrid 
            featuredArticle={featuredArticle}
            nextMatch={nextMatch}
            leaguePosition={leaguePosition}
            isLoading={isLoading}
          />
        </motion.section>
        
        {/* Match Center - Row 4 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <MatchCenter />
        </motion.section>
        
        {/* Media Gallery Preview - Row 2 partial */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <MediaGalleryPreview />
        </motion.section>
        
        {/* Fan Engagement Section - Row 3 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <FanEngagement />
        </motion.section>
        
        {/* Shop Preview - Row 5 */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <ShopPreview />
        </motion.section>
        
        {/* Sponsors Section - Row 6 */}
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

export default Home;
