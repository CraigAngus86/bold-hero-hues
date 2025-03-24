
import { useState, useMemo } from 'react';
import { Match, groupMatchesByMonth, getAvailableMonths } from '@/components/fixtures/types';

interface UseFixturesFilterProps {
  matches: Match[];
  competitions: string[];
}

interface UseFixturesFilterReturn {
  filteredMatches: Record<string, Match[]>;
  selectedCompetition: string;
  setSelectedCompetition: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  showPast: boolean;
  setShowPast: (value: boolean) => void;
  showUpcoming: boolean;
  setShowUpcoming: (value: boolean) => void;
  availableMonths: string[];
  clearFilters: () => void;
}

export const useFixturesFilter = ({ matches, competitions }: UseFixturesFilterProps): UseFixturesFilterReturn => {
  const [selectedCompetition, setSelectedCompetition] = useState("All Competitions");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [showPast, setShowPast] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  const availableMonths = useMemo(() => getAvailableMonths(matches), [matches]);
  
  const filteredMatches = useMemo(() => {
    // Get current date once for consistent comparison
    const today = new Date();
    
    const filtered = matches.filter(match => {
      const competitionMatch = selectedCompetition === "All Competitions" || match.competition === selectedCompetition;
      
      // Check both isCompleted flag and date for more consistent filtering
      const matchDate = new Date(match.date);
      const isPastMatch = match.isCompleted || matchDate < today;
      const isUpcomingMatch = !match.isCompleted && matchDate >= today;
      
      // Apply the filter based on user selection
      const timeframeMatch = (showPast && isPastMatch) || (showUpcoming && isUpcomingMatch);
      
      const matchMonth = matchDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const monthMatch = selectedMonth === "All Months" || matchMonth === selectedMonth;
      
      return competitionMatch && timeframeMatch && monthMatch;
    });
    
    return groupMatchesByMonth(filtered);
  }, [matches, selectedCompetition, selectedMonth, showPast, showUpcoming]);
  
  const clearFilters = () => {
    setSelectedCompetition("All Competitions");
    setSelectedMonth("All Months");
    setShowPast(true);
    setShowUpcoming(true);
  };
  
  return {
    filteredMatches,
    selectedCompetition,
    setSelectedCompetition,
    selectedMonth,
    setSelectedMonth,
    showPast,
    setShowPast,
    showUpcoming,
    setShowUpcoming,
    availableMonths,
    clearFilters
  };
};
