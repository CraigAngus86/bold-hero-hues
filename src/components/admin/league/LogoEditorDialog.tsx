
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamStats } from '@/components/league/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface LogoEditorDialogProps {
  selectedTeam: TeamStats | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({ 
  selectedTeam, 
  isOpen, 
  onOpenChange,
  onSuccess
}) => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  
  // Reset logo URL when selected team changes
  useEffect(() => {
    setLogoUrl(selectedTeam?.logo || "");
  }, [selectedTeam]);
  
  const handleUpdateLogo = async () => {
    if (!selectedTeam || !logoUrl.trim()) return;
    
    try {
      // Check if the team has an id before attempting to update
      if (selectedTeam.id === undefined) {
        toast.error('Cannot update team without an ID');
        return;
      }
      
      const { error } = await supabase
        .from('highland_league_table')
        .update({ logo: logoUrl })
        .eq('id', selectedTeam.id);
      
      if (error) throw error;
      
      toast.success(`Updated logo for ${selectedTeam.team}`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Failed to update team logo');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Team Logo</DialogTitle>
        </DialogHeader>
        
        {selectedTeam && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <p className="font-medium">{selectedTeam.team}</p>
              {selectedTeam.logo && (
                <img 
                  src={selectedTeam.logo} 
                  alt={`${selectedTeam.team} current logo`} 
                  className="h-12 w-12 object-contain border border-gray-200 rounded-md p-1" 
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input 
                id="logoUrl" 
                placeholder="Enter logo URL" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
              />
              <p className="text-xs text-gray-500">
                Enter a URL to an image. Ideally a transparent PNG logo.
              </p>
            </div>
            
            {logoUrl && (
              <div className="border border-gray-200 rounded-md p-2">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img 
                  src={logoUrl} 
                  alt="Logo preview" 
                  className="h-12 w-12 object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100/gray/white?text=Error";
                  }}
                />
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpdateLogo}>Update Logo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
