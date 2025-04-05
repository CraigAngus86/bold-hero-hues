
import React from 'react';
import { Tag, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useImageUploaderContext } from './ImageUploaderContext';

export const MetadataFields: React.FC = () => {
  const {
    altText,
    setAltText,
    imageDescription,
    setImageDescription,
    imageTags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyDown
  } = useImageUploaderContext();

  return (
    <div className="mt-4 space-y-3">
      <div>
        <Label htmlFor="alt-text">Alt Text</Label>
        <Input
          id="alt-text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={imageDescription}
          onChange={(e) => setImageDescription(e.target.value)}
          placeholder="Additional description (optional)"
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tags and press Enter"
            className="flex-grow"
          />
          <Button 
            type="button" 
            variant="outline" 
            className="ml-2"
            onClick={handleAddTag}
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
        
        {imageTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {imageTags.map((tag, index) => (
              <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
