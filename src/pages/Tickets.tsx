
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Ticket, Info, CreditCard, Mail, Users, Calendar, Clock, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
}

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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const Tickets = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [ticketType, setTicketType] = useState("adult");
  const [quantity, setQuantity] = useState(1);
  
  const ticketPrices = {
    adult: 10,
    concession: 6,
    under16: 3,
    family: 20  // 2 adults + 2 children
  };
  
  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    // Reset form when selecting a new match
    setTicketType("adult");
    setQuantity(1);
  };
  
  const totalPrice = selectedMatch ? ticketPrices[ticketType as keyof typeof ticketPrices] * quantity : 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
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
              className="md:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-team-blue mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Home Matches
                </h2>
                
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => handleMatchSelect(match)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedMatch?.id === match.id 
                          ? 'border-team-blue bg-team-lightBlue/20' 
                          : 'border-gray-200 hover:border-team-blue/50 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-medium text-team-blue">{match.competition}</p>
                      <p className="font-bold mb-1">{match.homeTeam} vs {match.awayTeam}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatDate(match.date)}</span>
                        <span>{match.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-team-blue mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        Tickets can also be purchased on match day at the Spain Park ticket office, 
                        which opens 1.5 hours before kick-off.
                      </p>
                      <p>
                        For group bookings or further information, please contact the club directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ticket Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 mt-6"
              >
                <h2 className="text-xl font-bold text-team-blue mb-4 flex items-center">
                  <Ticket className="w-5 h-5 mr-2" />
                  Ticket Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Adult</span>
                    <span className="font-bold">£10.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Concession (Over 65 / Student)</span>
                    <span className="font-bold">£6.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Under 16</span>
                    <span className="font-bold">£3.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Family (2 Adults + 2 U16)</span>
                    <span className="font-bold">£20.00</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-team-blue mr-2" />
                    <span className="text-sm">Ticket Office: 01224 574295</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Ticket Purchase Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              {selectedMatch ? (
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-team-blue mb-6">Purchase Tickets</h2>
                    
                    <div className="bg-team-lightBlue/20 p-4 rounded-lg mb-6">
                      <h3 className="font-bold text-lg mb-2">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h3>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <Calendar className="w-4 h-4 mr-2 text-team-blue" />
                          <span>{formatDate(selectedMatch.date)}</span>
                        </div>
                        <div className="flex items-center mb-2 sm:mb-0">
                          <Clock className="w-4 h-4 mr-2 text-team-blue" />
                          <span>{selectedMatch.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Ticket className="w-4 h-4 mr-2 text-team-blue" />
                          <span>{selectedMatch.competition}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Ticket Type
                        </label>
                        <select
                          value={ticketType}
                          onChange={(e) => setTicketType(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                        >
                          <option value="adult">Adult (£10.00)</option>
                          <option value="concession">Concession - Over 65 / Student (£6.00)</option>
                          <option value="under16">Under 16 (£3.00)</option>
                          <option value="family">Family - 2 Adults + 2 Under 16 (£20.00)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Quantity
                        </label>
                        <select
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <Mail className="w-4 h-4 inline mr-1" /> Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Your email"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          <Users className="w-4 h-4 inline mr-1" /> Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your name"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-xl text-team-blue">£{totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <button
                        className="w-full bg-team-blue text-white font-medium py-3 rounded-md hover:bg-team-navy transition-colors flex items-center justify-center"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center mt-4">
                        E-tickets will be sent to your email address after payment. 
                        You can print them or show them on your mobile device at the gate.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm p-10 text-center">
                  <div>
                    <Ticket className="w-16 h-16 text-team-blue mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Match</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Please select one of our upcoming home matches from the list on the left to purchase tickets.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Season Tickets Callout */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 bg-team-blue text-white rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Season Tickets 2023/24</h3>
                    <p className="text-white/80">
                      Get access to all home league games for the season. Adult season tickets start from just £120.
                    </p>
                  </div>
                  <a 
                    href="#" 
                    className="bg-white text-team-blue px-5 py-2 rounded font-medium hover:bg-team-lightBlue transition-colors"
                  >
                    View Season Tickets
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tickets;
