
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useImageUploaderContext, ImageUploaderProvider } from '@/components/admin/common/image-uploader/ImageUploaderContext';
import { ImageUploader } from '@/components/admin/common/image-uploader';
import { BucketType } from '@/services/images/types';
import { leagueService } from '@/services/leagueService';
import { toast } from 'sonner';
import { TeamStats } from '@/types/fixtures';

export interface LogoEditorDialogProps {
  selectedTeam: TeamStats;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

function LogoEditorDialogContent() {
  const { previewUrl, isUploading } = useImageUploaderContext();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Team Logo</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <ImageUploader 
          inputId="team-logo-upload"
          aspectRatioClass="aspect-square" 
          allowMetadata={false}
          maxWidthClass="max-w-sm mx-auto"
        />
      </div>
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('cancel-button')?.click()}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={!previewUrl || isUploading || isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Logo'}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function LogoEditorDialog({
  selectedTeam,
  isOpen,
  onOpenChange,
  onSuccess
}: LogoEditorDialogProps) {
  const handleUploadComplete = async (imageUrl: string) => {
    try {
      const result = await leagueService.updateTeamLogo(selectedTeam.id, imageUrl);
      if (result) {
        toast.success('Logo updated successfully');
        onOpenChange(false);
        await onSuccess();
      } else {
        toast.error('Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error('Error occurred while updating logo');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <ImageUploaderProvider
          initialImageUrl={selectedTeam.logo || null}
          acceptedTypes="image/png,image/jpeg,image/svg+xml"
          maxSizeMB={2}
          onUploadComplete={handleUploadComplete}
          bucket={BucketType.IMAGES}
          folderPath="teams/logos"
          optimizationOptions={{
            maxWidth: 300,
            maxHeight: 300,
            quality: 90
          }}
        >
          <LogoEditorDialogContent />
        </ImageUploaderProvider>
      </DialogContent>
    </Dialog>
  );
}
