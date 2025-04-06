
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMediaGallery } from '@/hooks/useMediaGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Play } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const MediaGalleryPreview: React.FC = () => {
  const { items, isLoading } = useMediaGallery(9, true);
  const controls = useAnimation();

  useEffect(() => {
    if (!isLoading && items.length > 0) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
      }));
    }
  }, [isLoading, items, controls]);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-80 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-team-blue">Media Gallery</h2>
          <Link to="/media">
            <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue/10">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              className="aspect-square relative overflow-hidden rounded-md group"
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Link to={`/media/${item.id}`}>
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  {item.media_type === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="text-team-blue w-6 h-6" />
                    </div>
                  ) : (
                    <span className="text-white font-medium">{item.title}</span>
                  )}
                </div>
                <img 
                  src={item.thumbnail_url || item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {item.media_type === 'video' && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded text-xs">
                    VIDEO
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Instagram-style Fan Content Section */}
        {items.length > 6 && (
          <Card className="mt-8 overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-orange-500 pb-3">
              <CardTitle className="text-white flex items-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85,0,3.2,0,3.58-.07,4.85-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07-3.2,0-3.58,0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85,0-3.2,0-3.58.07-4.85C2.33,3.92,3.84,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12S0,15.67.07,17c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.43,1.44A1.44,1.44,0,0,0,18.41,4.15Z"
                  />
                </svg>
                Fan Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-3 gap-1">
                {items.slice(6, 9).map((item) => (
                  <div key={item.id} className="aspect-square overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center bg-gradient-to-r from-pink-500/10 to-orange-500/10 py-3">
              <Link to="/fan-content">
                <Button variant="ghost" size="sm" className="text-pink-600">
                  See More Fan Content
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MediaGalleryPreview;
