
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon, TicketIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
  matchReportLink?: string;
  className?: string;
}

// Format date properly
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const MatchCard: React.FC<MatchCardProps> = ({
  homeTeam,
  awayTeam,
  date,
  time,
  venue,
  competition,
  isCompleted = false,
  homeScore,
  awayScore,
  ticketLink,
  matchReportLink,
  className,
}) => {
  const isBanksODeeHome = homeTeam.includes("Banks o' Dee");
  const isBanksODeeAway = awayTeam.includes("Banks o' Dee");
  
  // Determine result for Banks o' Dee
  const getResult = () => {
    if (!isCompleted || homeScore === undefined || awayScore === undefined) {
      return null;
    }
    
    const bankScore = isBanksODeeHome ? homeScore : awayScore;
    const opponentScore = isBanksODeeHome ? awayScore : homeScore;
    
    if (bankScore > opponentScore) return "win";
    if (bankScore < opponentScore) return "loss";
    return "draw";
  };
  
  const result = getResult();
  
  // Get result styles
  const getResultStyles = () => {
    if (result === "win") return "bg-green-100 text-green-800 border-green-300";
    if (result === "loss") return "bg-red-100 text-red-800 border-red-300";
    if (result === "draw") return "bg-amber-100 text-amber-800 border-amber-300";
    return "";
  };
  
  return (
    <motion.div
      className={cn(
        "card-premium relative overflow-hidden rounded-lg bg-white shadow-card",
        className
      )}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className={cn(
        "bg-primary-gradient p-4 text-white flex justify-between items-center",
        isCompleted ? "border-b-4 border-gray-300" : "border-b-4 border-accent-500"
      )}>
        <div>
          <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">
            {competition}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 text-sm">
          <CalendarIcon className="h-3.5 w-3.5 text-accent-500" />
          <span>{formatDate(date)}</span>
        </div>
      </div>
      
      {/* Match Content */}
      <div className="p-5">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          {/* Home Team */}
          <div className={cn(
            "flex flex-col items-center flex-1 text-center",
            isBanksODeeHome ? "font-bold" : ""
          )}>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 border border-gray-200">
              {isBanksODeeHome ? (
                <img 
                  src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                  alt="Banks o' Dee" 
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-team-blue">
                  {homeTeam.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm">{homeTeam}</span>
            {isBanksODeeHome && (
              <span className="mt-1 text-xs bg-team-blue text-white px-2 py-0.5 rounded">HOME</span>
            )}
          </div>
          
          {/* Score or VS */}
          <div className="mx-4 text-center">
            {isCompleted && homeScore !== undefined && awayScore !== undefined ? (
              <div className={cn(
                "px-4 py-2 rounded-lg font-bold text-lg border",
                getResultStyles()
              )}>
                {homeScore} - {awayScore}
              </div>
            ) : (
              <div className="text-gray-400 font-medium">
                <span>VS</span>
              </div>
            )}
          </div>
          
          {/* Away Team */}
          <div className={cn(
            "flex flex-col items-center flex-1 text-center",
            isBanksODeeAway ? "font-bold" : ""
          )}>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 border border-gray-200">
              {isBanksODeeAway ? (
                <img 
                  src="/lovable-uploads/banks-o-dee-dark-logo.png" 
                  alt="Banks o' Dee" 
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-team-blue">
                  {awayTeam.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm">{awayTeam}</span>
            {isBanksODeeAway && (
              <span className="mt-1 text-xs bg-gray-600 text-white px-2 py-0.5 rounded">AWAY</span>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="border-t border-gray-100 pt-3 flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-3.5 w-3.5 mr-2 text-team-blue" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-3.5 w-3.5 mr-2 text-team-blue" />
            <span>{venue}</span>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-4">
          {isCompleted ? (
            matchReportLink && (
              <a 
                href={matchReportLink}
                className="flex items-center justify-center w-full bg-team-blue text-white font-medium px-4 py-2 rounded hover:bg-team-blue/90 transition-colors"
              >
                Match Report
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </a>
            )
          ) : (
            ticketLink && (
              <a 
                href={ticketLink}
                className="flex items-center justify-center w-full bg-accent-500 text-team-blue font-semibold px-4 py-2 rounded hover:bg-accent-600 transition-colors btn-hover-effect"
              >
                <TicketIcon className="h-4 w-4 mr-2" />
                Buy Tickets
              </a>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
