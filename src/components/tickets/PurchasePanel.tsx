
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

interface TicketQuantity {
  adult: number;
  concession: number;
  under16: number;
  family: number;
}

const PurchasePanel = ({ 
  selectedMatch, 
  basket, 
  setBasket,
  getTicketTypeName,
  ticketPrices
}: PurchasePanelProps) => {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  
  const basketTotalItems = basket.reduce((total, item) => total + item.quantity, 0);
  const basketTotalPrice = basket.reduce((total, item) => total + item.price, 0);
  
  const addToBasket = (quantities: TicketQuantity) => {
    if (!selectedMatch) return;
    
    const newBasketItems: BasketItem[] = [];
    
    // Create a basket item for each ticket type with quantity > 0
    Object.entries(quantities).forEach(([type, quantity]) => {
      if (quantity > 0) {
        const basketItemId = `${selectedMatch.id}-${type}-${Date.now()}`;
        
        newBasketItems.push({
          id: basketItemId,
          matchId: selectedMatch.id,
          match: selectedMatch,
          ticketType: type,
          quantity,
          price: ticketPrices[type] * quantity
        });
      }
    });
    
    setBasket([...basket, ...newBasketItems]);
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
            totalPrice={0} // Not needed anymore as we calculate in the TicketForm
            addToBasket={addToBasket}
            ticketPrices={ticketPrices}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PurchasePanel;
