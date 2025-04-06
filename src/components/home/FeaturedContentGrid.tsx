
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface FeaturedContentItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link: string;
  type: 'news' | 'event' | 'promotion' | 'other';
}

interface FeaturedContentGridProps {
  items: FeaturedContentItem[];
}

export function FeaturedContentGrid({ items }: FeaturedContentGridProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="uppercase text-xs font-bold text-blue-600 mb-2">
                  {item.type}
                </div>
                <h3 className="text-xl font-bold leading-tight mb-2">
                  <Link to={item.link} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                {item.description && (
                  <p className="text-gray-600 line-clamp-2">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Add default export to fix import issue
export default FeaturedContentGrid;
