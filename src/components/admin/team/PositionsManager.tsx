
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, X, Save, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePositionsStore, PositionCategory, PositionItem } from '@/services/positionsService';

const PositionsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PositionCategory>('player');
  const [newPosition, setNewPosition] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { positions, loadPositions, savePositions, isLoading } = usePositionsStore();
  
  const [localPositions, setLocalPositions] = useState<PositionItem[]>([]);
  
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);
  
  useEffect(() => {
    setLocalPositions(positions);
  }, [positions]);

  const handleAddPosition = () => {
    if (!newPosition.trim()) return;
    
    const newPositionItem: PositionItem = {
      id: crypto.randomUUID(),
      name: newPosition.trim(),
      category: activeTab
    };
    
    setLocalPositions([...localPositions, newPositionItem]);
    setNewPosition('');
  };

  const handleRemovePosition = (id: string) => {
    setLocalPositions(localPositions.filter(p => p.id !== id));
  };
  
  const handleSavePositions = async () => {
    try {
      setIsSaving(true);
      await savePositions(localPositions);
    } finally {
      setIsSaving(false);
    }
  };

  const positionsByCategory = localPositions.filter(p => p.category === activeTab);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase size={18} className="mr-2" /> Position Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="player" value={activeTab} onValueChange={(value) => setActiveTab(value as PositionCategory)}>
          <TabsList className="mb-6">
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="official">Officials</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="New position name..." 
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="max-w-xs"
              />
              <Button 
                onClick={handleAddPosition}
                disabled={!newPosition.trim()}
              >
                <PlusCircle size={16} className="mr-2" /> Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {positionsByCategory.map(position => (
                <Badge key={position.id} variant="secondary" className="pl-3 pr-2 py-1.5">
                  {position.name}
                  <button 
                    onClick={() => handleRemovePosition(position.id)}
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleSavePositions} 
              disabled={isSaving}
              className="mr-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Note: These positions will be available for selection when adding team members.
            </p>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PositionsManager;
