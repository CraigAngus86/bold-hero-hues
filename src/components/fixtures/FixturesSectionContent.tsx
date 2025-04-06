
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import FixturesList from "./FixturesList";
import { LeagueTable } from "@/components/league/LeagueTable";
import { useFixturesDisplay } from "./hooks/useFixturesDisplay";
import { Match } from './types';

interface FixturesSectionContentProps {
  maxFixtures?: number;
}

const FixturesSectionContent: React.FC<FixturesSectionContentProps> = ({ maxFixtures = 5 }) => {
  const { upcomingMatches, recentMatches, leagueData, isLoading } = useFixturesDisplay();

  if (isLoading) {
    return <div className="py-12 text-center">Loading fixtures data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Upcoming Fixtures</h3>
            <FixturesList 
              fixtures={upcomingMatches.slice(0, maxFixtures)} 
              emptyMessage="No upcoming fixtures" 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Results</h3>
            <FixturesList 
              fixtures={recentMatches.slice(0, maxFixtures)} 
              emptyMessage="No recent results"
              showScores={true}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">League Table</h3>
          <LeagueTable 
            teams={leagueData} 
            simplified={true} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FixturesSectionContent;
