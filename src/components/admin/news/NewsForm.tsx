
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { NewsItem } from './types';

interface NewsFormProps {
  isEditing: boolean;
  formData: Omit<NewsItem, 'id' | 'date'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const NewsForm = ({ isEditing, formData, onInputChange, onSave, onCancel }: NewsFormProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit News Item' : 'Add News Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={onInputChange}
              placeholder="News title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <Input
              name="summary"
              value={formData.summary}
              onChange={onInputChange}
              placeholder="Brief summary (shown in previews)"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={onInputChange}
              placeholder="Full news content"
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
            <Input
              name="image"
              value={formData.image}
              onChange={onInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsForm;
