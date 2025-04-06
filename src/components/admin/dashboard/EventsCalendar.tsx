
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: string;
}

export interface EventsCalendarProps {
  events: Event[];
}

export const EventsCalendar: React.FC<EventsCalendarProps & { onRefresh?: () => void }> = ({ 
  events,
  onRefresh
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CardDescription>Events in the next 14 days</CardDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="h-7 px-2 py-0">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex items-start">
                <div className="mr-4 flex flex-col items-center">
                  <div className="text-xs text-muted-foreground">{format(event.date, 'MMM')}</div>
                  <div className="text-xl font-bold">{format(event.date, 'd')}</div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className={`text-xs px-1.5 py-0.5 rounded-full inline-flex mt-1 ${
                    event.type === 'fixture' 
                      ? 'bg-blue-100 text-blue-800' 
                      : event.type === 'meeting' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="link" size="sm" className="w-full mt-4">View Full Calendar</Button>
      </CardContent>
    </Card>
  );
};

export default EventsCalendar;
