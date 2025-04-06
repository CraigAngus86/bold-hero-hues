
import { useState, useEffect } from 'react';
import { useFixturesData } from './useFixturesData';
import { Match } from '../types';

export const useFixturesDisplay = () => {
  const { leagueData, isLoading, upcomingMatches, recentResults } = useFixturesData();
  
  // Find the next match that has tickets available
  const nextMatchWithTickets = upcomingMatches.find(match => match.ticketLink);

  return {
    leagueData,
    isLoading,
    upcomingMatches,
    recentResults,
    nextMatchWithTickets
  };
};
