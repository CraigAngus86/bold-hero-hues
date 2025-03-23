
import { useState } from 'react';
import { Users, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Match } from './types';

interface TicketFormProps {
  selectedMatch: Match;
  ticketType: string;
  setTicketType: (type: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  email: string;
  setEmail: (email: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  totalPrice: number;
  addToBasket: () => void;
}

interface TicketOption {
  value: string;
  label: string;
  price: number;
}

const ticketOptions: TicketOption[] = [
  { value: "adult", label: "Adult", price: 10.00 },
  { value: "concession", label: "Concession - Over 65 / Student", price: 6.00 },
  { value: "under16", label: "Under 16", price: 3.00 },
  { value: "family", label: "Family - 2 Adults + 2 Under 16", price: 20.00 }
];

const TicketForm = ({
  selectedMatch,
  ticketType,
  setTicketType,
  quantity,
  setQuantity,
  email,
  setEmail,
  fullName,
  setFullName,
  totalPrice,
  addToBasket
}: TicketFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ticket Type
          </label>
          <RadioGroup value={ticketType} onValueChange={setTicketType} className="space-y-3">
            {ticketOptions.map((option) => (
              <div key={option.value} className="flex items-center justify-between border border-gray-200 p-3 rounded-md hover:border-team-blue/50 transition-colors">
                <div className="flex items-center">
                  <RadioGroupItem value={option.value} id={option.value} className="mr-3 text-team-blue" />
                  <label htmlFor={option.value} className="cursor-pointer font-medium">
                    {option.label}
                  </label>
                </div>
                <span className="font-bold text-team-blue">£{option.price.toFixed(2)}</span>
              </div>
            ))}
          </RadioGroup>
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
  );
};

export default TicketForm;
