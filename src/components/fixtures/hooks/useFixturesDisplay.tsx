
import { useState, useEffect } from 'react';

// Define the TeamStats type that matches what LeagueTable expects
export interface TeamStats {
  id: number;
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
  form: ('W' | 'D' | 'L')[];
}

export const useFixturesDisplay = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for league table
  const leagueData: TeamStats[] = [
    {
      id: 1,
      position: 1,
      team: "Buckie Thistle",
      played: 12,
      won: 10,
      drawn: 1,
      lost: 1,
      goalsFor: 32,
      goalsAgainst: 8,
      goalDifference: 24,
      points: 31,
      form: ['W', 'W', 'W', 'D', 'W']
    },
    {
      id: 2,
      position: 2,
      team: "Brechin City",
      played: 12,
      won: 9,
      drawn: 2,
      lost: 1,
      goalsFor: 28,
      goalsAgainst: 9,
      goalDifference: 19,
      points: 29,
      form: ['W', 'D', 'W', 'W', 'L']
    },
    {
      id: 3,
      position: 3,
      team: "Banks o' Dee",
      played: 12,
      won: 8,
      drawn: 2,
      lost: 2,
      goalsFor: 24,
      goalsAgainst: 11,
      goalDifference: 13,
      points: 26,
      form: ['W', 'W', 'D', 'L', 'W']
    },
    {
      id: 4,
      position: 4,
      team: "Formartine United",
      played: 12,
      won: 7,
      drawn: 3,
      lost: 2,
      goalsFor: 21,
      goalsAgainst: 12,
      goalDifference: 9,
      points: 24,
      form: ['D', 'W', 'W', 'D', 'W']
    },
    {
      id: 5,
      position: 5,
      team: "Keith FC",
      played: 12,
      won: 6,
      drawn: 3,
      lost: 3,
      goalsFor: 18,
      goalsAgainst: 15,
      goalDifference: 3,
      points: 21,
      form: ['L', 'D', 'W', 'W', 'W']
    }
  ];
  
  return {
    leagueData,
    isLoading,
  };
};
