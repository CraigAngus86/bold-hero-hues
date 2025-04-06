
import React from 'react';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { ImageFolder } from '@/types/images';
import { cn } from '@/lib/utils';

interface FolderTreeProps {
  folders: ImageFolder[];
  onFolderSelect: (folder: ImageFolder) => void;
  selectedFolder: ImageFolder | null;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  onFolderSelect,
  selectedFolder
}) => {
  // Organize folders into a tree structure
  const rootFolders = folders.filter(f => !f.parent_id);
  
  // Get child folders
  const getChildFolders = (parentId: string) => {
    return folders.filter(f => f.parent_id === parentId);
  };
  
  // Recursive folder rendering
  const renderFolder = (folder: ImageFolder, depth = 0) => {
    const childFolders = getChildFolders(folder.id);
    const hasChildren = childFolders.length > 0;
    const isSelected = selectedFolder?.id === folder.id;
    
    return (
      <div key={folder.id} className="mb-1">
        <div 
          className={cn(
            "flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100",
            isSelected ? "bg-blue-100 text-blue-800" : ""
          )}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={() => onFolderSelect(folder)}
        >
          {hasChildren ? (
            <ChevronRightIcon className="h-4 w-4 mr-1 text-gray-500" />
          ) : (
            <span className="w-5" />
          )}
          <FolderIcon className="h-4 w-4 mr-2 text-yellow-500" />
          <span className="text-sm truncate">{folder.name}</span>
        </div>
        
        {hasChildren && childFolders.map(child => renderFolder(child, depth + 1))}
      </div>
    );
  };
  
  return (
    <div className="space-y-1">
      {rootFolders.map(folder => renderFolder(folder))}
      
      {folders.length === 0 && (
        <div className="text-sm text-gray-500 p-2">No folders found</div>
      )}
    </div>
  );
};

export default FolderTree;
