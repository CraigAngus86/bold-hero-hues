import { useState } from 'react';
import { Ticket, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Match, BasketItem } from './types';
import MatchDetail from './MatchDetail';
import BasketSummary from './BasketSummary';
import TicketForm from './TicketForm';

interface PurchasePanelProps {
  selectedMatch: Match | null;
  basket: BasketItem[];
  setBasket: (items: BasketItem[]) => void;
  getTicketTypeName: (type: string) => string;
  ticketPrices: Record<string, number>;
}

const PurchasePanel = ({ 
  selectedMatch, 
  basket, 
  setBasket,
  getTicketTypeName,
  ticketPrices
}: PurchasePanelProps) => {
  const [ticketType, setTicketType] = useState("adult");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  
  const totalPrice = selectedMatch ? ticketPrices[ticketType as keyof typeof ticketPrices] * quantity : 0;
  
  const basketTotalItems = basket.reduce((total, item) => total + item.quantity, 0);
  const basketTotalPrice = basket.reduce((total, item) => total + item.price, 0);
  
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
    
    // Reset quantity but keep the match and ticket type for convenience
    setQuantity(1);
  };
  
  const removeFromBasket = (id: string) => {
    setBasket(basket.filter(item => item.id !== id));
  };

  if (!selectedMatch) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm p-10 text-center">
        <div>
          <Ticket className="w-16 h-16 text-team-blue mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Match</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please select one of our upcoming home matches from the list on the left to purchase tickets.
          </p>
        </div>
      </div>
    );
  }

  return (
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
        
        <MatchDetail match={selectedMatch} />
        
        {isBasketOpen ? (
          <BasketSummary 
            basket={basket}
            basketTotalItems={basketTotalItems}
            basketTotalPrice={basketTotalPrice}
            removeFromBasket={removeFromBasket}
            onClose={() => setIsBasketOpen(false)}
            getTicketTypeName={getTicketTypeName}
          />
        ) : (
          <TicketForm 
            selectedMatch={selectedMatch}
            ticketType={ticketType}
            setTicketType={setTicketType}
            quantity={quantity}
            setQuantity={setQuantity}
            email={email}
            setEmail={setEmail}
            fullName={fullName}
            setFullName={setFullName}
            totalPrice={totalPrice}
            addToBasket={addToBasket}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PurchasePanel;
