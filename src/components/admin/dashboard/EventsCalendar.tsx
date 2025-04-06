
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'match' | 'publication' | 'maintenance' | 'other';
  link?: string;
}

interface EventsCalendarProps {
  events: CalendarEvent[];
}

export function EventsCalendar({ events }: EventsCalendarProps) {
  // Group events by date
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    const dateKey = format(event.date, 'yyyy-MM-dd');
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });
  
  // Get the dates with events
  const eventDates = Object.keys(groupedEvents).sort();
  
  const getEventTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'match':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">Match</Badge>;
      case 'publication':
        return <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">Publish</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-600">Maintenance</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">Event</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Upcoming Events
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {eventDates.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No upcoming events</p>
        ) : (
          <div className="space-y-4">
            {eventDates.map((dateKey) => {
              const eventsOnDate = groupedEvents[dateKey];
              const date = new Date(dateKey);
              
              return (
                <div key={dateKey} className="border-l-2 border-primary-800 pl-4 pb-1">
                  <p className="text-xs font-semibold mb-2">{format(date, 'EEEE, MMMM d')}</p>
                  <div className="space-y-2">
                    {eventsOnDate.map(event => (
                      <div key={event.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{event.title}</p>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(event.date, 'h:mm a')}
                          </p>
                        </div>
                        {event.link && (
                          <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                            <Link to={event.link}>View</Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
