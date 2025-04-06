
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMediaGallery } from '@/hooks/useMediaGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Play, Image, Video, Instagram } from 'lucide-react';
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
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
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

  // Masonry-style layout with different sized images
  const getSpanClass = (index: number) => {
    if (index === 0) return "md:col-span-2 md:row-span-2";
    if (index === 3) return "md:col-span-2";
    return "";
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image className="w-6 h-6 text-team-blue mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Media Gallery</h2>
          </div>
          <Link to="/media">
            <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white transition-colors duration-300">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Main Media Grid - Masonry style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8">
          {items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative overflow-hidden rounded-lg shadow-md group ${getSpanClass(index)}`}
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Link to={`/media/${item.id}`} className="block aspect-square w-full h-full">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center">
                    {item.media_type === 'video' ? (
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-2 shadow-lg">
                        <Play className="text-team-blue w-8 h-8 ml-1" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-2 shadow-lg">
                        <Image className="text-team-blue w-8 h-8" />
                      </div>
                    )}
                    <span className="text-white font-medium px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm text-sm max-w-[80%] truncate">{item.title}</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={item.thumbnail_url || item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {item.media_type === 'video' && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs flex items-center shadow-md">
                    <Video className="w-3 h-3 mr-1" />
                    VIDEO
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Instagram-style Fan Content Section with improvements */}
        {items.length > 6 && (
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-orange-500 pb-3 flex flex-row items-center">
              <CardTitle className="text-white flex items-center">
                <Instagram className="w-5 h-5 mr-2" />
                Fan Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-gradient-to-r from-pink-50 to-orange-50">
              <div className="grid grid-cols-3 gap-0.5 p-0.5">
                {items.slice(6, 9).map((item) => (
                  <Link to={`/fan-content/${item.id}`} key={item.id} className="relative aspect-square overflow-hidden group">
                    <img 
                      src={item.image_url} 
                      alt={item.title || 'Fan photo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white truncate">{item.title || 'Fan photo'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center bg-gradient-to-r from-pink-50 to-orange-50 py-3 border-t border-pink-100">
              <Link to="/fan-content">
                <Button variant="ghost" size="sm" className="text-pink-600 hover:bg-pink-100">
                  View Fan Gallery <ArrowRight className="w-3 h-3 ml-1" />
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
