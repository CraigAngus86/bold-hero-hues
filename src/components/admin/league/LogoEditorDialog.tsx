import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useLeagueStore } from '@/services/leagueService';
import { UploadCloud, Check, X } from 'lucide-react';

interface LogoEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leagueId: string;
  currentLogoUrl?: string;
}

const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({ isOpen, onClose, leagueId, currentLogoUrl }) => {
  const { updateLeagueLogo } = useLeagueStore();
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewLogoFile(file);
    const imageUrl = URL.createObjectURL(file);
    setLogoUrl(imageUrl);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setNewLogoFile(null);
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      if (newLogoFile) {
        // Simulate upload process
        setUploadProgress(50);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing delay

        // Here, you would typically upload the file to a storage service
        // and get the URL of the uploaded file.
        // For this example, we'll just use a placeholder URL.
        const uploadedLogoUrl = 'https://example.com/uploaded-logo.png';

        await updateLeagueLogo(leagueId, uploadedLogoUrl);
        toast({
          title: "Logo updated",
          description: "The league logo has been successfully updated."
        });
        onClose();
      } else {
        // If no new file is selected, but there's a current logo URL, save it
        if (logoUrl) {
          await updateLeagueLogo(leagueId, logoUrl);
          toast({
            title: "Logo updated",
            description: "The league logo has been successfully updated."
          });
          onClose();
        } else {
          toast({
            title: "No logo selected",
            description: "Please select a logo to upload.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error updating logo:", error);
      toast({
        title: "Error updating logo",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit League Logo</DialogTitle>
          <DialogDescription>
            Upload a new logo for the league.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              League Logo
            </Label>
            <div className="col-span-3">
              {logoUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="League Logo"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 rounded-full shadow-md"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove logo</span>
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <UploadCloud className="mx-auto h-6 w-6 text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload
                  </p>
                </div>
              )}
              <Input
                type="file"
                id="logo"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo')?.click()}
                disabled={isUploading}
              >
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Select Logo'}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoEditorDialog;
