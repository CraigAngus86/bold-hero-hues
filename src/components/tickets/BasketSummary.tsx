
import { ShoppingCart, AlertCircle, Trash2, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BasketItem } from './types';
import { formatDate } from './utils';

interface BasketSummaryProps {
  basket: BasketItem[];
  basketTotalItems: number;
  basketTotalPrice: number;
  removeFromBasket: (id: string) => void;
  onClose: () => void;
  getTicketTypeName: (type: string) => string;
}

const BasketSummary = ({
  basket,
  basketTotalItems,
  basketTotalPrice,
  removeFromBasket,
  onClose,
  getTicketTypeName
}: BasketSummaryProps) => {
  return (
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
            onClick={onClose}
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
              onClick={onClose}
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
  );
};

export default BasketSummary;
