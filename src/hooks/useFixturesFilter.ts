
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
  const [showPast, setShowPast] = useState<boolean>(true);
  const [showUpcoming, setShowUpcoming] = useState<boolean>(true);
  
  // Get unique competitions
  const competitions = useMemo(() => {
    const uniqueCompetitions = new Set<string>(allMatches.map(match => match.competition));
    return ['All Competitions', ...Array.from(uniqueCompetitions)];
  }, [allMatches]);
  
  // Get available months
  const availableMonths = useMemo(() => {
    const months = getAvailableMonths(allMatches);
    return ['All Months', ...months];
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
    
    // Filter by past/upcoming
    const now = new Date();
    if (!showPast) {
      result = result.filter(match => new Date(match.date) >= now);
    }
    if (!showUpcoming) {
      result = result.filter(match => new Date(match.date) < now);
    }
    
    return result;
  }, [allMatches, selectedCompetition, selectedMonth, showPast, showUpcoming]);
  
  // Group matches by month
  const groupedMatches = useMemo((): MatchGroup[] => {
    return groupMatchesByMonth(filteredMatches);
  }, [filteredMatches]);

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedCompetition('All Competitions');
    setSelectedMonth('All Months');
    setShowPast(true);
    setShowUpcoming(true);
  };
  
  return {
    competitions,
    months: availableMonths,
    selectedCompetition,
    selectedMonth,
    setSelectedCompetition,
    setSelectedMonth,
    filteredMatches,
    groupedMatches,
    showPast,
    setShowPast,
    showUpcoming,
    setShowUpcoming,
    availableMonths,
    clearFilters
  };
};

export default useFixturesFilter;
