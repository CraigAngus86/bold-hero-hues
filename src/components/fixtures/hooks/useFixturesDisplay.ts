
import { useEffect, useState } from 'react';
import { Fixture } from '@/types/fixtures';
import { useFixturesData } from '@/components/home/fixtures/useFixturesData';

export const useFixturesDisplay = () => {
  const { isLoading, upcomingFixtures, recentResults, nextMatch } = useFixturesData();
  
  // Map to component-specific props
  return {
    isLoading,
    upcomingMatches: upcomingFixtures,
    recentMatches: recentResults,
    nextMatch
  };
};
