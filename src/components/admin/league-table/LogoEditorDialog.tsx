
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Image } from "lucide-react";
import systemLogsService from "@/services/logs/systemLogsService";

interface LogoEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamId: string;
  currentLogo?: string;
  onLogoUpdated: (newLogoUrl: string) => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
  open,
  onOpenChange,
  teamName,
  teamId,
  currentLogo,
  onLogoUpdated
}) => {
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logoUrl.trim()) {
      toast.error("Please enter a logo URL");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the logo URL
      const result = await systemLogsService.updateTeamLogo(teamId, logoUrl);
      
      if (result.success) {
        onLogoUpdated(logoUrl);
        toast.success(`Logo updated for ${teamName}`);
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update logo");
      }
    } catch (error) {
      console.error("Error updating logo:", error);
      toast.error("An error occurred while updating the logo");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Team Logo</DialogTitle>
            <DialogDescription>
              Set a new logo URL for {teamName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            {logoUrl && (
              <div className="flex items-center justify-center p-2 border rounded">
                <img 
                  src={logoUrl}
                  alt={`${teamName} logo preview`}
                  className="max-h-20 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/60x60/gray/white?text=No+Image";
                  }}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Update Logo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
