
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Film, Folder } from 'lucide-react';
import { useMediaStats } from '@/hooks/useMediaStats';

const MediaStats: React.FC = () => {
  const { data, isLoading } = useMediaStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Media Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { total, photos, videos, albums } = data || { 
    total: 0, photos: 0, videos: 0, albums: 0 
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Media Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Image className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{total}</span>
            <span className="ml-2 text-sm text-muted-foreground">Total Items</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Photos</span>
              <div className="flex items-center justify-center">
                <Image className="h-3 w-3 mr-1 text-blue-400" />
                <span className="font-medium">{photos}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Videos</span>
              <div className="flex items-center justify-center">
                <Film className="h-3 w-3 mr-1 text-red-400" />
                <span className="font-medium">{videos}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Albums</span>
              <div className="flex items-center justify-center">
                <Folder className="h-3 w-3 mr-1 text-amber-400" />
                <span className="font-medium">{albums}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaStats;
