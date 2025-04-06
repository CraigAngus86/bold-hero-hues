
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUploader } from '@/components/common/ImageUploader';
import { TeamStats } from '@/types/fixtures';
import { leagueService } from '@/services/leagueService';
import { toast } from "sonner";
import { BucketType } from '@/types/storage';

interface LogoEditorDialogProps {
  team: TeamStats;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
  team,
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(team.logo || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveLogo = async () => {
    try {
      setIsSaving(true);
      const success = await leagueService.updateTeamLogo(team.id || '', logoUrl);
      
      if (success) {
        toast.success(`Logo updated for ${team.team}`);
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error("Failed to update team logo");
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      toast.error("An error occurred while updating the logo");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUploadComplete = (url: string) => {
    setLogoUrl(url);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Team Logo</DialogTitle>
          <DialogDescription>
            Upload a new logo for {team.team}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {logoUrl && (
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-500">Current Logo:</p>
                <div className="w-20 h-20 flex items-center justify-center border rounded-md p-2 bg-gray-50">
                  <img
                    src={logoUrl}
                    alt={`${team.team} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <ImageUploader
              bucket={BucketType.TEAMS}
              onUploadComplete={handleUploadComplete}
              folderPath={`teams`}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveLogo}
            disabled={isSaving || isUploading || !logoUrl}
          >
            {isSaving ? 'Saving...' : 'Save Logo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
