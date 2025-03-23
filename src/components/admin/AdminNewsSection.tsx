
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  date: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Banks o\' Dee secure vital win against Formartine United',
    summary: 'A convincing 3-1 victory at Spain Park keeps the team in title contention',
    content: 'Banks o\' Dee delivered an impressive performance against Formartine United on Saturday, securing a vital 3-1 win at Spain Park. The victory keeps the team firmly in the title race as they look to challenge for Highland League honors this season.',
    image: '/lovable-uploads/banks-o-dee-logo.png',
    date: '2023-09-23'
  },
  {
    id: '2',
    title: 'Youth Development Program Expansion',
    summary: 'Club announces expansion of youth development program with new age groups',
    content: 'Banks o\' Dee FC is proud to announce the expansion of our youth development program, which will now include additional age groups and enhanced training facilities. This initiative demonstrates our commitment to developing local talent and building a sustainable future for the club.',
    date: '2023-09-15'
  }
];

const AdminNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<NewsItem, 'id' | 'date'>>({
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
  
  const handleStartEdit = (item: NewsItem) => {
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
      const newItem: NewsItem = {
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit News Item' : 'Add News Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="News title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <Input
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary (shown in previews)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {news.map(item => (
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
                      onClick={() => handleStartEdit(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
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
      ))}
    </div>
  );
};

export default AdminNewsSection;
