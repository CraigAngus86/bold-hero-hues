
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageMetadata } from '@/services/images/types';

interface MediaEditFormProps {
  media: ImageMetadata;
  editedMedia: ImageMetadata;
  onFieldChange: (field: keyof ImageMetadata, value: any) => void;
  categories?: string[];
  newTag: string;
  setNewTag: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  handleTagKeyPress: (e: React.KeyboardEvent) => void;
}

const MediaEditForm: React.FC<MediaEditFormProps> = ({
  media,
  editedMedia,
  onFieldChange,
  categories = [],
  newTag,
  setNewTag,
  addTag,
  removeTag,
  handleTagKeyPress
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input 
          value={editedMedia.name || ''} 
          onChange={(e) => onFieldChange('name', e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Alt Text</label>
        <Input 
          value={editedMedia.alt_text || ''} 
          onChange={(e) => onFieldChange('alt_text', e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={editedMedia.description || ''} 
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge 
              key={category}
              variant={editedMedia.categories?.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const current = editedMedia.categories || [];
                const updated = current.includes(category)
                  ? current.filter(c => c !== category)
                  : [...current, category];
                onFieldChange('categories', updated);
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {editedMedia.tags?.map(tag => (
            <Badge 
              key={tag}
              variant="secondary"
              className="gap-1"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1">
                ×
              </button>
            </Badge>
          ))}
          
          {(editedMedia.tags?.length || 0) === 0 && (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder="Add a tag"
          />
          <Button type="button" onClick={addTag}>Add</Button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditForm;
