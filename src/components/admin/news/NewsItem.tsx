
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { NewsItem as NewsItemType } from './types';

interface NewsItemProps {
  item: NewsItemType;
  onEdit: (item: NewsItemType) => void;
  onDelete: (id: string) => void;
}

const NewsItem = ({ item, onEdit, onDelete }: NewsItemProps) => {
  return (
    <Card key={item.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {item.image && (
          <div className="w-full md:w-48 h-48 flex-shrink-0">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default NewsItem;
