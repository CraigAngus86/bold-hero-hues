
import React from 'react';
import { FileText, Calendar, Trophy, Image } from 'lucide-react';
import { StatCard } from '@/components/admin/common/StatCard';
import { getOrdinalSuffix } from '@/lib/utils';

interface DashboardStatsProps {
  newsStats: {
    total: number;
    published: number;
    drafts: number;
  } | undefined;
  fixturesStats: {
    upcoming: number;
    nextMatch?: {
      opponent: string;
      date: string;
    };
  } | undefined;
  leagueStats: {
    position: number | null;
    previousPosition: number | null;
    wins: number;
    draws: number;
    losses: number;
  } | undefined;
  mediaStats: {
    total: number;
    photos: number;
    videos: number;
    albums: number;
  } | undefined;
  isNewsStatsLoading: boolean;
  isFixturesStatsLoading: boolean;
  isLeagueStatsLoading: boolean;
  isMediaStatsLoading: boolean;
  refetchNews: () => void;
  refetchFixtures: () => void;
  refetchLeague: () => void;
  refetchMedia: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  newsStats,
  fixturesStats,
  leagueStats,
  mediaStats,
  isNewsStatsLoading,
  isFixturesStatsLoading,
  isLeagueStatsLoading,
  isMediaStatsLoading,
  refetchNews,
  refetchFixtures,
  refetchLeague,
  refetchMedia
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="News Articles" 
        value={newsStats?.total || '0'} 
        icon={<FileText className="h-4 w-4" />} 
        trend={newsStats?.drafts ? { 
          direction: 'up', 
          value: `+${newsStats?.drafts}`, 
          label: 'drafts' 
        } : undefined}
        description={newsStats ? `${newsStats.published} published, ${newsStats.drafts} drafts` : 'Loading...'}
        isLoading={isNewsStatsLoading}
        onRefresh={() => refetchNews()}
        lastUpdated={isNewsStatsLoading ? null : new Date()}
        variant="primary"
      />
      
      <StatCard 
        title="Upcoming Fixtures" 
        value={fixturesStats?.upcoming || '0'} 
        icon={<Calendar className="h-4 w-4" />}
        description={fixturesStats?.nextMatch 
          ? `Next: ${fixturesStats.nextMatch.opponent}`
          : 'No upcoming fixtures'
        }
        isLoading={isFixturesStatsLoading}
        onRefresh={() => refetchFixtures()}
        lastUpdated={isFixturesStatsLoading ? null : new Date()}
        variant="secondary"
      />
      
      <StatCard 
        title="League Position" 
        value={leagueStats?.position ? `${leagueStats.position}${getOrdinalSuffix(leagueStats.position)}` : 'N/A'} 
        icon={<Trophy className="h-4 w-4" />}
        trend={leagueStats?.previousPosition && leagueStats?.position ? { 
          direction: leagueStats.position < leagueStats.previousPosition ? 'up' : 'down', 
          value: leagueStats.position < leagueStats.previousPosition 
            ? `+${leagueStats.previousPosition - leagueStats.position} places` 
            : `-${leagueStats.position - leagueStats.previousPosition} places` 
        } : undefined}
        description={leagueStats 
          ? `${leagueStats.wins} wins, ${leagueStats.draws} draws, ${leagueStats.losses} losses` 
          : 'Loading...'
        }
        isLoading={isLeagueStatsLoading}
        onRefresh={() => refetchLeague()}
        lastUpdated={isLeagueStatsLoading ? null : new Date()}
        variant="accent"
      />
      
      <StatCard 
        title="Media Items" 
        value={mediaStats?.total || '0'} 
        icon={<Image className="h-4 w-4" />}
        description={mediaStats 
          ? `${mediaStats.photos} photos, ${mediaStats.videos} videos, ${mediaStats.albums} albums` 
          : 'Loading...'
        }
        isLoading={isMediaStatsLoading}
        onRefresh={() => refetchMedia()}
        lastUpdated={isMediaStatsLoading ? null : new Date()}
      />
    </div>
  );
};

export default DashboardStats;
