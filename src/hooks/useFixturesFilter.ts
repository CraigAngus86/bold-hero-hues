
import { useState, useMemo } from 'react';
import { Match, groupMatchesByMonth, getAvailableMonths, MatchGroup } from '@/components/fixtures/types';

interface UseFixturesFilterProps {
  allMatches: Match[];
  initialCompetition?: string;
  initialMonth?: string;
}

export const useFixturesFilter = ({
  allMatches, 
  initialCompetition = 'All Competitions', 
  initialMonth = 'All Months'
}: UseFixturesFilterProps) => {
  const [selectedCompetition, setSelectedCompetition] = useState<string>(initialCompetition);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  
  // Get unique competitions
  const competitions = useMemo(() => {
    const uniqueCompetitions = new Set<string>(allMatches.map(match => match.competition));
    return ['All Competitions', ...Array.from(uniqueCompetitions)];
  }, [allMatches]);
  
  // Get available months
  const months = useMemo(() => {
    const availableMonths = getAvailableMonths(allMatches);
    return ['All Months', ...availableMonths];
  }, [allMatches]);

  // Filter matches based on selected filters
  const filteredMatches = useMemo(() => {
    let result = [...allMatches];
    
    // Filter by competition
    if (selectedCompetition !== 'All Competitions') {
      result = result.filter(match => match.competition === selectedCompetition);
    }
    
    // Filter by month
    if (selectedMonth !== 'All Months') {
      result = result.filter(match => {
        const date = new Date(match.date);
        const monthYear = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
        return monthYear === selectedMonth;
      });
    }
    
    return result;
  }, [allMatches, selectedCompetition, selectedMonth]);
  
  // Group matches by month
  const groupedMatches = useMemo((): MatchGroup[] => {
    return groupMatchesByMonth(filteredMatches);
  }, [filteredMatches]);
  
  return {
    competitions,
    months,
    selectedCompetition,
    selectedMonth,
    setSelectedCompetition,
    setSelectedMonth,
    filteredMatches,
    groupedMatches
  };
};

export default useFixturesFilter;
