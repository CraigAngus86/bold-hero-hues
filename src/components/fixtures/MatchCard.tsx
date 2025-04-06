
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from '@/utils/dateUtils';
import { ExternalLink } from 'lucide-react';
import { Match } from '@/types/fixtures';

interface MatchCardProps {
  match: Match;
  showTicketButton?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, showTicketButton = true }) => {
  const isCompleted = match.isCompleted;
  const hasScores = match.homeScore !== undefined && match.awayScore !== undefined;
  
  // Format match date
  const formattedDate = formatDate(match.date);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/50 px-4 py-2 flex justify-between items-center border-b">
          <div className="text-sm text-muted-foreground">
            {formattedDate} • {match.time}
          </div>
          <div className="text-sm font-medium">{match.competition}</div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-bold">{match.homeTeam}</div>
            </div>
            
            <div className="px-4 py-2 text-center">
              {isCompleted && hasScores ? (
                <div className="flex items-center justify-center">
                  <div className="text-lg font-bold mx-1">{match.homeScore}</div>
                  <div className="mx-1 text-muted-foreground">-</div>
                  <div className="text-lg font-bold mx-1">{match.awayScore}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">vs</div>
              )}
            </div>
            
            <div className="flex-1 text-right">
              <div className="font-bold">{match.awayTeam}</div>
            </div>
          </div>
          
          {match.venue && (
            <div className="mt-2 text-xs text-center text-muted-foreground">
              {match.venue}
            </div>
          )}
          
          {showTicketButton && match.ticketLink && !isCompleted && (
            <div className="mt-3 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href={match.ticketLink} target="_blank" rel="noopener noreferrer">
                  <span>Tickets</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
