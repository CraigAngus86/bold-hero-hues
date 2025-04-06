import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TeamStats } from '@/types/fixtures';
import { useToast } from '@/components/ui/use-toast';
import { updateTeamLogo } from '@/services/leagueService';
import { useImageUpload } from '@/services/images/hooks';
import { Loader2 } from 'lucide-react';
import { BucketType } from '@/types/images';

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
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string>(team.logo || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    selectedFile,
    previewUrl,
    isUploading,
    progress,
    uploadFile,
    error 
  } = useImageUpload({
    bucket: BucketType.TEAMS,
    folderPath: 'logos',
    maxSize: 2 * 1024 * 1024 // 2MB
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const result = await uploadFile(file, {
        alt_text: `${team.team} team logo`
      });
      
      if (result.success && result.url) {
        setLogoUrl(result.url);
        toast({
          title: "Upload successful",
          description: "Logo uploaded successfully",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: error?.message || "Failed to upload logo",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!logoUrl) {
      toast({
        title: "No logo selected",
        description: "Please upload a logo image first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await updateTeamLogo(team.id?.toString() || '', logoUrl);
      
      if (success) {
        toast({
          title: "Logo updated",
          description: `Logo for ${team.team} has been updated`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        onOpenChange(false);
      } else {
        throw new Error('Failed to update team logo');
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update team logo",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Logo for {team.team}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo preview */}
            <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
              {logoUrl || previewUrl ? (
                <img 
                  src={previewUrl || logoUrl} 
                  alt={`${team.team} logo`} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm text-center">
                  No logo
                </div>
              )}
            </div>
            
            {/* File upload */}
            <div className="w-full">
              <label 
                htmlFor="logo-upload" 
                className="block w-full cursor-pointer text-center py-2 px-4 rounded border border-gray-300 hover:bg-gray-50"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading ({progress}%)
                  </span>
                ) : (
                  'Choose logo image'
                )}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: square PNG image, max 2MB
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isUploading || isSaving || !logoUrl}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Logo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
