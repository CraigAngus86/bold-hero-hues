
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Check, 
  X, 
  Filter, 
  Image, 
  FileText, 
  User, 
  Trash,
  Eye
} from 'lucide-react';
import { FanContent } from '@/types/fans';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Status badge styles
const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// Content type icons
const contentTypeIcons = {
  photo: Image,
  story: FileText,
  profile: User,
};

const FanZoneContent: React.FC = () => {
  const [content, setContent] = useState<FanContent[]>([
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
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContent, setSelectedContent] = useState<FanContent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Filter content based on search query and active tab
  const filteredContent = content.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submitted_by.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && item.status === 'pending';
    if (activeTab === 'approved') return matchesSearch && item.status === 'approved';
    if (activeTab === 'rejected') return matchesSearch && item.status === 'rejected';
    if (activeTab === 'featured') return matchesSearch && item.featured;
    
    return matchesSearch;
  });
  
  const handleApprove = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };
  
  const handleReject = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };
  
  const handleToggleFeatured = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };
  
  const handleDelete = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };
  
  const handleViewContent = (item: FanContent) => {
    setSelectedContent(item);
    setViewDialogOpen(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Fan Zone Content</h2>
          <p className="text-gray-600">Review and manage fan-submitted content</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search content..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-500">Title</th>
                      <th className="text-left p-4 font-medium text-gray-500">Type</th>
                      <th className="text-left p-4 font-medium text-gray-500">Submitted By</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500">Status</th>
                      <th className="text-center p-4 font-medium text-gray-500">Featured</th>
                      <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.length > 0 ? (
                      filteredContent.map((item) => {
                        const IconComponent = contentTypeIcons[item.type];
                        
                        return (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center">
                                <IconComponent size={16} className="mr-2 text-gray-500" />
                                <span>{item.title}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="capitalize">
                                {item.type}
                              </Badge>
                            </td>
                            <td className="p-4">{item.submitted_by}</td>
                            <td className="p-4">{new Date(item.submitted_on).toLocaleDateString()}</td>
                            <td className="p-4">
                              <Badge className={statusStyles[item.status as keyof typeof statusStyles]}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              {item.featured ? (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleToggleFeatured(item.id)}
                                  className="h-8 w-8 p-0 text-green-500"
                                >
                                  <Check size={16} />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleToggleFeatured(item.id)}
                                  className="h-8 w-8 p-0 text-gray-300"
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewContent(item)}
                                >
                                  <Eye size={16} />
                                </Button>
                                
                                {item.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-green-600"
                                      onClick={() => handleApprove(item.id)}
                                    >
                                      <Check size={16} />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-red-600"
                                      onClick={() => handleReject(item.id)}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </>
                                )}
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0 text-red-600"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No fan content found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>User-submitted content is managed through the fan content moderation system</p>
      </div>
      
      {/* Content View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedContent?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <Badge className={statusStyles[selectedContent?.status as keyof typeof statusStyles]}>
                  {selectedContent?.status.charAt(0).toUpperCase() + selectedContent?.status.slice(1)}
                </Badge>
                <span className="ml-2 text-sm text-gray-500">
                  Submitted by {selectedContent?.submitted_by} on {selectedContent && new Date(selectedContent.submitted_on).toLocaleDateString()}
                </span>
              </div>
              
              <Badge variant={selectedContent?.featured ? "secondary" : "outline"}>
                {selectedContent?.featured ? "Featured" : "Not Featured"}
              </Badge>
            </div>
            
            {selectedContent?.type === 'photo' && selectedContent.image_url && (
              <div className="overflow-hidden rounded-md">
                <img 
                  src={selectedContent.image_url} 
                  alt={selectedContent.title} 
                  className="w-full object-cover"
                />
              </div>
            )}
            
            {selectedContent?.type === 'story' && (
              <div className="prose max-w-none">
                <p>{selectedContent.content}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              {selectedContent?.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200"
                    onClick={() => {
                      handleReject(selectedContent.id);
                      setViewDialogOpen(false);
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-200"
                    onClick={() => {
                      handleApprove(selectedContent.id);
                      setViewDialogOpen(false);
                    }}
                  >
                    <Check size={16} className="mr-2" />
                    Approve
                  </Button>
                </>
              )}
              
              <Button 
                variant={selectedContent?.featured ? "destructive" : "default"}
                onClick={() => {
                  if (selectedContent) {
                    handleToggleFeatured(selectedContent.id);
                  }
                }}
              >
                {selectedContent?.featured ? "Unfeature Content" : "Feature Content"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FanZoneContent;
