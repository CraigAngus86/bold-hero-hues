import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { getSponsorCategories } from '@/services/sponsorsService';
import { toast } from 'sonner';

const SponsorsSettings: React.FC = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['sponsorCategories'],
    queryFn: async () => {
      const response = await getSponsorCategories();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load categories');
      }
      return response.data;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sponsors Display Settings</CardTitle>
        <CardContent>
          Configure how sponsors are displayed on the website.
        </CardContent>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="homepage-visibility">Homepage Visibility</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="homepage-visibility" defaultChecked />
              <span>Show sponsors on the homepage</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="sponsors-page-layout">Sponsors Page Layout</Label>
            <Input id="sponsors-page-layout" placeholder="Grid or List" disabled />
          </div>
          
          <div>
            <Label htmlFor="category-order">Category Order</Label>
            <Input id="category-order" placeholder="Drag and drop to reorder" disabled />
          </div>
        </div>
        
        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default SponsorsSettings;
