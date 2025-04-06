
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  CalendarIcon, 
  MapPin, 
  Users, 
  CalendarCheck, 
  Hand, 
  FileText, 
  Image as ImageIcon,
  Pencil,
  Trash2,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { CommunityInitiative } from '@/types/fans';
import DataTable from '@/components/admin/common/DataTable';

// Mock data for development
const mockInitiatives = [
  {
    id: '1',
    title: 'Youth Football Camp',
    type: 'youth',
    date: '2023-07-15T10:00:00Z',
    location: 'Spain Park Training Fields',
    status: 'upcoming',
    volunteers: 8,
    participants: 45,
    description: 'A week-long football camp for young players aged 7-14, focusing on skills development and team building.',
    impact: 'Provides high-quality football coaching to local youth and promotes community engagement with the club.',
    images: [
      '/placeholder.svg',
      '/placeholder.svg'
    ]
  },
  {
    id: '2',
    title: 'Food Bank Collection',
    type: 'charity',
    date: '2023-05-20T14:00:00Z',
    location: 'Spain Park Stadium',
    status: 'upcoming',
    volunteers: 12,
    participants: 0,
    description: 'Match day food collection for the local food bank. Fans are encouraged to bring non-perishable food items.',
    impact: 'Supporting families in need within our local community and raising awareness of food poverty issues.',
    images: []
  },
  {
    id: '3',
    title: 'School Visits Program',
    type: 'education',
    date: '2023-04-10T09:00:00Z',
    location: 'Various Aberdeen Schools',
    status: 'completed',
    volunteers: 6,
    participants: 450,
    description: 'Players and staff visiting local schools to promote physical activity and healthy lifestyles.',
    impact: 'Engaged with over 450 children across 5 local schools, promoting both education and physical activity.',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ]
  },
];

const typeLabels = {
  youth: { label: 'Youth', color: 'bg-blue-100 text-blue-800' },
  charity: { label: 'Charity', color: 'bg-pink-100 text-pink-800' },
  education: { label: 'Education', color: 'bg-purple-100 text-purple-800' },
  community: { label: 'Community', color: 'bg-green-100 text-green-800' }
};

