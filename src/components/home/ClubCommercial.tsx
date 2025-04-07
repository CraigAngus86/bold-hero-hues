
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight, CreditCard, Shield } from 'lucide-react';

// Mock products data
const shopItems = [
  {
    id: 'item-1',
    name: 'Home Kit 2025/26',
    price: 45.00,
    image: '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png',
    url: '/shop/home-kit-202526'
  },
  {
    id: 'item-2',
    name: 'Away Kit 2025/26',
    price: 45.00,
    image: '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
    url: '/shop/away-kit-202526'
  },
  {
    id: 'item-3',
    name: 'Training Jacket',
    price: 35.00,
    image: '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
    url: '/shop/training-jacket'
  },
  {
    id: 'item-4',
    name: 'Supporters Scarf',
    price: 15.00,
    image: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
    url: '/shop/supporters-scarf'
  }
];

const ClubCommercial: React.FC = () => {
  // Scroll reference for shop items
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-team-blue mb-12">Club Shop</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shop Items - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-team-blue" />
                  <h3 className="text-xl font-semibold text-team-blue">Featured Products</h3>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => scroll('left')}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => scroll('right')}
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Horizontal Scrollable Product List */}
              <div 
                ref={scrollRef} 
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {shopItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    className="flex-shrink-0 w-[250px]"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden border border-gray-200 h-full">
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply p-2"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-team-blue truncate">{item.name}</h4>
                        <p className="text-lg font-bold mt-1 mb-3">£{item.price.toFixed(2)}</p>
                        <Link to={item.url}>
                          <Button className="w-full bg-team-blue hover:bg-blue-800">
                            Shop Now
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/shop">
                  <Button variant="outline" className="border-team-blue text-team-blue hover:bg-team-blue hover:text-white">
                    Visit Club Shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Season Tickets - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden h-full"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png" 
                  alt="Spain Park Stadium" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold">Season Tickets 2025/26</h3>
                    <p className="text-sm">Secure your seat for all home games</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h4 className="font-semibold text-team-blue text-lg">Membership Benefits</h4>
                
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mt-1 mr-2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">Entry to all home league games</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 mr-2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">Priority access to cup match tickets</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 mr-2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">10% discount in the club shop</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-1 mr-2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">Exclusive members' events</span>
                  </li>
                </ul>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-team-blue" />
                      <span className="font-semibold">From £120</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                  
                  <Link to="/tickets/season-tickets">
                    <Button className="w-full bg-team-blue hover:bg-blue-800 mt-2">
                      Buy Season Ticket
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubCommercial;
