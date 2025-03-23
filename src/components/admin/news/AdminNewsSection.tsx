
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import NewsForm from './NewsForm';
import NewsItem from './NewsItem';
import { NewsItem as NewsItemType, mockNews } from './types';

const AdminNewsSection = () => {
  const [news, setNews] = useState<NewsItemType[]>(mockNews);
  const [editingItem, setEditingItem] = useState<NewsItemType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<NewsItemType, 'id' | 'date'>>({
    title: '',
    summary: '',
    content: '',
    image: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStartEdit = (item: NewsItemType) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image || ''
    });
    setIsAdding(false);
  };
  
  const handleStartAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      image: ''
    });
    setIsAdding(true);
  };
  
  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };
  
  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      setNews(news.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData } 
          : item
      ));
      toast.success('News item updated successfully');
    } else {
      // Add new item
      const newItem: NewsItemType = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setNews([newItem, ...news]);
      toast.success('News item added successfully');
    }
    
    setEditingItem(null);
    setIsAdding(false);
  };
  
  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id));
    toast.success('News item deleted successfully');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">News Management</h2>
        {!isAdding && !editingItem && (
          <Button onClick={handleStartAdd} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add News
          </Button>
        )}
      </div>
      
      {(isAdding || editingItem) && (
        <NewsForm
          isEditing={!!editingItem}
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      
      <div className="space-y-4">
        {news.map(item => (
          <NewsItem 
            key={item.id}
            item={item}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminNewsSection;
