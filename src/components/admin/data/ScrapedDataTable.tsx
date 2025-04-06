
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchLeagueTableFromSupabase, getLastUpdateTime, triggerLeagueDataScrape } from '@/services/supabase/leagueDataService';
import { TeamStats } from '@/types/fixtures';
import DataActions from './table-components/DataActions';
import DataWarningAlert from './table-components/DataWarningAlert';
import LastUpdatedInfo from './table-components/LastUpdatedInfo';
import LeagueDataTable from './table-components/LeagueDataTable';

/**
 * Component for displaying and managing scraped league data
 */
const ScrapedDataTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasInvalidData, setHasInvalidData] = useState<boolean>(false);

  // Load data on component mount
  useEffect(() => {
    loadScrapedData();
  }, []);

  // Function to check for data validity
  const validateData = (data: any[]): boolean => {
    // Check for numeric team names or other invalid data
    const invalidTeams = data.filter(team => {
      // Check if team name is missing, numeric, or very short
      return !team.team || !isNaN(Number(team.team)) || team.team.length <= 2;
    });

    if (invalidTeams.length > 0) {
      setHasInvalidData(true);
      console.error('Invalid team data detected:', invalidTeams);
      return false;
    }

    setHasInvalidData(false);
    return true;
  };

  // Function to load data
  const loadScrapedData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeagueTableFromSupabase();
      // Ensure consistent types
      const typedData: TeamStats[] = data ? data.map(item => ({
        id: String(item.id || ''),
        position: item.position,
        team: item.team,
        played: item.played,
        won: item.won,
        drawn: item.drawn,
        lost: item.lost,
        goalsFor: item.goalsFor,
        goalsAgainst: item.goalsAgainst,
        goalDifference: item.goalDifference,
        points: item.points,
        form: item.form || '',
        logo: item.logo || '',
        last_updated: item.last_updated
      })) : [];
      
      setLeagueTable(typedData);
      
      // Validate the data
      validateData(data || []);
      
      // Get last updated time from Supabase
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error('Failed to load scraped data:', error);
      toast.error('Failed to load league table data');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to trigger a fresh scrape
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      toast.info('Refreshing league table data...', { duration: 5000 });
      const data = await triggerLeagueDataScrape();
      
      // Ensure consistent types
      const typedData: TeamStats[] = data ? data.map(item => ({
        id: String(item.id || ''),
        position: item.position,
        team: item.team,
        played: item.played,
        won: item.won,
        drawn: item.drawn,
        lost: item.lost,
        goalsFor: item.goalsFor,
        goalsAgainst: item.goalsAgainst,
        goalDifference: item.goalDifference,
        points: item.points,
        form: item.form || '',
        logo: item.logo || '',
        last_updated: item.last_updated
      })) : [];
      
      setLeagueTable(typedData);
      
      // Validate the data
      const isValid = validateData(data || []);
      if (!isValid) {
        toast.warning('Some team names may be invalid. Check the data.');
      } else {
        toast.success('Data refreshed successfully');
      }
      
      // Update last scrape time
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh league table data');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export data
  const handleExport = () => {
    try {
      const jsonData = JSON.stringify(leagueTable, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary <a> element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `highland-league-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Loading Scraped Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 border-team-blue/10 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-team-blue/10 to-gray-50 rounded-t-xl border-b">
        <div>
          <CardTitle className="text-team-blue text-xl">Highland League Table Data</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            Displaying {leagueTable.length} teams from Supabase
          </div>
        </div>
        
        <DataActions 
          onExport={handleExport} 
          onRefresh={handleRefreshData}
        />
      </CardHeader>
      <CardContent className="p-6">
        <LastUpdatedInfo lastUpdated={lastUpdated} />
        
        {hasInvalidData && <DataWarningAlert />}
        
        <LeagueDataTable 
          leagueTable={leagueTable}
        />
      </CardContent>
    </Card>
  );
};

export default ScrapedDataTable;
