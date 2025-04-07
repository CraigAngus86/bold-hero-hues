
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';
import systemLogsService from '@/services/logs/systemLogsService';

export interface LogoEditorDialogProps {
  teamId: string;
  teamName: string;
  currentLogo?: string;
  onLogoUpdated: (newLogoUrl: string) => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
  teamId,
  teamName,
  currentLogo,
  onLogoUpdated
}) => {
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // In a real implementation, you would upload the file to your storage
      // For now, we're just using the URL directly
      
      // Update the team logo in the database
      // In this mock version, we're just going to show a success message
      // and pass the new URL back to the parent component
      
      // Here we would normally call a service to update the logo
      // Example: await updateTeamLogo(teamId, logoUrl);
      
      // Notify parent component of the change
      onLogoUpdated(logoUrl);
      
      // Show success message
      toast.success(`Logo updated for ${teamName}`);
      
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Failed to update logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Image className="h-4 w-4 mr-2" />
          Edit Logo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Team Logo</DialogTitle>
          <DialogDescription>
            Enter a URL for the team logo or upload a new image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          {logoUrl && (
            <div className="flex justify-center my-2">
              <img 
                src={logoUrl} 
                alt={`${teamName} logo preview`} 
                className="max-h-20 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image';
                }}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label>Or upload a file</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                className="flex-1"
                onChange={(e) => {
                  // In a real implementation, this would upload to your storage
                  // For now, just mock it with a local URL
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    
                    // Create a mock URL (this would normally be a response from your upload service)
                    const mockUrl = URL.createObjectURL(file);
                    setLogoUrl(mockUrl);
                  }
                }}
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isUploading || !logoUrl}
          >
            {isUploading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
