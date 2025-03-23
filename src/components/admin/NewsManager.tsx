
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image?: string;
  author: string;
}

const NEWS_STORAGE_KEY = 'banks_o_dee_news';

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem(NEWS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    image: '',
    author: ''
  });
  
  const saveToLocalStorage = (data: NewsItem[]) => {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(data));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddNews = () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newItem: NewsItem = {
      ...formData,
      id: Date.now().toString()
    };
    
    const updatedNews = [...newsItems, newItem];
    setNewsItems(updatedNews);
    saveToLocalStorage(updatedNews);
    
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      image: '',
      author: ''
    });
    
    setIsAdding(false);
    toast.success('News item added successfully');
  };
  
  const handleStartEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      date: item.date,
      summary: item.summary,
      content: item.content,
      image: item.image || '',
      author: item.author
    });
  };
  
  const handleSaveEdit = (id: string) => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedNews = newsItems.map(item => 
      item.id === id ? { ...formData, id } : item
    );
    
    setNewsItems(updatedNews);
    saveToLocalStorage(updatedNews);
    setEditingId(null);
    toast.success('News item updated successfully');
  };
  
  const handleDelete = (id: string) => {
    const updatedNews = newsItems.filter(item => item.id !== id);
    setNewsItems(updatedNews);
    saveToLocalStorage(updatedNews);
    toast.success('News item deleted successfully');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      image: '',
      author: ''
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>News Manager</CardTitle>
        <CardDescription>Add, edit, or delete news articles for the website</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-end mb-6">
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add News</span>
            </Button>
          )}
        </div>
        
        {(isAdding || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">
              {editingId ? 'Edit News Item' : 'Add News Item'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Title*</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={formData.author} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="summary">Summary* (short description)</Label>
                  <Textarea 
                    id="summary" 
                    name="summary" 
                    value={formData.summary} 
                    onChange={handleInputChange} 
                    required 
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content*</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={formData.content} 
                    onChange={handleInputChange} 
                    required 
                    rows={8}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              {editingId ? (
                <Button onClick={() => handleSaveEdit(editingId)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button onClick={handleAddNews}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add News
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {newsItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No news items added yet.</p>
            </div>
          ) : (
            newsItems.map(item => (
              <Card key={item.id} className={editingId === item.id ? 'border-blue-500' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStartEdit(item)}
                        disabled={!!editingId}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={!!editingId}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    {item.author && <span>By: {item.author}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{item.summary}</p>
                  {item.image && (
                    <div className="mt-2">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="h-20 object-cover rounded" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Total news items: {newsItems.length}
        </p>
      </CardFooter>
    </Card>
  );
};

export default NewsManager;
