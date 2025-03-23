import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Ticket, Info, CreditCard, Mail, Users, Calendar, Clock, Phone, ShoppingCart, Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
}

interface BasketItem {
  id: string;
  matchId: number;
  match: Match;
  ticketType: string;
  quantity: number;
  price: number;
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
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  
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
  
  const getTicketTypeName = (type: string) => {
    switch(type) {
      case 'adult': return 'Adult';
      case 'concession': return 'Concession (Over 65 / Student)';
      case 'under16': return 'Under 16';
      case 'family': return 'Family (2 Adults + 2 U16)';
      default: return type;
    }
  };
  
  const addToBasket = () => {
    if (!selectedMatch) return;
    
    // Create a unique ID for this basket item
    const basketItemId = `${selectedMatch.id}-${ticketType}-${Date.now()}`;
    
    const newBasketItem: BasketItem = {
      id: basketItemId,
      matchId: selectedMatch.id,
      match: selectedMatch,
      ticketType,
      quantity,
      price: ticketPrices[ticketType as keyof typeof ticketPrices] * quantity
    };
    
    setBasket([...basket, newBasketItem]);
    toast.success("Tickets added to basket");
    
    // Reset quantity but keep the match and ticket type for convenience
    setQuantity(1);
  };
  
  const removeFromBasket = (id: string) => {
    setBasket(basket.filter(item => item.id !== id));
    toast.info("Item removed from basket");
  };
  
  const basketTotalItems = basket.reduce((total, item) => total + item.quantity, 0);
  const basketTotalPrice = basket.reduce((total, item) => total + item.price, 0);
  
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
              
              {/* Season Tickets Callout */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 bg-team-blue text-white rounded-lg shadow-md p-6"
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
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-team-blue mb-6">Purchase Tickets</h2>
                      
                      <Button
                        variant="outline"
                        className="relative"
                        onClick={() => setIsBasketOpen(!isBasketOpen)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {basketTotalItems > 0 && (
                          <span className="absolute -top-2 -right-2 bg-team-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {basketTotalItems}
                          </span>
                        )}
                      </Button>
                    </div>
                    
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
                    
                    {isBasketOpen ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <ShoppingCart className="w-5 h-5 mr-2 text-team-blue" />
                          Your Basket ({basketTotalItems} {basketTotalItems === 1 ? 'item' : 'items'})
                        </h3>
                        
                        {basket.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <AlertCircle className="w-10 h-10 mb-2 text-gray-400" />
                            <p>Your basket is empty</p>
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => setIsBasketOpen(false)}
                            >
                              Continue Shopping
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                              {basket.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                  <div>
                                    <p className="font-medium">{item.match.homeTeam} vs {item.match.awayTeam}</p>
                                    <p className="text-sm text-gray-600">{formatDate(item.match.date)} • {item.match.time}</p>
                                    <p className="text-sm">{getTicketTypeName(item.ticketType)} × {item.quantity}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <p className="font-bold text-team-blue mr-4">£{item.price.toFixed(2)}</p>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeFromBasket(item.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-3">
                              <span>Total:</span>
                              <span className="text-team-blue">£{basketTotalPrice.toFixed(2)}</span>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Button 
                                variant="outline"
                                onClick={() => setIsBasketOpen(false)}
                              >
                                Continue Shopping
                              </Button>
                              <Button 
                                className="bg-team-blue hover:bg-team-navy text-white"
                              >
                                <CreditCard className="w-5 h-5 mr-2" />
                                Checkout
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Ticket Type
                            </label>
                            <Select
                              value={ticketType}
                              onValueChange={(value) => setTicketType(value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select ticket type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="adult">Adult (£10.00)</SelectItem>
                                <SelectItem value="concession">Concession - Over 65 / Student (£6.00)</SelectItem>
                                <SelectItem value="under16">Under 16 (£3.00)</SelectItem>
                                <SelectItem value="family">Family - 2 Adults + 2 Under 16 (£20.00)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Quantity
                            </label>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="w-full mx-2 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={quantity}
                                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                disabled={quantity >= 10}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
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
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg">Total:</span>
                            <span className="font-bold text-xl text-team-blue">£{totalPrice.toFixed(2)}</span>
                          </div>
                          
                          <Button
                            className="w-full bg-team-blue text-white font-medium py-6 rounded-md hover:bg-team-lightBlue hover:text-team-blue transition-colors flex items-center justify-center"
                            onClick={addToBasket}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Basket
                          </Button>
                          
                          <p className="text-xs text-gray-500 text-center mt-4">
                            E-tickets will be sent to your email address after payment. 
                            You can print them or show them on your mobile device at the gate.
                          </p>
                        </div>
                      </>
                    )}
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
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tickets;
