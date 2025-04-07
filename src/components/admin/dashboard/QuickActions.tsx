import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Newspaper, Calendar, ImageIcon, Plus } from 'lucide-react';
import { getFansCount } from '@/services/fansDbService';
import { getNewsArticlesCount } from '@/services/newsDbService';
import { getFixturesCount } from '@/services/fixturesDbService';
import { getMediaCount } from '@/services/images/api';
import { StatusItemCard } from './StatusItems';

interface QuickActionItemProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ title, value, icon, color }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-full ${color}`}>{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-500">{value}</div>
        </div>
      </div>
    </div>
  );
};

const QuickActions: React.FC = () => {
  const [fansCount, setFansCount] = useState<number>(0);
  const [newsCount, setNewsCount] = useState<number>(0);
  const [fixturesCount, setFixturesCount] = useState<number>(0);
  const [mediaCount, setMediaCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fans = await getFansCount();
        setFansCount(fans.count);

        const news = await getNewsArticlesCount();
        setNewsCount(news.count);

        const fixtures = await getFixturesCount();
        setFixturesCount(fixtures.count);

        const media = await getMediaCount();
        setMediaCount(media.count || 0);
      } catch (error) {
        console.error('Error fetching quick actions data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionItem
              title="Fans"
              value={fansCount}
              icon={<Users className="h-4 w-4" />}
              color="text-blue-500 bg-blue-50"
            />
            <QuickActionItem
              title="News Articles"
              value={newsCount}
              icon={<Newspaper className="h-4 w-4" />}
              color="text-green-500 bg-green-50"
            />
            <QuickActionItem
              title="Fixtures"
              value={fixturesCount}
              icon={<Calendar className="h-4 w-4" />}
              color="text-amber-500 bg-amber-50"
            />
            <QuickActionItem
              title="Media Files"
              value={mediaCount}
              icon={<ImageIcon className="h-4 w-4" />}
              color="text-purple-500 bg-purple-50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
