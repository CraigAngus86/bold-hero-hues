
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useImageManager } from './ImageManagerContext';

const NavigationControls: React.FC = () => {
  const { navigateUp, currentFolder } = useImageManager();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={navigateUp}
        disabled={!currentFolder || !currentFolder.parent_id}
        className="flex items-center"
      >
        <ChevronUp className="mr-1 h-4 w-4" />
        Up
      </Button>
    </div>
  );
};

export default NavigationControls;
