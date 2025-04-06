
import { Match } from '@/components/fixtures/types';
import { format, parseISO } from 'date-fns';

/**
 * Format a match date into a readable format
 */
export const formatMatchDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE, d MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

/**
 * Check if a team in a match is Banks o' Dee
 */
export const isBanksODee = (teamName: string): boolean => {
  return teamName.toLowerCase().includes('banks o') || 
         teamName.toLowerCase().includes("banks o'") ||
         teamName.toLowerCase().includes('banks-o');
};

/**
 * Get the score as a string
 */
export const getScoreDisplay = (match: Match): string => {
  if (!match.isCompleted) {
    return 'vs';
  }
  
  if (match.homeScore !== undefined && match.awayScore !== undefined) {
    return `${match.homeScore} - ${match.awayScore}`;
  }
  
  return 'vs';
};
