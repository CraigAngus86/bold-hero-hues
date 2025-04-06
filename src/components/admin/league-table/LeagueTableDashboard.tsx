
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { TeamStats } from '@/components/league/types';
import { fetchLeagueTableFromSupabase, getLastUpdateTime, triggerLeagueDataScrape } from '@/services/supabase/leagueDataService';
import LeagueTableView from './LeagueTableView';
import TableControlsBar from './TableControlsBar';
import LastUpdateInfo from './LastUpdateInfo';

const LeagueTableDashboard = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [filteredData, setFilteredData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>("full");
  const [hasDataIssues, setHasDataIssues] = useState<boolean>(false);
  
  // Function to load the league data
  const loadLeagueData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch from Supabase
      const data = await fetchLeagueTableFromSupabase();
      
      // Sort by position
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setLeagueData(sortedData);
      setFilteredData(sortedData);
      
      // Check for data issues
      validateData(sortedData);
      
      // Get last updated time from Supabase
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error('Error loading league data:', error);
      toast.error('Failed to load league table data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to validate the data
  const validateData = (data: TeamStats[]) => {
    // Check for various data issues
    const hasIssues = data.some(team => {
      // Check for invalid team names or positions
      return !team.team || 
             team.position <= 0 ||
             team.played < 0 ||
             team.won + team.drawn + team.lost !== team.played ||
             team.points !== (team.won * 3 + team.drawn);
    });
    
    setHasDataIssues(hasIssues);
  };
  
  // Function to trigger a manual refresh from the BBC source
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      toast.info('Refreshing league table data from source...');
      
      // Call the Supabase edge function to scrape fresh data
      const data = await triggerLeagueDataScrape(true);
      
      // Sort by position
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setLeagueData(sortedData);
      setFilteredData(sortedData);
      
      // Check for data issues
      validateData(sortedData);
      
      // Update last updated time
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
      
      toast.success('League table refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh league table data');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Function to filter data based on view mode
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    
    switch (mode) {
      case "top-half":
        setFilteredData(leagueData.slice(0, Math.ceil(leagueData.length / 2)));
        break;
      case "bottom-half":
        setFilteredData(leagueData.slice(Math.ceil(leagueData.length / 2)));
        break;
      case "promotion":
        setFilteredData(leagueData.slice(0, 3));
        break;
      case "relegation":
        setFilteredData(leagueData.slice(-3));
        break;
      default:
        setFilteredData(leagueData);
        break;
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    loadLeagueData();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-team-blue">
            Highland League Table
          </CardTitle>
          
          <Button 
            onClick={handleRefreshData} 
            variant="default" 
            className="bg-team-blue hover:bg-team-navy"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh from BBC'}
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Last updated info */}
          <LastUpdateInfo lastUpdated={lastUpdated} />
          
          {/* Data issues warning */}
          {hasDataIssues && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Data Issues Detected</AlertTitle>
              <AlertDescription>
                There appear to be inconsistencies in the league table data. Consider refreshing from the source or checking for errors.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Table controls */}
          <TableControlsBar 
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
          
          {/* League table display */}
          <LeagueTableView 
            leagueData={filteredData} 
            isLoading={isLoading} 
            highlightTeam="Banks o' Dee"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueTableDashboard;
