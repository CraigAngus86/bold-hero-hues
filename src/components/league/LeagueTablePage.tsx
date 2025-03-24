
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import LeagueTableContent from './LeagueTableContent';
import LeagueStatsPanel from './LeagueStatsPanel';
import LeagueInfoPanel from './LeagueInfoPanel';
import { TeamStats } from './types';
import { fetchLeagueTable, clearLeagueDataCache } from '@/services/leagueDataService';
import { fetchLeagueTableFromSupabase, getLastUpdateTime } from '@/services/supabase/leagueDataService';
import { Database, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/services/supabase/supabaseClient';

const LeagueTablePage = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSeason, setDataSeason] = useState<string>("2024-2025");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("legacy");
  const [supabaseEnabled, setSupabaseEnabled] = useState<boolean>(!!supabase);
  
  const loadLeagueData = async (refresh = false) => {
    try {
      if (refresh) {
        // Clear the cache if refreshing
        clearLeagueDataCache();
      } else {
        setIsLoading(true);
      }
      
      // Try to fetch from Supabase if enabled
      if (supabaseEnabled) {
        try {
          const data = await fetchLeagueTableFromSupabase();
          
          // Sort by position
          const sortedData = [...data].sort((a, b) => a.position - b.position);
          setLeagueData(sortedData);
          setDataSource("supabase");
          
          // Get last updated time from Supabase
          const lastUpdate = await getLastUpdateTime();
          if (lastUpdate) {
            setLastUpdated(new Date(lastUpdate).toLocaleString());
          } else {
            setLastUpdated(new Date().toLocaleString());
          }
          
          if (refresh) {
            toast.success("League table refreshed from Supabase");
          }
          
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error loading from Supabase, falling back to legacy data:', error);
          // Fall back to legacy data service
        }
      }
      
      // Fallback: Fetch using the legacy data service
      const data = await fetchLeagueTable();
      
      // Sort by position
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setLeagueData(sortedData);
      setDataSource("legacy");
      
      // Set last updated timestamp
      setLastUpdated(new Date().toLocaleString());
      
      if (refresh) {
        toast.success("League table refreshed using legacy data");
      }
    } catch (error) {
      console.error('Error loading league data:', error);
      toast.error('Failed to load league table data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadLeagueData();
    
    // Set up auto-refresh every 30 minutes (1800000 ms)
    const autoRefreshInterval = setInterval(() => {
      console.log('Auto-refreshing league table data');
      loadLeagueData(true);
    }, 1800000);
    
    // Clean up interval on component unmount
    return () => clearInterval(autoRefreshInterval);
  }, []);
  
  return (
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Highland League Table</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Current standings for the {dataSeason} Scottish Highland Football League.
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Data last updated: {lastUpdated}
          </p>
        )}
      </motion.div>
      
      {!supabaseEnabled && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle className="text-amber-800">Supabase Connection Issue</AlertTitle>
          <AlertDescription className="text-amber-700">
            Could not connect to Supabase. Using fallback data source. Please check if your Supabase connection is properly configured.
          </AlertDescription>
        </Alert>
      )}
      
      {dataSource === "supabase" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Database className="h-4 w-4 text-green-800" />
          <AlertTitle className="text-green-800">Live Data</AlertTitle>
          <AlertDescription className="text-green-700">
            This table is populated with real-time data scraped from the BBC Sport website and stored in Supabase.
          </AlertDescription>
        </Alert>
      )}
      
      {/* League Stats Summary */}
      <LeagueStatsPanel leagueData={leagueData} season={dataSeason} />
      
      {/* Main League Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-10"
      >
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-team-blue mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading league table...</p>
          </div>
        ) : (
          <LeagueTableContent leagueData={leagueData} />
        )}
      </motion.div>
      
      {/* League Information */}
      <LeagueInfoPanel currentSeason={dataSeason} />
    </div>
  );
};

export default LeagueTablePage;
