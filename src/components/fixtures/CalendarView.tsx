
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Grid, List, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths, isToday, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Match } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarViewProps {
  matches: Match[];
  isLoading?: boolean;
  onFilterChange?: (dateRange: DateRange | undefined) => void;
}

type ViewMode = 'month' | 'week' | 'list';

export function CalendarView({ matches, isLoading = false, onFilterChange }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Get competition colors for the fixtures
  const getCompetitionColor = (competition: string): string => {
    const competitionColors: Record<string, string> = {
      'Highland League': 'bg-blue-100 text-blue-800',
      'Scottish Cup': 'bg-red-100 text-red-800',
      'Highland League Cup': 'bg-green-100 text-green-800',
      'Friendly': 'bg-gray-100 text-gray-800',
    };
    
    return competitionColors[competition] || 'bg-purple-100 text-purple-800';
  };

  // Handle navigation between months
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Handle date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (onFilterChange) {
      onFilterChange(range);
    }
  };

  // Get days in the current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Filter matches for the current month
  const matchesInView = matches.filter(match => {
    const matchDate = new Date(match.date);
    return isSameMonth(matchDate, currentDate);
  });

  // Get matches for a specific day
  const getMatchesForDay = (day: Date) => {
    return matches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate.toDateString() === day.toDateString();
    });
  };

  // Check if there's a match result and determine outcome (for Banks o' Dee)
  const getMatchOutcome = (match: Match) => {
    if (!match.isCompleted || match.homeScore === undefined || match.awayScore === undefined) {
      return null;
    }

    const isBanksODeeHome = match.homeTeam === "Banks o' Dee";
    const banksScore = isBanksODeeHome ? match.homeScore : match.awayScore;
    const opponentScore = isBanksODeeHome ? match.awayScore : match.homeScore;

    if (banksScore > opponentScore) return 'win';
    if (banksScore < opponentScore) return 'loss';
    return 'draw';
  };

  // Render a day cell in the calendar
  const renderDay = (day: Date) => {
    const matchesOnDay = getMatchesForDay(day);
    const isCurrentMonth = isSameMonth(day, currentDate);
    
    return (
      <div 
        key={day.toISOString()} 
        className={cn(
          "min-h-24 p-1 border border-gray-200",
          !isCurrentMonth && "bg-gray-50",
          isToday(day) && "bg-blue-50 border-blue-200"
        )}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={cn(
            "inline-flex items-center justify-center w-6 h-6 text-sm font-medium",
            isToday(day) && "bg-blue-500 text-white rounded-full"
          )}>
            {format(day, 'd')}
          </span>
          {matchesOnDay.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {matchesOnDay.length} {matchesOnDay.length === 1 ? 'match' : 'matches'}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {matchesOnDay.map((match, idx) => {
            const outcome = getMatchOutcome(match);
            
            return (
              <div 
                key={match.id || idx} 
                className={cn(
                  "text-xs p-1 rounded border-l-2",
                  getCompetitionColor(match.competition),
                  outcome === 'win' && "border-l-green-500",
                  outcome === 'loss' && "border-l-red-500",
                  outcome === 'draw' && "border-l-yellow-500",
                  !outcome && "border-l-gray-300"
                )}
              >
                <div className="font-medium">{match.time || '15:00'}</div>
                <div className="truncate">{match.homeTeam} vs {match.awayTeam}</div>
                {match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined && (
                  <div className="font-bold">{match.homeScore} - {match.awayScore}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Render matches in list view
  const renderListView = () => {
    const matchesInCurrentMonth = matchesInView.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (matchesInCurrentMonth.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches in this period</p>
        </div>
      );
    }

    // Group matches by date
    const matchesByDate: Record<string, Match[]> = {};
    matchesInCurrentMonth.forEach(match => {
      const dateKey = match.date;
      if (!matchesByDate[dateKey]) {
        matchesByDate[dateKey] = [];
      }
      matchesByDate[dateKey].push(match);
    });

    return (
      <div className="space-y-4">
        {Object.entries(matchesByDate).map(([dateKey, matches]) => (
          <Card key={dateKey}>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">
                {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.map((match, idx) => {
                  const outcome = getMatchOutcome(match);
                  
                  return (
                    <div 
                      key={match.id || `${dateKey}-${idx}`} 
                      className={cn(
                        "p-3 rounded-md border-l-4",
                        outcome === 'win' && "border-l-green-500",
                        outcome === 'loss' && "border-l-red-500",
                        outcome === 'draw' && "border-l-yellow-500",
                        !outcome && "border-l-gray-300"
                      )}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{match.time || '15:00'}</div>
                        <Badge className={getCompetitionColor(match.competition)}>
                          {match.competition}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-semibold">{match.homeTeam}</div>
                        {match.isCompleted ? (
                          <div className="text-lg font-bold mx-2">
                            {match.homeScore} - {match.awayScore}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mx-2">vs</div>
                        )}
                        <div className="font-semibold">{match.awayTeam}</div>
                      </div>
                      
                      {match.venue && (
                        <div className="text-sm text-gray-500 mt-1">
                          Venue: {match.venue}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-medium px-2">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <Tabs defaultValue="month" value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="month" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Month
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                Week
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DatePickerWithRange 
            date={dateRange}
            onDateChange={handleDateRangeChange}
            className="w-[240px]"
            placeholder="Filter by date range"
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-2 sm:p-4">
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-px">
              {/* Render week day headers */}
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {/* Render days */}
              {daysInMonth.map(day => renderDay(day))}
            </div>
          )}
          
          {viewMode === 'week' && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-px">
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-500">
                Week view implementation coming soon
              </p>
              {/* Here we would implement a proper week view */}
            </div>
          )}
          
          {viewMode === 'list' && renderListView()}
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarView;
