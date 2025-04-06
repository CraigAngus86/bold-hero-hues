
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CustomTable from '@/components/ui/CustomTable';
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

// Mock data for fan submitted content
const mockFanContent = [
  {
    id: '1',
    title: 'Match Day Experience',
    type: 'photo',
    submittedBy: 'John Smith',
    submittedOn: '2023-05-12T10:30:00',
    status: 'pending',
    featured: false,
  },
  {
    id: '2',
    title: 'My 30 Years Supporting Banks o\' Dee',
    type: 'story',
    submittedBy: 'Margaret Wilson',
    submittedOn: '2023-05-10T14:15:00',
    status: 'approved',
    featured: true,
  },
  {
    id: '3',
    title: 'Youth Team Champions',
    type: 'photo',
    submittedBy: 'David Brown',
    submittedOn: '2023-05-09T09:45:00',
    status: 'approved',
    featured: false,
  },
  {
    id: '4',
    title: 'Away Day Adventures',
    type: 'story',
    submittedBy: 'Robert Johnson',
    submittedOn: '2023-05-08T16:20:00',
    status: 'rejected',
    featured: false,
  },
];

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
  const [content, setContent] = useState(mockFanContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter content based on search query and active tab
  const filteredContent = content.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && item.status === 'pending';
    if (activeTab === 'approved') return matchesSearch && item.status === 'approved';
    if (activeTab === 'rejected') return matchesSearch && item.status === 'rejected';
    if (activeTab === 'featured') return matchesSearch && item.featured;
    
    return matchesSearch;
  });
  
  // Define table columns
  const columns = [
    { 
      key: 'title', 
      title: 'Title',
      render: (item: any) => {
        const IconComponent = contentTypeIcons[item.type as keyof typeof contentTypeIcons];
        return (
          <div className="flex items-center">
            <IconComponent size={16} className="mr-2 text-gray-500" />
            <span>{item.title}</span>
          </div>
        );
      }
    },
    { 
      key: 'type', 
      title: 'Type',
      render: (item: any) => (
        <Badge variant="outline" className="capitalize">
          {item.type}
        </Badge>
      )
    },
    { 
      key: 'submittedBy', 
      title: 'Submitted By' 
    },
    { 
      key: 'submittedOn', 
      title: 'Submitted On',
      render: (item: any) => new Date(item.submittedOn).toLocaleDateString()
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (item: any) => (
        <Badge className={statusStyles[item.status as keyof typeof statusStyles]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      title: 'Featured',
      render: (item: any) => (
        item.featured ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-gray-300" />
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (item: any) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Eye size={16} />
          </Button>
          {item.status === 'pending' && (
            <>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600">
                <Check size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                <X size={16} />
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
            <Trash size={16} />
          </Button>
        </div>
      )
    },
  ];
  
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
              <CustomTable
                columns={columns}
                data={filteredContent}
                noDataMessage="No fan content found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>This is a demonstration with sample content. In a future update, these will be stored in and retrieved from Supabase.</p>
      </div>
    </div>
  );
};

export default FanZoneContent;
