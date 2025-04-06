
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export interface FeaturedContentItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  linkText?: string;
  type: 'news' | 'fixture' | 'team' | 'other';
  category?: string;
  date?: string;
}

export interface FeaturedContentGridProps {
  items: FeaturedContentItem[];
  isLoading?: boolean;
}

// Animation variants for items
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({ items = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 md:row-span-2">
            <Card className="overflow-hidden h-full">
              <Skeleton className="h-[400px] w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-36" />
              </CardFooter>
            </Card>
          </div>
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // If there are no items, return null or a placeholder
  if (!items || items.length === 0) {
    return null;
  }
  
  // Get the first item as featured
  const featuredItem = items[0];
  // Get the rest of the items
  const standardItems = items.slice(1);

  // Define category colors with more vibrant options
  const getCategoryColor = (type: string) => {
    switch(type) {
      case 'news': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'fixture': return 'bg-green-100 text-green-800 border border-green-200';
      case 'team': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-team-accent/5 rounded-full -translate-x-20 -translate-y-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-team-blue/5 rounded-full translate-x-10 translate-y-20 blur-3xl"></div>
      
      <h2 className="text-3xl font-bold text-team-blue mb-8 relative">
        <span className="relative inline-block">
          Featured Content
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-team-accent transform origin-left"></span>
        </span>
      </h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Featured Item - Larger Size with overlapping elements */}
        <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 relative">
          <Card className="overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl bg-white border-0 rounded-xl shadow-lg">
            <div className="relative w-full pt-[56.25%]">
              {featuredItem.image && (
                <img 
                  src={featuredItem.image} 
                  alt={featuredItem.title} 
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              )}
              {featuredItem.category && (
                <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md ${getCategoryColor(featuredItem.type)}`}>
                  {featuredItem.category}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>
            <CardHeader className="relative -mt-20 z-10">
              <CardTitle className="text-3xl font-bold text-white line-clamp-2 drop-shadow-md">{featuredItem.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2 text-gray-200">{featuredItem.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center pt-0 pb-6 px-6">
              <Link to={featuredItem.link}>
                <Button variant="default" className="bg-team-blue hover:bg-team-blue/90 text-white transform transition-all duration-300 hover:translate-y-[-2px] shadow-md hover:shadow-lg">
                  {featuredItem.linkText || 'Read More'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {featuredItem.date && (
                <span className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded font-medium">{featuredItem.date}</span>
              )}
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Standard Items - Improved card design */}
        {standardItems.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white border-0 rounded-xl shadow">
              <div className="relative w-full pt-[56.25%]">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
                {item.category && (
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getCategoryColor(item.type)}`}>
                    {item.category}
                  </span>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-team-blue transition-colors duration-300">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-gray-600">{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center pt-0">
                <Link to={item.link}>
                  <Button variant="outline" size="sm" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white transition-all duration-300">
                    {item.linkText || 'View'} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
                {item.date && (
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{item.date}</span>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedContentGrid;
