
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNewsStore, NewsItem, formatDate, getDbDateFormat } from '@/services/news';

const NewsManager = () => {
  const { toast } = useToast();
  const { news, addNews, updateNews, deleteNews } = useNewsStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  
  const openNewDialog = () => {
    setCurrentNews({
      id: 0, // This will be set by the store
      title: '',
      excerpt: '',
      image: '',
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      category: ''
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (newsItem: NewsItem) => {
    // Make sure we convert any display-formatted dates to YYYY-MM-DD
    const formattedNews = {
      ...newsItem,
      date: getDbDateFormat(newsItem.date)
    };
    setCurrentNews(formattedNews);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentNews(null);
  };
  
  const handleDelete = (id: number) => {
    deleteNews(id);
    toast({
      title: "News item deleted",
      description: "The news item has been successfully deleted."
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentNews) return;
    
    if (currentNews.id > 0) {
      // Update existing
      updateNews(currentNews);
      toast({
        title: "News updated",
        description: "The news item has been successfully updated."
      });
    } else {
      // Add new - id will be assigned in the store
      const { id, ...newsWithoutId } = currentNews;
      addNews(newsWithoutId);
      toast({
        title: "News added",
        description: "A new news item has been successfully added."
      });
    }
    
    closeDialog();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">News Items</h3>
        <Button onClick={openNewDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add News
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentNews?.id ? 'Edit News' : 'Add News'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={currentNews?.title || ''}
                  onChange={(e) => setCurrentNews(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right text-sm font-medium">Category</label>
                <Input
                  id="category"
                  value={currentNews?.category || ''}
                  onChange={(e) => setCurrentNews(prev => prev ? {...prev, category: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right text-sm font-medium">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={currentNews?.date || ''}
                  onChange={(e) => setCurrentNews(prev => prev ? {...prev, date: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  value={currentNews?.image || ''}
                  onChange={(e) => setCurrentNews(prev => prev ? {...prev, image: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="excerpt" className="text-right text-sm font-medium">Excerpt</label>
                <Textarea
                  id="excerpt"
                  value={currentNews?.excerpt || ''}
                  onChange={(e) => setCurrentNews(prev => prev ? {...prev, excerpt: e.target.value} : null)}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManager;
