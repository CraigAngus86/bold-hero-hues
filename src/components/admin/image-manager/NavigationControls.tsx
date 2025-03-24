
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useImageManager } from './ImageManagerContext';

const NavigationControls = () => {
  const { currentFolder, navigateUp } = useImageManager();

  if (!currentFolder) return null;

  return (
    <Button 
      variant="ghost" 
      onClick={navigateUp}
      className="mb-4 p-2 h-auto"
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      Back
    </Button>
  );
};

export default NavigationControls;
