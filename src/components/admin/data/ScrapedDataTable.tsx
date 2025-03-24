
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TeamStats } from '@/components/league/types';
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";
import { fetchLeagueTableFromSupabase, getLastUpdateTime } from '@/services/supabase/leagueDataService';

const ScrapedDataTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadScrapedData();
  }, []);

  // Function to load data
  const loadScrapedData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeagueTableFromSupabase();
      setLeagueTable(data || []);
      
      // Get last updated time from Supabase
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error('Failed to load scraped data:', error);
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
    } catch (error) {
      console.error('Failed to export data:', error);
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
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Highland League Table Data</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            Displaying {leagueTable.length} teams from Supabase
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default">Supabase Data</Badge>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={loadScrapedData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground mb-4">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
        
        <div className="border rounded-md overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Pos</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="w-12">P</TableHead>
                <TableHead className="w-12">W</TableHead>
                <TableHead className="w-12">D</TableHead>
                <TableHead className="w-12">L</TableHead>
                <TableHead className="w-12">GF</TableHead>
                <TableHead className="w-12">GA</TableHead>
                <TableHead className="w-12">GD</TableHead>
                <TableHead className="w-12">Pts</TableHead>
                <TableHead className="w-24">Form</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagueTable.map((team, index) => (
                <TableRow key={index}>
                  <TableCell>{team.position}</TableCell>
                  <TableCell className="font-medium">{team.team}</TableCell>
                  <TableCell>{team.played}</TableCell>
                  <TableCell>{team.won}</TableCell>
                  <TableCell>{team.drawn}</TableCell>
                  <TableCell>{team.lost}</TableCell>
                  <TableCell>{team.goalsFor}</TableCell>
                  <TableCell>{team.goalsAgainst}</TableCell>
                  <TableCell>{team.goalDifference}</TableCell>
                  <TableCell className="font-bold">{team.points}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {team.form?.map((result, i) => (
                        <span 
                          key={i} 
                          className={`inline-block w-5 h-5 text-xs text-center leading-5 rounded-full
                            ${result === 'W' ? 'bg-green-500 text-white' : 
                              result === 'D' ? 'bg-yellow-500 text-white' : 
                              'bg-red-500 text-white'}`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {leagueTable.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">No data found. Try refreshing.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapedDataTable;
