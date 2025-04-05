
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, X, Save, Briefcase } from 'lucide-react';

const positionCategories = [
  {
    type: 'player',
    title: 'Player Positions',
    positions: [
      'Goalkeeper', 'Right Back', 'Left Back', 'Center Back',
      'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
      'Right Winger', 'Left Winger', 'Striker', 'Forward'
    ]
  },
  {
    type: 'management',
    title: 'Management Positions',
    positions: [
      'Head Coach', 'Assistant Coach', 'Goalkeeping Coach',
      'Fitness Coach', 'Performance Analyst', 'Youth Team Coach'
    ]
  },
  {
    type: 'official',
    title: 'Club Officials',
    positions: [
      'Chairman', 'President', 'Director', 'Secretary',
      'Commercial Director', 'Club Doctor', 'Physiotherapist'
    ]
  }
];

const PositionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('player');
  const [newPosition, setNewPosition] = useState('');
  const [positions, setPositions] = useState(positionCategories);

  const handleAddPosition = (type: string) => {
    if (!newPosition.trim()) return;
    
    setPositions(prev => prev.map(category => {
      if (category.type === type) {
        return {
          ...category,
          positions: [...category.positions, newPosition.trim()]
        };
      }
      return category;
    }));
    
    setNewPosition('');
  };

  const handleRemovePosition = (type: string, position: string) => {
    setPositions(prev => prev.map(category => {
      if (category.type === type) {
        return {
          ...category,
          positions: category.positions.filter(p => p !== position)
        };
      }
      return category;
    }));
  };

  const activeCategory = positions.find(p => p.type === activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase size={18} className="mr-2" /> Position Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="player" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="official">Officials</TabsTrigger>
          </TabsList>
          
          {positions.map(category => (
            <TabsContent key={category.type} value={category.type}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="New position name..." 
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button 
                    onClick={() => handleAddPosition(category.type)}
                    disabled={!newPosition.trim()}
                  >
                    <PlusCircle size={16} className="mr-2" /> Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {category.positions.map(position => (
                    <Badge key={position} variant="secondary" className="pl-3 pr-2 py-1.5">
                      {position}
                      <button 
                        onClick={() => handleRemovePosition(category.type, position)}
                        className="ml-1 text-gray-400 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="mr-2">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Note: These positions will be available for selection when adding team members.
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PositionsManager;
