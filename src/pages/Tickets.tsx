
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { MatchSelection, PurchasePanel, SeasonTicketsCard } from '@/components/tickets';
import { Match, BasketItem } from '@/components/tickets/types';
import { getTicketTypeName } from '@/components/tickets/utils';

// Mock data for upcoming matches
const upcomingMatches: Match[] = [
  {
    id: 4,
    homeTeam: "Banks o' Dee",
    awayTeam: "Buckie Thistle",
    date: "2023-09-30",
    time: "15:00",
    competition: "Highland League",
    venue: "Spain Park"
  },
  {
    id: 5,
    homeTeam: "Banks o' Dee",
    awayTeam: "Lossiemouth",
    date: "2023-10-14",
    time: "15:00",
    competition: "Highland League Cup",
    venue: "Spain Park"
  },
  {
    id: 8,
    homeTeam: "Banks o' Dee",
    awayTeam: "Wick Academy",
    date: "2023-10-28",
    time: "15:00",
    competition: "Highland League",
    venue: "Spain Park"
  },
  {
    id: 10,
    homeTeam: "Banks o' Dee",
    awayTeam: "Strathspey Thistle",
    date: "2023-11-11",
    time: "15:00",
    competition: "Highland League",
    venue: "Spain Park"
  }
];

const ticketPrices = {
  adult: 10,
  concession: 6,
  under16: 3,
  family: 20  // 2 adults + 2 children
};

const Tickets = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  
  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
  };
  
  const handleRemoveFromBasket = (id: string) => {
    setBasket(basket.filter(item => item.id !== id));
    toast.info("Item removed from basket");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20 flex-grow">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Match Tickets</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Purchase tickets for upcoming Banks o' Dee FC home matches at Spain Park.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Match Selection */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1 flex flex-col"
            >
              <MatchSelection 
                upcomingMatches={upcomingMatches}
                selectedMatch={selectedMatch}
                onMatchSelect={handleMatchSelect}
              />
            </motion.div>
            
            {/* Right Column - Season Tickets and Purchase Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              {/* Season Tickets Callout */}
              <div className="mb-6">
                <SeasonTicketsCard />
              </div>
              
              <PurchasePanel 
                selectedMatch={selectedMatch}
                basket={basket}
                setBasket={(newBasket) => {
                  setBasket(newBasket);
                  if (newBasket.length > basket.length) {
                    toast.success("Tickets added to basket");
                  }
                }}
                getTicketTypeName={getTicketTypeName}
                ticketPrices={ticketPrices}
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tickets;
