
import React, { useEffect, useState } from 'react';
import FixturesSection from './FixturesSection';
import { supabase } from '@/services/supabase/supabaseClient';
import { formatDate, formatStandardDate } from '@/utils/date';

const FixturesSectionContainer: React.FC = () => {
  const [results, setResults] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [leagueTable, setLeagueTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent results - adjust this query based on your database structure
        const { data: resultsData, error: resultsError } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_completed', true)
          .order('date', { ascending: false })
          .limit(4);
          
        if (resultsError) throw resultsError;
        
        // Fetch upcoming fixtures
        const { data: fixturesData, error: fixturesError } = await supabase
          .from('fixtures')
          .select('*')
          .eq('is_completed', false)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(4);
          
        if (fixturesError) throw fixturesError;
        
        // Fetch league table
        const { data: tableData, error: tableError } = await supabase
          .from('highland_league_table')
          .select('*')
          .order('position', { ascending: true });
          
        if (tableError) throw tableError;
        
        // Transform the data to match the component's expected format
        const formattedResults = resultsData.map(item => ({
          date: formatStandardDate(item.date),
          competition: item.competition,
          venue: item.venue || 'TBD',
          homeTeam: item.home_team,
          awayTeam: item.away_team,
          homeScore: item.home_score || 0,
          awayScore: item.away_score || 0
        }));
        
        const formattedFixtures = fixturesData.map(item => ({
          date: formatStandardDate(item.date),
          time: item.time || '15:00',
          competition: item.competition,
          venue: item.venue || 'TBD',
          homeTeam: item.home_team,
          awayTeam: item.away_team
        }));
        
        const formattedTable = tableData.map(item => ({
          position: item.position,
          team: item.team,
          played: item.played,
          points: item.points,
          isBanksODee: item.team.includes('Banks o\' Dee')
        }));
        
        setResults(formattedResults);
        setFixtures(formattedFixtures);
        setLeagueTable(formattedTable);
      } catch (err) {
        console.error('Error fetching fixtures data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-800"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading fixtures data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FixturesSection 
      results={results}
      fixtures={fixtures}
      leagueTable={leagueTable}
    />
  );
};

export default FixturesSectionContainer;
