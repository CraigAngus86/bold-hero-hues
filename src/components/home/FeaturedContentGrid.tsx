
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Update only the portion with array.map error
const renderTags = (tags: string[] | string | null | undefined) => {
  if (!tags) return null;
  
  // Convert string to array if needed
  const tagsArray = Array.isArray(tags) ? tags : 
    (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tagsArray.map((tag, i) => (
        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          {tag}
        </Badge>
      ))}
    </div>
  );
};
