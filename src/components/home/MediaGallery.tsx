
import React from 'react';
import { motion } from 'framer-motion';

const MediaGallery: React.FC = () => {
  // Updated gallery images with correctly formatted image paths
  const galleryImages = [
    {
      id: '1',
      src: '/lovable-uploads/a4a5a911-98e0-48ad-95dc-f7cb62d5af63.jpeg',
      caption: 'Junior section coaching session',
      category: 'Youth'
    },
    {
      id: '2',
      src: '/lovable-uploads/9ca9c466-2008-4fa8-8258-979a7b5ae9f8.jpeg',
      caption: 'Girls team in action',
      category: 'Youth'
    },
    {
      id: '3',
      src: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
      caption: 'U20s Scotland Cup match',
      category: 'Match Day'
    },
    {
      id: '4',
      src: '/lovable-uploads/4651b18c-bc2e-4e02-96ab-8993f8dfc145.png',
      caption: 'Youth section training',
      category: 'Youth'
    },
    {
      id: '5',
      src: '/lovable-uploads/74f0cf13-9569-4b38-a479-b24192aeb21f.jpeg',
      caption: 'Youth team group photo',
      category: 'Events'
    },
    {
      id: '6',
      src: '/lovable-uploads/8cc4f482-ddc3-4ec8-9bc0-95e302028272.jpeg',
      caption: 'Youth development session',
      category: 'Training'
    }
  ];

  return (
    <section className="bg-team-blue py-16 relative">
      <div className="absolute inset-0 bg-pattern-diagonal opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Media Gallery</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Explore our latest photos and videos from matches, events, and community activities.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden rounded-lg group aspect-square cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <img 
                src={image.src} 
                alt={image.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs font-semibold text-accent-500 mb-1">{image.category}</span>
                <p className="text-white font-medium text-sm">{image.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="/gallery" 
            className="inline-block bg-white text-team-blue font-medium px-6 py-3 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;
