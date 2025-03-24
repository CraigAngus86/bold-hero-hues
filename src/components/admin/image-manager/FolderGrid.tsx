
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { ImageFolder } from './ImageManagerContext';

interface FolderGridProps {
  folders: ImageFolder[];
  onFolderClick: (folder: ImageFolder) => void;
}

const FolderGrid = ({ folders, onFolderClick }: FolderGridProps) => {
  return (
    <>
      {folders.map(folder => (
        <Card 
          key={folder.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onFolderClick(folder)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Folder className="h-12 w-12 text-team-blue mb-2" />
            <span className="text-sm font-medium">{folder.name}</span>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FolderGrid;
