import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users, Newspaper, Calendar, Image } from 'lucide-react';
import { getFansCount } from '@/services/fansDbService';
import { getNewsArticlesCount } from '@/services/newsDbService';
import { getFixturesCount } from '@/services/fixturesDbService';
import { getMediaCount } from '@/services/images/api';
import { StatusItemCard } from './StatusItems';

export default function QuickActions() {
  const [counts, setCounts] = useState({
    users: 0,
    articles: 0, 
    fixtures: 0,
    uploads: 0
  });

  const loadData = async () => {
    try {
      const users = await getFansCount();
      const articles = await getNewsArticlesCount();
      const fixtures = await getFixturesCount();
      const uploads = await getMediaCount();

      setCounts({
        users: users.count || 0,
        articles: articles.count || 0,
        fixtures: fixtures.count || 0,
        uploads: uploads.count || 0
      });
    } catch (error) {
      console.error("Error loading quick action counts:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quick Actions</h3>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusItemCard
          title="Users"
          value={counts.users}
          icon={<Users className="h-4 w-4 text-blue-500" />} 
          color="blue"
          lastUpdated="Now"
        />
        
        <StatusItemCard
          title="News Articles"
          value={counts.articles}
          icon={<Newspaper className="h-4 w-4 text-emerald-500" />}
          color="emerald"
          lastUpdated="Now"
        />
        
        <StatusItemCard
          title="Fixtures"
          value={counts.fixtures}
          icon={<Calendar className="h-4 w-4 text-violet-500" />}
          color="violet"
          lastUpdated="Now" 
        />
        
        <StatusItemCard
          title="Media Uploads"
          value={counts.uploads}
          icon={<Image className="h-4 w-4 text-amber-500" />}
          color="amber"
          lastUpdated="Now"
        />
      </div>
      
    </div>
  );
}
