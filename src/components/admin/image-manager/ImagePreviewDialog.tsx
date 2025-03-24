
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Clipboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ open, onOpenChange, imageUrl }: ImagePreviewDialogProps) => {
  const { toast } = useToast();

  // Copy image URL to clipboard
  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL copied",
        description: "Image URL has been copied to clipboard."
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>Image Preview</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {imageUrl && (
          <div className="flex flex-col items-center">
            <div className="relative max-h-[60vh] overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-w-full h-auto"
              />
            </div>
            <div className="w-full flex items-center mt-4 bg-gray-100 rounded-md p-2">
              <Input 
                value={imageUrl} 
                readOnly 
                className="flex-grow bg-transparent border-none focus-visible:ring-0"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => copyImageUrl(imageUrl)}
                className="ml-2"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
