
import React from 'react';
import { ImageMetadata } from '@/services/images';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface MediaEditFormProps {
  media: ImageMetadata;
  editedMedia: ImageMetadata;
  onFieldChange: (field: keyof ImageMetadata, value: any) => void;
  categories: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  handleTagKeyPress: (e: React.KeyboardEvent) => void;
}

const MediaEditForm: React.FC<MediaEditFormProps> = ({ 
  media,
  editedMedia,
  onFieldChange,
  categories,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  handleTagKeyPress
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="alt-text">Alt Text</Label>
        <Input
          id="alt-text"
          value={editedMedia.alt_text || ''}
          onChange={(e) => onFieldChange('alt_text', e.target.value)}
          placeholder="Describe the image for accessibility"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Helps with accessibility and SEO
        </p>
      </div>

      <div>
        <Label htmlFor="media-desc">Description</Label>
        <Textarea
          id="media-desc"
          value={editedMedia.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Add a detailed description"
          rows={3}
        />
      </div>

      {categories.length > 0 && (
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={editedMedia.categories ? editedMedia.categories[0] : ''}
            onValueChange={(value) => 
              onFieldChange('categories', value ? [value] : [])
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {editedMedia.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)} 
              />
            </Badge>
          ))}
          {(!editedMedia.tags || editedMedia.tags.length === 0) && (
            <span className="text-sm text-muted-foreground">No tags</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyPress}
            placeholder="Add a tag"
          />
          <Button 
            type="button" 
            size="icon" 
            onClick={addTag}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditForm;
