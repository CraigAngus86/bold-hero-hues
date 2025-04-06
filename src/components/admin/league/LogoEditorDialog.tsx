
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamStats } from '@/types/fixtures';
import { updateTeamLogo } from '@/services/leagueService';
import { toast } from 'sonner';

interface LogoEditorDialogProps {
  team: TeamStats; // Renamed from selectedTeam for clarity
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
  team,
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [logoUrl, setLogoUrl] = useState(team?.logo || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleLogoUpdate = async () => {
    try {
      setIsUpdating(true);
      
      if (!team?.id) {
        throw new Error('Team ID is required');
      }
      
      const success = await updateTeamLogo(team.id.toString(), logoUrl);
      
      if (success) {
        toast.success(`Logo updated for ${team.team}`);
        await onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('An error occurred while updating the logo');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Logo</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="text-center mb-4">
            <div className="font-bold text-lg">{team?.team}</div>
            <div className="text-sm text-gray-500">Position: {team?.position}</div>
          </div>
          
          <div className="flex justify-center mb-4">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${team?.team} logo`} 
                className="h-24 w-24 object-contain border rounded p-2"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded border">
                No logo
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input 
              id="logoUrl" 
              placeholder="https://example.com/logo.png" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter a direct URL to the team's logo image
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleLogoUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Logo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
