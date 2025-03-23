
import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Match } from './types';
import { Input } from "@/components/ui/input";

interface TicketQuantity {
  adult: number;
  concession: number;
  under16: number;
  family: number;
}

interface TicketFormProps {
  selectedMatch: Match;
  totalPrice: number;
  addToBasket: (quantities: TicketQuantity) => void;
  ticketPrices: Record<string, number>;
}

const TicketForm = ({
  selectedMatch,
  totalPrice,
  addToBasket,
  ticketPrices
}: TicketFormProps) => {
  const [quantities, setQuantities] = useState<TicketQuantity>({
    adult: 0,
    concession: 0,
    under16: 0,
    family: 0
  });

  const updateQuantity = (type: keyof TicketQuantity, value: number) => {
    setQuantities({
      ...quantities,
      [type]: Math.max(0, Math.min(10, value))
    });
  };

  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [type, quantity]) => {
      return total + (ticketPrices[type] * quantity);
    }, 0);
  };

  const handleAddToBasket = () => {
    if (Object.values(quantities).some(q => q > 0)) {
      addToBasket(quantities);
      // Reset quantities after adding to basket
      setQuantities({
        adult: 0,
        concession: 0,
        under16: 0,
        family: 0
      });
    }
  };

  const renderQuantitySelector = (type: keyof TicketQuantity, label: string, price: number) => {
    return (
      <div className="flex items-center justify-between border-b border-gray-100 py-3">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">£{price.toFixed(2)}</p>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(type, quantities[type] - 1)}
            disabled={quantities[type] <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 mx-2 text-center">
            <Input
              type="number"
              min="0"
              max="10"
              value={quantities[type]}
              onChange={(e) => updateQuantity(type, parseInt(e.target.value) || 0)}
              className="w-full text-center focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(type, quantities[type] + 1)}
            disabled={quantities[type] >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const total = calculateTotal();
  
  return (
    <>
      <div className="mt-4">
        {renderQuantitySelector('adult', 'Adult', ticketPrices.adult)}
        {renderQuantitySelector('concession', 'Concession - Over 65 / Student', ticketPrices.concession)}
        {renderQuantitySelector('under16', 'Under 16', ticketPrices.under16)}
        {renderQuantitySelector('family', 'Family - 2 Adults + 2 Under 16', ticketPrices.family)}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-xl text-team-blue">£{total.toFixed(2)}</span>
        </div>
        
        <Button
          className="w-full bg-team-blue text-white font-medium py-6 rounded-md hover:bg-team-lightBlue hover:text-team-blue transition-colors flex items-center justify-center"
          onClick={handleAddToBasket}
          disabled={total === 0}
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
  );
};

export default TicketForm;
