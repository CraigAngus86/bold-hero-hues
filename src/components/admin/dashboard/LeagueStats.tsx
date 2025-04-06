
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useLeagueStats } from '@/hooks/useLeagueStats';

const LeagueStats: React.FC = () => {
  const { data, isLoading } = useLeagueStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">League Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { position, previousPosition, wins, draws, losses } = data || {
    position: null,
    previousPosition: null,
    wins: 0,
    draws: 0,
    losses: 0,
  };

  const getPositionChange = () => {
    if (position === null || previousPosition === null) return null;
    
    const diff = previousPosition - position;
    
    if (diff > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span className="text-xs">+{diff}</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span className="text-xs">{diff}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-muted-foreground">
          <Minus className="h-4 w-4 mr-1" />
          <span className="text-xs">0</span>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">League Position</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-2xl font-bold">
              {position === null ? '-' : `${position}${getOrdinalSuffix(position)}`}
            </span>
            <div className="ml-2">{getPositionChange()}</div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Wins</span>
              <span className="font-medium">{wins}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Draws</span>
              <span className="font-medium">{draws}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Losses</span>
              <span className="font-medium">{losses}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get the ordinal suffix for numbers
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export default LeagueStats;
