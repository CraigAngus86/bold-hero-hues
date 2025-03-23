
import { Ticket, Phone } from 'lucide-react';

interface TicketPriceProps {
  type: string;
  price: number;
}

const TicketPrice = ({ type, price }: TicketPriceProps) => (
  <div className="flex justify-between items-center">
    <span className="font-medium">{type}</span>
    <span className="font-bold">£{price.toFixed(2)}</span>
  </div>
);

const TicketTypes = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-team-blue mb-4 flex items-center">
        <Ticket className="w-5 h-5 mr-2" />
        Ticket Information
      </h2>
      
      <div className="space-y-4">
        <TicketPrice type="Adult" price={10} />
        <TicketPrice type="Concession (Over 65 / Student)" price={6} />
        <TicketPrice type="Under 16" price={3} />
        <TicketPrice type="Family (2 Adults + 2 U16)" price={20} />
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-team-blue mr-2" />
          <span className="text-sm">Ticket Office: 01224 574295</span>
        </div>
      </div>
    </div>
  );
};

export default TicketTypes;
