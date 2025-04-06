
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface FeaturedContentItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  linkText?: string;
  type: 'news' | 'fixture' | 'team' | 'other';
}

export interface FeaturedContentGridProps {
  items: FeaturedContentItem[];
  isLoading?: boolean;
}

export const FeaturedContentGrid: React.FC<FeaturedContentGridProps> = ({ items = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-team-blue mb-6">Featured Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image && (
              <div className="relative w-full h-48">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to={item.link}>
                <Button variant="outline">
                  {item.linkText || 'Learn More'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedContentGrid;
