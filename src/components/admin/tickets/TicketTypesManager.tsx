
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadgePound, Edit, Trash, Plus, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: 'adult' | 'concession' | 'child' | 'family' | 'special';
}

const mockTicketTypes: TicketType[] = [
  {
    id: '1',
    name: 'Adult Match Ticket',
    description: 'Standard adult entry to home matches',
    price: 10,
    available: true,
    category: 'adult',
  },
  {
    id: '2',
    name: 'Child Match Ticket',
    description: 'For children aged 5-16',
    price: 5,
    available: true,
    category: 'child',
  },
  {
    id: '3',
    name: 'Concession Ticket',
    description: 'For seniors and students with valid ID',
    price: 7,
    available: true,
    category: 'concession',
  },
  {
    id: '4',
    name: 'Family Ticket',
    description: '2 adults and 2 children',
    price: 25,
    available: true,
    category: 'family',
  }
];

const categoryColors = {
  adult: 'bg-blue-100 text-blue-800',
  concession: 'bg-purple-100 text-purple-800',
  child: 'bg-green-100 text-green-800',
  family: 'bg-amber-100 text-amber-800', 
  special: 'bg-red-100 text-red-800',
};

const TicketTypesManager: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(mockTicketTypes);

  const toggleAvailability = (id: string) => {
    setTicketTypes(types => types.map(type => 
      type.id === id ? { ...type, available: !type.available } : type
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Ticket Types</h2>
          <p className="text-gray-600">Manage ticket types and pricing.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Ticket Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ticketTypes.map(ticket => (
          <Card key={ticket.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ticket.name}</CardTitle>
                  <Badge className={`mt-1 ${categoryColors[ticket.category]}`}>
                    {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {ticket.available ? 
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check size={12} className="mr-1" /> Active
                    </Badge> :
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <X size={12} className="mr-1" /> Inactive
                    </Badge>
                  }
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{ticket.description}</p>
              <div className="mt-4">
                <p className="text-lg font-bold flex items-center">
                  <BadgePound size={18} className="mr-1 text-gray-700" />
                  {ticket.price.toFixed(2)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <Switch 
                checked={ticket.available}
                onCheckedChange={() => toggleAvailability(ticket.id)}
              />
              <div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit size={16} />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                  <Trash size={16} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>These are sample ticket types. In a future update, these will be stored in and retrieved from Supabase.</p>
      </div>
    </div>
  );
};

export default TicketTypesManager;
