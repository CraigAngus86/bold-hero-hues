// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, Save, Loader2, X } from 'lucide-react';
import { imageUploadService } from '@/services/images/api';
import { logEvent } from '@/services/logs/systemLogsService';

interface LogoEditorDialogProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  currentLogoUrl?: string;
  onLogoUpdated: (newLogoUrl: string) => void;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({ open, onClose, teamId, currentLogoUrl, onLogoUpdated }) => {
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl || '');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLogoUrl(currentLogoUrl || '');
    setPreviewUrl(currentLogoUrl || null);
  }, [currentLogoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleUpload = async () => {
    if (!newLogo) {
      toast.error('Please select a logo to upload.');
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await imageUploadService.uploadTeamLogo(teamId, newLogo);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      const newLogoUrl = imageUploadService.getTeamLogoUrl(teamId, newLogo.name);
      setLogoUrl(newLogoUrl);
      setPreviewUrl(newLogoUrl);
      onLogoUpdated(newLogoUrl);
      toast.success('Logo uploaded successfully!');
      logEvent('info', `Logo uploaded for team ${teamId}`, 'LogoEditorDialog');
      setIsDirty(false);
    } catch (error: any) {
      console.error('Logo upload failed:', error);
      toast.error(`Logo upload failed: ${error.message}`);
      logEvent('error', `Logo upload failed for team ${teamId}: ${error.message}`, 'LogoEditorDialog');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setNewLogo(null);
    setPreviewUrl(null);
    setLogoUrl('');
    onLogoUpdated('');
    setIsDirty(true);
  };

  const handleSaveUrl = () => {
    onLogoUpdated(logoUrl);
    setPreviewUrl(logoUrl);
    setIsDirty(false);
    toast.success('Logo URL updated successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Team Logo</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div>
              <Label htmlFor="newLogo">
                New Logo
              </Label>
              <Input
                id="newLogo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="logoUrl">
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="Enter logo URL"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setIsDirty(true);
                }}
              />
            </div>
          </div>

          <div className="flex justify-center">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Team Logo Preview"
                  className="rounded-md object-cover"
                  style={{ width: '200px', height: '200px' }}
                  width={200}
                  height={200}
                />
                {newLogo && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">No logo preview</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {newLogo ? (
            <Button type="button" onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleSaveUrl} disabled={uploading || !isDirty}>
              <Save className="mr-2 h-4 w-4" />
              Save URL
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
