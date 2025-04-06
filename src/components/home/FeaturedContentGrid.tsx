
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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({ items = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 mb-8" />
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

  // Define category colors
  const getCategoryColor = (type: string) => {
    switch(type) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'fixture': return 'bg-green-100 text-green-800';
      case 'team': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-team-blue mb-8">Featured Content</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Featured Item - Larger Size */}
        <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
          <Card className="overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-white">
            <div className="relative w-full pt-[56.25%]">
              {featuredItem.image && (
                <img 
                  src={featuredItem.image} 
                  alt={featuredItem.title} 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              )}
              {featuredItem.category && (
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featuredItem.type)}`}>
                  {featuredItem.category}
                </span>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-2xl line-clamp-2">{featuredItem.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">{featuredItem.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <Link to={featuredItem.link}>
                <Button variant="default" className="bg-team-blue hover:bg-team-blue/90 text-white">
                  {featuredItem.linkText || 'Read More'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {featuredItem.date && (
                <span className="text-sm text-gray-500">{featuredItem.date}</span>
              )}
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Standard Items */}
        {standardItems.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white">
              <div className="relative w-full pt-[56.25%]">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                )}
                {item.category && (
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(item.type)}`}>
                    {item.category}
                  </span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Link to={item.link}>
                  <Button variant="outline" size="sm" className="border-team-blue text-team-blue hover:bg-team-lightBlue/20 hover:text-team-blue">
                    {item.linkText || 'View'} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
                {item.date && (
                  <span className="text-xs text-gray-500">{item.date}</span>
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
