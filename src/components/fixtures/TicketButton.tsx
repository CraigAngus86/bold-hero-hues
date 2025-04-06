
import React from 'react';
import { Button } from '../ui/button';
import { Ticket } from 'lucide-react';
import { Match } from './types';

interface TicketButtonProps {
  nextMatchWithTickets: Match | undefined;
}

const TicketButton: React.FC<TicketButtonProps> = ({ nextMatchWithTickets }) => {
  if (!nextMatchWithTickets) return null;

  return (
    <Button 
      asChild
      size="lg"
      className="bg-team-lightBlue hover:bg-white text-team-blue font-medium"
    >
      <a 
        href={nextMatchWithTickets.ticketLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center"
      >
        <Ticket className="w-5 h-5 mr-2" /> Buy Tickets
      </a>
    </Button>
  );
};

export default TicketButton;
