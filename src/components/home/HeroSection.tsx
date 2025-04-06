import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TeamStats } from '@/components/league/types';
import { fetchLeagueTable } from '@/services/leagueDataService';
import { toast } from "sonner";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Team {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  wins?: number;
  draws?: number;
  losses?: number;
  cleanSheets?: number;
}

const HeroSection = () => {
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadLeagueTable = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const teams = await fetchLeagueTable();
        setLeagueTable(teams.map(team => ({
          ...team,
          // Add compatibility fields
          wins: team.won,
          draws: team.drawn,
          losses: team.lost,
          cleanSheets: 0
        })));
        
        // Find Banks o' Dee's position
        const banksODee = teams.find(team => team.team === "Banks o' Dee");
        if (banksODee) {
          setLeaguePosition(banksODee.position);
        } else {
          // If Banks o' Dee is not found, set the first team in the table
          if (teams.length > 0) {
            setLeaguePosition(teams[0].position);
          } else {
            console.warn("Banks o' Dee not found in league table, and no teams available.");
            setError("Banks o' Dee not found in league table.");
          }
        }
      } catch (err: any) {
        console.error("Error loading league table:", err);
        setError(err.message || "Failed to load league table.");
        toast.error("Failed to load league table");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeagueTable();
  }, []);
  
  const setLeaguePosition = (position: number) => {
    // Find team with the given position
    const team = leagueTable.find(t => t.position === position);
    if (team) {
      // Convert TeamStats to format component expects
      setCurrentTeam({
        position: team.position,
        team: team.team,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.goalDifference,
        points: team.points,
        // Add compatibility fields if needed
        wins: team.won,
        draws: team.drawn,
        losses: team.lost,
        cleanSheets: 0
      });
    }
  };
  
  return (
    <section className="py-24 bg-team-gray">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">
            Welcome to Banks o' Dee FC
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your go-to source for the latest news, fixtures, results, and
            league standings for Banks o' Dee Football Club.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-team-blue mb-2">
              Highland League Table
            </h2>
            {isLoading ? (
              <p className="text-gray-500">Loading league data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : currentTeam ? (
              <>
                <p className="text-gray-600">
                  Position:{" "}
                  <span className="font-semibold">{currentTeam.position}</span>
                </p>
                <p className="text-gray-600">
                  Played: <span className="font-semibold">{currentTeam.played}</span>
                </p>
                <p className="text-gray-600">
                  Points: <span className="font-semibold">{currentTeam.points}</span>
                </p>
              </>
            ) : (
              <p className="text-gray-500">No league data available.</p>
            )}
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <Link
              to="/table"
              className="bg-team-blue text-white py-3 px-6 rounded-md hover:bg-team-navy transition-colors"
            >
              View Full Table
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
