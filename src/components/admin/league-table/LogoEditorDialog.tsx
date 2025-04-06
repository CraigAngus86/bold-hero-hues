
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/admin/common/ImageUploader';
import { updateTeamLogo } from '@/services/leagueService';
import { toast } from 'sonner';
import { BucketType } from '@/services/images/types';

interface LogoEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | null;
  teamName: string;
  existingLogo: string | null;
  onLogoUpdated: () => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
  existingLogo,
  onLogoUpdated
}) => {
  const [logoUrl, setLogoUrl] = useState(existingLogo || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (url: string) => {
    setLogoUrl(url);
  };

  const handleSave = async () => {
    if (!teamId) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateTeamLogo(teamId, logoUrl);
      
      if (success) {
        toast.success(`Logo updated for ${teamName}`);
        onLogoUpdated();
        onClose();
      } else {
        throw new Error('Failed to update team logo');
      }
    } catch (error) {
      console.error('Error updating team logo:', error);
      toast.error(`Error updating logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Team Logo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">{teamName}</h3>
            <p className="text-sm text-gray-500">Upload a new logo or provide a URL</p>
          </div>
          
          {existingLogo && (
            <div className="flex justify-center">
              <img 
                src={existingLogo} 
                alt={`${teamName} logo`}
                className="w-40 h-40 object-contain border rounded"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <ImageUploader
              bucket={BucketType.TEAMS}
              onUploadComplete={handleImageUpload}
              folderPath={`teams/${teamId}`}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
            
            <div className="text-center text-sm text-gray-500">
              or
            </div>
            
            <Input
              type="url"
              placeholder="Enter logo URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!logoUrl || isUploading || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Logo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
