
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, eachDayOfInterval, isSameMonth } from 'date-fns';
import { DateRange } from './DateRange';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import { cn } from '@/lib/utils';
import { Match } from '@/components/fixtures/types';
import { Badge } from '@/components/ui/badge';

interface CalendarViewProps {
  matches?: Match[];
  onFilterChange?: (filters: any) => void;
  isLoading?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  matches = [], 
  onFilterChange,
  isLoading = false
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [visibleMatches, setVisibleMatches] = useState<Match[]>([]);

  // Handle view change (month, week, day)
  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setView(view);
    
    // Reset date range when view changes
    if (date) {
      updateVisibleDateRange(date, view);
    }
  };

  // Update visible date range based on selected date and view
  const updateVisibleDateRange = (selectedDate: Date, currentView: 'month' | 'week' | 'day') => {
    if (!selectedDate) return;
    
    let from: Date, to: Date;
    
    switch (currentView) {
      case 'month':
        from = startOfMonth(selectedDate);
        to = endOfMonth(selectedDate);
        break;
      case 'week':
        from = startOfWeek(selectedDate);
        to = endOfWeek(selectedDate);
        break;
      case 'day':
        from = startOfDay(selectedDate);
        to = endOfDay(selectedDate);
        break;
      default:
        from = startOfMonth(selectedDate);
        to = endOfMonth(selectedDate);
    }
    
    setDateRange({ from, to });
  };

  // Filter matches based on selected date range
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const filtered = matches.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate >= dateRange.from! && matchDate <= dateRange.to!;
      });
      
      setVisibleMatches(filtered);
    } else {
      setVisibleMatches(matches);
    }
  }, [matches, dateRange]);

  // Update date range when date or view changes
  useEffect(() => {
    if (date) {
      updateVisibleDateRange(date, view);
    }
  }, [date, view]);

  // Get days in the current view
  const getDaysInView = () => {
    if (!dateRange.from || !dateRange.to) return [];
    
    return eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to
    });
  };

  // Get matches for a specific day
  const getMatchesForDay = (day: Date) => {
    return visibleMatches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate.toDateString() === day.toDateString();
    });
  };

  // Format match time for display
  const formatMatchTime = (match: Match) => {
    return match.time || '—';
  };

  // Get team name display
  const getTeamDisplay = (teamName: string) => {
    const isBanksODee = teamName.toLowerCase().includes('banks') && teamName.toLowerCase().includes('dee');
    return (
      <span className={cn(
        "font-medium",
        isBanksODee && "text-team-blue font-semibold"
      )}>
        {teamName}
      </span>
    );
  };

  // Render calendar day
  const renderDay = (day: Date) => {
    const matches = getMatchesForDay(day);
    const isCurrentMonth = date ? isSameMonth(day, date) : false;
    
    return (
      <div 
        key={day.toISOString()} 
        className={cn(
          "border rounded-md p-2 h-36 overflow-y-auto",
          !isCurrentMonth && "bg-gray-50"
        )}
      >
        <div className="font-medium text-sm mb-1">
          {format(day, 'd')}
        </div>
        
        {matches.length === 0 ? (
          <div className="text-xs text-gray-400 py-1">No matches</div>
        ) : (
          <div className="space-y-2">
            {matches.map((match, idx) => (
              <div key={match.id || idx} className="text-xs p-1 bg-gray-50 border rounded">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{formatMatchTime(match)}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {match.competition}
                  </Badge>
                </div>
                <div className="mt-1 font-medium">{getTeamDisplay(match.homeTeam)}</div>
                <div className="text-gray-500 text-center text-[10px] my-[2px]">vs</div>
                <div className="font-medium">{getTeamDisplay(match.awayTeam)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const days = getDaysInView();
    
    if (view === 'month') {
      return (
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
          
          {days.map(day => renderDay(day))}
        </div>
      );
    } else if (view === 'week') {
      return (
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => (
            <div key={day.toISOString()} className="flex flex-col">
              <div className="text-center font-medium text-sm py-1">
                {format(day, 'EEE')}
              </div>
              {renderDay(day)}
            </div>
          ))}
        </div>
      );
    } else { // day view
      return (
        <div className="grid grid-cols-1 gap-1">
          {renderDay(dateRange.from!)}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewChange('day')}
          >
            Day
          </Button>
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("w-full md:w-auto justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" className="ml-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Fixtures Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <p className="text-muted-foreground">Loading fixtures...</p>
            </div>
          ) : visibleMatches.length > 0 ? (
            <div className="h-[500px] overflow-auto">
              {renderCalendarGrid()}
            </div>
          ) : (
            <div className="h-[500px] flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                No fixtures found for the selected time period.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