const statusLabels = {
  upcoming: { label: 'Upcoming', color: 'bg-amber-100 text-amber-800' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' }
};

const VolunteerList = ({ volunteers }) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Volunteers ({volunteers.length})</h3>
      <div className="border rounded-md overflow-hidden">
        {volunteers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{volunteer.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>{volunteer.email}</div>
                    {volunteer.phone && <div className="text-sm text-gray-500">{volunteer.phone}</div>}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{volunteer.role || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Badge variant={
                      volunteer.status === 'confirmed' ? 'default' : 
                      volunteer.status === 'attended' ? 'success' : 
                      volunteer.status === 'no_show' ? 'destructive' : 'outline'
                    }>
                      {volunteer.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">No volunteers registered yet</div>
        )}
      </div>
    </div>
  );
};

const GalleryUploader = ({ images, onAddImage, onRemoveImage }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAddImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Photo Gallery ({images.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img 
              src={image} 
              alt={`Initiative photo ${index + 1}`} 
              className="h-40 w-full object-cover rounded-md"
            />
            <button 
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemoveImage(index)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4">
          <ImageIcon size={24} className="text-gray-400 mb-2" />
          <Input 
            value={newImageUrl} 
            onChange={(e) => setNewImageUrl(e.target.value)} 
            placeholder="Image URL"
            className="mb-2"
          />
          <Button variant="outline" size="sm" onClick={handleAddImage}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};

const CommunityInitiatives = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [initiatives, setInitiatives] = useState(mockInitiatives);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInitiative, setCurrentInitiative] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  
  // New initiative form state
  const [newInitiative, setNewInitiative] = useState({
    title: '',
    type: 'youth',
    date: null,
    end_date: null,
    location: '',
    description: '',
    impact_summary: ''
  });
  
  // Add a new volunteer form state
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  
  // Mock loading volunteers for an initiative
  const loadVolunteers = (initiativeId) => {
    // This would be replaced with a real API call
    const mockVolunteers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '01234 567890',
        role: 'Coach',
        status: 'confirmed'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: null,
        role: 'Assistant',
        status: 'registered'
      },
      {
        id: '3',
        name: 'David Williams',
        email: 'david.w@example.com',
        phone: '07700 900123',
        role: null,
        status: 'attended'
      }
    ];
    
    setVolunteers(mockVolunteers);
  };
  
  // Handle view initiative details
  const handleViewInitiative = (initiative) => {
    setCurrentInitiative(initiative);
    loadVolunteers(initiative.id);
    setIsViewDialogOpen(true);
  };
  
  // Handle create initiative
  const handleCreateInitiative = () => {
    if (!validateForm()) return;
    
    // In a real implementation, we would save to the database
    const newItem = {
      id: Date.now().toString(),
      ...newInitiative,
      status: 'upcoming',
      volunteers: 0,
      participants: 0,
      impact: newInitiative.impact_summary,
      images: []
    };
    
    setInitiatives([newItem, ...initiatives]);
    toast.success('Initiative created successfully');
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Validate the form
  const validateForm = () => {
    if (!newInitiative.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (!newInitiative.date) {
      toast.error('Date is required');
      return false;
    }
    
    if (!newInitiative.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    
    if (!newInitiative.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    
    return true;
  };
  
  // Reset the form
  const resetForm = () => {
    setNewInitiative({
      title: '',
      type: 'youth',
      date: null,
      end_date: null,
      location: '',
      description: '',
      impact_summary: ''
    });
  };
  
  // Add volunteer
  const handleAddVolunteer = () => {
    if (!newVolunteer.name.trim() || !newVolunteer.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    
    // In a real implementation, we would save to the database
    const volunteer = {
      id: Date.now().toString(),
      ...newVolunteer,
      status: 'registered'
    };
    
    setVolunteers([...volunteers, volunteer]);
    setNewVolunteer({
      name: '',
      email: '',
      phone: '',
      role: ''
    });
    
    toast.success('Volunteer added successfully');
  };
  
  // Add photo to gallery
  const handleAddImage = (imageUrl) => {
    setCurrentInitiative({
      ...currentInitiative,
      images: [...currentInitiative.images, imageUrl]
    });
    toast.success('Photo added successfully');
  };
  
  // Remove photo from gallery
  const handleRemoveImage = (index) => {
    const updatedImages = [...currentInitiative.images];
    updatedImages.splice(index, 1);
    setCurrentInitiative({
      ...currentInitiative,
      images: updatedImages
    });
    toast.success('Photo removed successfully');
  };
  
  // Filter initiatives based on activeTab and searchQuery
  const filteredInitiatives = initiatives.filter(initiative => {
    // Filter by tab
    if (activeTab === 'all') {
      // No filter
    } else if (activeTab === 'upcoming') {
      if (initiative.status !== 'upcoming') return false;
    } else if (activeTab === 'active') {
      if (initiative.status !== 'active') return false;
    } else if (activeTab === 'completed') {
      if (initiative.status !== 'completed') return false;
    } else if (activeTab === 'charity') {
      if (initiative.type !== 'charity') return false;
    } else if (activeTab === 'youth') {
      if (initiative.type !== 'youth') return false;
    } else if (activeTab === 'education') {
      if (initiative.type !== 'education') return false;
    } else if (activeTab === 'community') {
      if (initiative.type !== 'community') return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             initiative.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  // Column definitions for the data table
  const columns = [
    { 
      key: 'title', 
      header: 'Initiative',
      cell: (initiative) => (
        <div>
          <div className="font-medium">{initiative.title}</div>
          <div className="flex items-center mt-1">
            <Badge className={typeLabels[initiative.type]?.color || 'bg-gray-100'} variant="secondary">
              {typeLabels[initiative.type]?.label || initiative.type}
            </Badge>
            <Badge className="ml-2" variant="outline">
              {statusLabels[initiative.status]?.label || initiative.status}
            </Badge>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'schedule',
      header: 'Schedule',
      cell: (initiative) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-700">
            <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
            {new Date(initiative.date).toLocaleDateString()}
          </div>
          <div className="flex items-center mt-1 text-gray-600">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            {initiative.location}
          </div>
        </div>
      )
    },
    {
      key: 'stats',
      header: 'Participation',
      cell: (initiative) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Hand className="h-4 w-4 mr-1.5 text-blue-600" />
            <span>{initiative.volunteers} volunteers</span>
          </div>
          {initiative.participants > 0 && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-green-600" />
              <span>{initiative.participants} participants</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (initiative) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewInitiative(initiative)}
          >
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Community Initiatives</h2>
          <p className="text-gray-600">Manage community events, programs, and activities</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search initiatives..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Create Initiative</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Community Initiative</DialogTitle>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newInitiative.title}
                      onChange={(e) => setNewInitiative({...newInitiative, title: e.target.value})}
                      className="mt-1"
                      placeholder="Enter initiative title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newInitiative.type}
                      onValueChange={(value) => setNewInitiative({...newInitiative, type: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youth">Youth</SelectItem>
                        <SelectItem value="charity">Charity</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <div className="mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newInitiative.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newInitiative.date ? format(new Date(newInitiative.date), "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newInitiative.date ? new Date(newInitiative.date) : undefined}
                            onSelect={(date) => setNewInitiative({...newInitiative, date: date?.toISOString()})}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newInitiative.location}
                      onChange={(e) => setNewInitiative({...newInitiative, location: e.target.value})}
                      className="mt-1"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newInitiative.description}
                    onChange={(e) => setNewInitiative({...newInitiative, description: e.target.value})}
                    className="mt-1"
                    placeholder="Describe the initiative"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="impact">Expected Impact / Outcomes</Label>
                  <Textarea
                    id="impact"
                    value={newInitiative.impact_summary}
                    onChange={(e) => setNewInitiative({...newInitiative, impact_summary: e.target.value})}
                    className="mt-1"
                    placeholder="Describe the expected impact or outcomes"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInitiative}>
                  Create Initiative
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="youth">Youth</TabsTrigger>
          <TabsTrigger value="charity">Charity</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-2">
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredInitiatives}
                noDataMessage="No initiatives found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Initiative Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {currentInitiative && (
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {currentInitiative.title}
                <Badge className={typeLabels[currentInitiative.type]?.color || 'bg-gray-100'} variant="secondary">
                  {typeLabels[currentInitiative.type]?.label || currentInitiative.type}
                </Badge>
                <Badge className="ml-2" variant={
                  currentInitiative.status === 'upcoming' ? 'outline' :
                  currentInitiative.status === 'active' ? 'default' : 'secondary'
                }>
                  {currentInitiative.status.charAt(0).toUpperCase() + currentInitiative.status.slice(1)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="py-2">
                <div className="flex flex-wrap gap-y-2 items-center text-sm text-gray-700 mb-4">
                  <div className="flex items-center mr-4">
                    <CalendarCheck size={16} className="mr-1" />
                    <span>{new Date(currentInitiative.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>{currentInitiative.location}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500 text-sm">Volunteers</p>
                      <p className="text-3xl font-bold">{currentInitiative.volunteers}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500 text-sm">Participants</p>
                      <p className="text-3xl font-bold">{currentInitiative.participants}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500 text-sm">Photos</p>
                      <p className="text-3xl font-bold">{currentInitiative.images?.length || 0}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{currentInitiative.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Impact / Outcomes</h3>
                    <p className="text-gray-700">{currentInitiative.impact}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <VolunteerList volunteers={volunteers} />
                    
                    <Card className="mt-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Add New Volunteer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="vol-name">Name</Label>
                            <Input
                              id="vol-name"
                              value={newVolunteer.name}
                              onChange={(e) => setNewVolunteer({...newVolunteer, name: e.target.value})}
                              className="mt-1"
                              placeholder="Enter volunteer name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vol-email">Email</Label>
                            <Input
                              id="vol-email"
                              value={newVolunteer.email}
                              onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                              className="mt-1"
                              placeholder="Enter volunteer email"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vol-phone">Phone (Optional)</Label>
                            <Input
                              id="vol-phone"
                              value={newVolunteer.phone}
                              onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                              className="mt-1"
                              placeholder="Enter volunteer phone"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vol-role">Role (Optional)</Label>
                            <Input
                              id="vol-role"
                              value={newVolunteer.role}
                              onChange={(e) => setNewVolunteer({...newVolunteer, role: e.target.value})}
                              className="mt-1"
                              placeholder="Enter volunteer role"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddVolunteer} className="w-full mt-4">
                          Add Volunteer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border-t pt-4">
                    <GalleryUploader
                      images={currentInitiative.images || []}
                      onAddImage={handleAddImage}
                      onRemoveImage={handleRemoveImage}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button>
                {currentInitiative.status === 'completed' ? 'Download Report' : 'Edit Initiative'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CommunityInitiatives;
