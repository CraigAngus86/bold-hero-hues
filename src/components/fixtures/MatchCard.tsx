
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from '@/utils/dateUtils';
import { ExternalLink, Calendar, Clock, MapPin } from 'lucide-react';
import { Match } from '@/types/fixtures';
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: Match;
  showTicketButton?: boolean;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  showTicketButton = true,
  className = ""
}) => {
  const isCompleted = match.isCompleted;
  const hasScores = match.homeScore !== undefined && match.awayScore !== undefined;
  const isHomeBanksODee = match.homeTeam.includes("Banks o' Dee");
  const isAwayBanksODee = match.awayTeam.includes("Banks o' Dee");
  
  // Format match date
  const formattedDate = formatDate(match.date);

  // Determine match status
  const getMatchStatus = () => {
    if (isCompleted) return "FT";
    
    // Check if match is live (current date matches and within time range)
    const today = new Date();
    const matchDate = new Date(match.date);
    
    if (matchDate.toDateString() === today.toDateString()) {
      if (match.time) {
        const [hours, minutes] = match.time.split(':').map(Number);
        const matchTime = new Date();
        matchTime.setHours(hours || 0, minutes || 0);
        
        // If current time is within 2 hours after match start time, consider it live
        const twoHoursAfter = new Date(matchTime);
        twoHoursAfter.setHours(twoHoursAfter.getHours() + 2);
        
        if (today >= matchTime && today <= twoHoursAfter) {
          return "LIVE";
        }
      }
    }
    
    return matchDate < today ? "COMPLETED" : "UPCOMING";
  };
  
  const matchStatus = getMatchStatus();
  
  // Determine the result style for Banks o' Dee
  const getResultStyle = () => {
    if (!isCompleted || !hasScores) return {};
    
    const bankScore = isHomeBanksODee ? match.homeScore : match.awayScore;
    const opponentScore = isHomeBanksODee ? match.awayScore : match.homeScore;
    
    if (bankScore === opponentScore) {
      return { badge: 'D', color: '#FFD700', bgColor: '#FFF8E0', textColor: '#7B6514' }; // Draw - gold
    } else if (bankScore > opponentScore) {
      return { badge: 'W', color: '#4ADE80', bgColor: '#ECFDF5', textColor: '#166534' }; // Win - green
    } else {
      return { badge: 'L', color: '#F87171', bgColor: '#FEF2F2', textColor: '#B91C1C' }; // Loss - red
    }
  };
  
  const resultStyle = getResultStyle();
  
  // Add to calendar function
  const addToCalendar = () => {
    if (!match) return;
    
    const startDate = new Date(`${match.date}T${match.time || '15:00'}`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const title = `${match.homeTeam} vs ${match.awayTeam}`;
    const details = `${match.competition} match at ${match.venue}`;
    
    // Format dates for Google Calendar
    const formatForCalendar = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const start = formatForCalendar(startDate);
    const end = formatForCalendar(endDate);
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(match.venue)}&dates=${start}/${end}`;
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-team-blue to-team-blue/90 px-4 py-2.5 flex justify-between items-center">
            <div className="text-sm text-white">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-team-accent" />
                <span>{formattedDate}</span>
                <span className="mx-1.5 text-white/50">•</span>
                <Clock className="w-3.5 h-3.5 mr-1.5 text-team-accent" />
                <span>{match.time}</span>
              </div>
            </div>
            <div className="text-sm font-medium text-white bg-white/10 px-2 py-0.5 rounded">{match.competition}</div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex flex-col items-center md:items-end">
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 flex items-center justify-center border border-gray-200">
                  {isHomeBanksODee ? (
                    <img 
                      src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                      alt="Banks o' Dee Logo"
                      className="w-9 h-9 object-contain" 
                    />
                  ) : (
                    <span className="font-bold text-xs text-team-blue">
                      {match.homeTeam.split(' ').map(word => word[0]).join('')}
                    </span>
                  )}
                </div>
                <div className={`font-bold text-base ${isHomeBanksODee ? 'text-team-blue' : 'text-gray-800'}`}>
                  {match.homeTeam}
                </div>
                {isHomeBanksODee && (
                  <span className="text-[10px] text-white bg-team-blue/80 uppercase px-1.5 py-0.5 rounded-sm mt-1 font-medium">
                    HOME
                  </span>
                )}
              </div>
              
              <div className="px-4 py-2 mx-2 text-center">
                {isCompleted && hasScores ? (
                  <div className="flex items-center justify-center">
                    <div className="mx-1.5 py-1 px-3 font-bold text-lg" style={{ color: resultStyle.textColor }}>
                      {match.homeScore}
                    </div>
                    <div className="mx-1.5 text-gray-400 font-light">-</div>
                    <div className="mx-1.5 py-1 px-3 font-bold text-lg" style={{ color: resultStyle.textColor }}>
                      {match.awayScore}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">vs</div>
                    {matchStatus === "LIVE" && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">LIVE</span>
                    )}
                  </div>
                )}
                
                {isCompleted && (
                  <span className="block mt-1 text-xs font-medium py-0.5 px-2 rounded-full" 
                    style={{ 
                      backgroundColor: resultStyle.bgColor,
                      color: resultStyle.textColor
                    }}>
                    FULL TIME
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-2 flex items-center justify-center border border-gray-200">
                  {isAwayBanksODee ? (
                    <img 
                      src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                      alt="Banks o' Dee Logo"
                      className="w-9 h-9 object-contain" 
                    />
                  ) : (
                    <span className="font-bold text-xs text-team-blue">
                      {match.awayTeam.split(' ').map(word => word[0]).join('')}
                    </span>
                  )}
                </div>
                <div className={`font-bold text-base ${isAwayBanksODee ? 'text-team-blue' : 'text-gray-800'}`}>
                  {match.awayTeam}
                </div>
                {isAwayBanksODee && (
                  <span className="text-[10px] text-white bg-gray-500 uppercase px-1.5 py-0.5 rounded-sm mt-1 font-medium">
                    AWAY
                  </span>
                )}
              </div>
            </div>
            
            {match.venue && (
              <div className="mt-3 text-xs text-center flex items-center justify-center text-gray-500">
                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                {match.venue}
              </div>
            )}
            
            {!isCompleted && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {!matchStatus.includes("LIVE") && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addToCalendar}
                    className="text-xs bg-gray-50 border-gray-200 hover:bg-gray-100"
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    Add to Calendar
                  </Button>
                )}
                
                {showTicketButton && match.ticketLink && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="bg-team-accent text-team-blue border-team-accent hover:bg-team-accent/80 hover:text-team-blue"
                  >
                    <a href={match.ticketLink} target="_blank" rel="noopener noreferrer">
                      <span>Buy Tickets</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchCard;
