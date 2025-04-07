
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Filter, Eye, CheckCircle, XCircle, Trash2, Image, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { FanContent } from '@/types/fans';
import { toast } from 'sonner';

const mockFanContent: FanContent[] = [
  {
    id: '1',
    title: 'Match Day Experience',
    type: 'photo',
    submitted_by: 'John Smith',
    submitted_on: '2023-05-12T10:30:00',
    status: 'pending',
    featured: false,
    image_url: 'https://placehold.co/600x400/png',
  },
  {
    id: '2',
    title: 'My 30 Years Supporting Banks o\' Dee',
    type: 'story',
    submitted_by: 'Margaret Wilson',
    submitted_on: '2023-05-10T14:15:00',
    status: 'approved',
    featured: true,
    content: 'It all started in 1990 when my father took me to Spain Park for my first match...',
  },
  {
    id: '3',
    title: 'Youth Team Champions',
    type: 'photo',
    submitted_by: 'David Brown',
    submitted_on: '2023-05-09T09:45:00',
    status: 'approved',
    featured: false,
    image_url: 'https://placehold.co/600x400/png',
  },
  {
    id: '4',
    title: 'Away Day Adventures',
    type: 'story',
    submitted_by: 'Robert Johnson',
    submitted_on: '2023-05-08T16:20:00',
    status: 'rejected',
    featured: false,
    content: 'Following the team to away matches has led to some incredible adventures...',
  },
];

interface ModerateDialogProps {
  content: FanContent;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

const ModerateDialog = ({ content, onApprove, onReject }: ModerateDialogProps) => {
  const [notes, setNotes] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            Submitted by {content.submitted_by} on {content.submitted_on ? format(new Date(content.submitted_on), 'dd MMM yyyy') : 'Unknown date'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          {content.type === 'photo' && content.image_url && (
            <div className="flex justify-center mb-4">
              <img 
                src={content.image_url} 
                alt={content.title} 
                className="max-w-full max-h-[400px] object-contain rounded-md"
              />
            </div>
          )}
          {content.type === 'story' && content.content && (
            <div className="prose max-w-none">
              <p>{content.content}</p>
            </div>
          )}
          <div className="mt-4">
            <Label htmlFor="moderationNotes">Moderation Notes</Label>
            <Textarea 
              id="moderationNotes" 
              placeholder="Add notes about this content..." 
              className="mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onReject(content.id, notes)}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button onClick={() => onApprove(content.id, notes)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const FanZoneContent = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [content, setContent] = useState<FanContent[]>(mockFanContent);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newContent, setNewContent] = useState<Partial<FanContent>>({
    title: '',
    type: 'story',
    content: '',
    image_url: '',
    status: 'pending',
    featured: false,
  });

  const filteredContent = content.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const handleApprove = (id: string, notes: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, status: 'approved', moderation_notes: notes } : item
    ));
    toast.success('Content approved successfully');
  };

  const handleReject = (id: string, notes: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, status: 'rejected', moderation_notes: notes } : item
    ));
    toast.success('Content rejected');
  };

  const handleDelete = (id: string) => {
    setContent(content.filter(item => item.id !== id));
    toast.success('Content deleted');
  };

  const handleToggleFeatured = (id: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
    toast.success('Feature status updated');
  };

  const handleAddContent = () => {
    const newId = Math.max(...content.map(item => parseInt(item.id))) + 1;
    const newItem: FanContent = {
      id: String(newId),
      title: newContent.title || 'Untitled',
      type: newContent.type as string || 'story',
      submitted_by: 'Admin',
      submitted_on: new Date().toISOString(),
      status: 'pending',
      featured: false,
      ...(newContent.type === 'story' ? { content: newContent.content } : {}),
      ...(newContent.type === 'photo' ? { image_url: newContent.image_url } : {}),
    };
    
    setContent([newItem, ...content]);
    setShowAddDialog(false);
    setNewContent({
      title: '',
      type: 'story',
      content: '',
      image_url: '',
    });
    toast.success('New content added');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Fan Content</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Fan Content</DialogTitle>
                <DialogDescription>
                  Create new content for the fan zone
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newContent.title} 
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})} 
                    placeholder="Enter title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select 
                    value={newContent.type} 
                    onValueChange={(value) => setNewContent({...newContent, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newContent.type === 'story' && (
                  <div className="grid gap-2">
                    <Label htmlFor="content">Story Content</Label>
                    <Textarea 
                      id="content" 
                      value={newContent.content} 
                      onChange={(e) => setNewContent({...newContent, content: e.target.value})} 
                      placeholder="Write your story here..."
                      rows={5}
                    />
                  </div>
                )}
                {newContent.type === 'photo' && (
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input 
                      id="imageUrl" 
                      value={newContent.image_url} 
                      onChange={(e) => setNewContent({...newContent, image_url: e.target.value})} 
                      placeholder="Enter image URL"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddContent}>Add Content</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Content</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <p>No content found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <Card key={item.id} className={item.featured ? 'border-primary border-2' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{item.title}</CardTitle>
                      {getStatusBadge(item.status)}
                    </div>
                    <CardDescription className="flex items-center justify-between mt-1">
                      <span>By {item.submitted_by}</span>
                      <span className="text-xs text-gray-500">
                        {item.submitted_on ? format(new Date(item.submitted_on), 'dd MMM yyyy') : ''}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 overflow-hidden">
                      {item.type === 'photo' && item.image_url && (
                        <div className="flex justify-center h-full">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="h-full object-cover rounded-md"
                          />
                        </div>
                      )}
                      {item.type === 'story' && item.content && (
                        <div className="line-clamp-5 text-sm text-gray-700">
                          {item.content}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-gray-100">
                        {item.type === 'photo' ? (
                          <><Image className="h-3 w-3 mr-1" /> Photo</>
                        ) : (
                          <><PenLine className="h-3 w-3 mr-1" /> Story</>
                        )}
                      </Badge>
                      {item.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <div className="flex gap-1">
                      {item.status === 'pending' && (
                        <ModerateDialog 
                          content={item} 
                          onApprove={handleApprove} 
                          onReject={handleReject} 
                        />
                      )}
                      {item.status === 'approved' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFeatured(item.id)}
                        >
                          {item.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FanZoneContent;
