
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ExternalLink, MapPin, Calendar, Clock, Trophy } from 'lucide-react';
import { Fixture } from '@/types';

interface FixturePreviewProps {
  fixture: Fixture;
  variant?: 'default' | 'compact' | 'detailed';
  showVenue?: boolean;
  showTicketLink?: boolean;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  className?: string;
}

export const FixturePreview: React.FC<FixturePreviewProps> = ({
  fixture,
  variant = 'default',
  showVenue = true,
  showTicketLink = true,
  homeTeamLogo,
  awayTeamLogo,
  className = '',
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      // Try to parse the date with ISO format first
      const date = parseISO(dateString);
      return format(date, 'EEE, d MMM yyyy');
    } catch (error) {
      // If it fails, try to handle other date formats
      try {
        // Try to handle "YYYY-MM-DD" format directly
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, 'EEE, d MMM yyyy');
      } catch (e) {
        // Return the original date if all parsing fails
        return dateString;
      }
    }
  };

  // Determine if the fixture is completed
  const isCompleted = fixture.is_completed || 
    (fixture.home_score !== undefined && fixture.away_score !== undefined);

  // Helper function to determine score display
  const getScoreDisplay = () => {
    if (isCompleted && fixture.home_score !== undefined && fixture.away_score !== undefined) {
      return `${fixture.home_score} - ${fixture.away_score}`;
    }
    return 'vs';
  };

  // Determine card style based on variant
  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return 'p-2';
      case 'detailed':
        return 'p-4';
      default:
        return 'p-3';
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className={`${getCardStyle()} relative`}>
        {/* Competition badge */}
        <Badge 
          className="absolute top-2 right-2" 
          variant={
            fixture.competition.toLowerCase().includes('league') ? 'default' : 
            fixture.competition.toLowerCase().includes('cup') ? 'destructive' : 
            'secondary'
          }
        >
          {fixture.competition}
        </Badge>

        {/* Teams section */}
        <div className="flex items-center justify-center space-x-4 my-4">
          <div className="text-right flex-1">
            <div className="font-bold text-lg">{fixture.home_team}</div>
            {homeTeamLogo && (
              <div className="flex justify-end mt-2">
                <img src={homeTeamLogo} alt={fixture.home_team} className="h-8 w-8 object-contain" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`font-bold ${isCompleted ? 'text-2xl' : 'text-lg'}`}>
              {getScoreDisplay()}
            </div>
            {!isCompleted && <div className="text-xs text-gray-500 mt-1">Upcoming</div>}
          </div>
          
          <div className="text-left flex-1">
            <div className="font-bold text-lg">{fixture.away_team}</div>
            {awayTeamLogo && (
              <div className="flex justify-start mt-2">
                <img src={awayTeamLogo} alt={fixture.away_team} className="h-8 w-8 object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Date, time and venue information */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(fixture.date)}</span>
          </div>
          
          {fixture.time && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{fixture.time}</span>
            </div>
          )}
          
          {showVenue && fixture.venue && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{fixture.venue}</span>
            </div>
          )}
        </div>

        {/* Ticket link */}
        {showTicketLink && fixture.ticket_link && (
          <div className="mt-4 text-center">
            <a 
              href={fixture.ticket_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Get Tickets
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FixturePreview;
