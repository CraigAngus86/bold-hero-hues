
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ShopPreview: React.FC = () => {
  // Mock data - in a real implementation this would come from an API or database
  const shopItems: ShopItem[] = [
    {
      id: '1',
      name: '2024/25 Home Kit',
      price: 45,
      image: '/lovable-uploads/banks-o-dee-dark-logo.png',
      category: 'kits'
    },
    {
      id: '2',
      name: 'Training Jacket',
      price: 35,
      image: '/lovable-uploads/banks-o-dee-dark-logo.png',
      category: 'training'
    },
    {
      id: '3',
      name: 'Club Scarf',
      price: 15,
      image: '/lovable-uploads/banks-o-dee-dark-logo.png',
      category: 'accessories'
    },
    {
      id: '4',
      name: 'Beanie Hat',
      price: 12,
      image: '/lovable-uploads/banks-o-dee-dark-logo.png',
      category: 'accessories'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shop Items */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-team-blue">Club Shop</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shop" className="inline-flex items-center">
                  Visit Shop <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shopItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square bg-white flex items-center justify-center p-6">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="font-bold text-team-blue">£{item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button size="sm" className="w-full bg-team-blue hover:bg-team-blue/90">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Season Tickets */}
          <div>
            <Card className="overflow-hidden h-full">
              <div className="relative h-40">
                <img 
                  src="/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png" 
                  alt="Season Tickets" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <CardTitle className="text-white text-2xl">Season Tickets</CardTitle>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="mb-4 text-gray-600">
                  Support Banks o' Dee throughout the season with our 2024/25 season tickets. 
                  Get access to all home league matches and exclusive member benefits.
                </p>
                
                <h4 className="font-bold text-lg mb-2">Benefits include:</h4>
                <ul className="list-disc list-inside mb-6 space-y-1 text-gray-600">
                  <li>All home league matches</li>
                  <li>Priority cup tickets</li>
                  <li>10% discount at club shop</li>
                  <li>Free digital match programme</li>
                  <li>Exclusive members events</li>
                </ul>
                
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="text-2xl font-bold text-team-blue">£120</p>
                  </div>
                  
                  <Button asChild>
                    <Link to="/tickets/season-tickets">
                      Buy Now <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopPreview;
