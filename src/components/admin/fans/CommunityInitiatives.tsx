
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  PlusCircle, 
  Calendar, 
  Heart, 
  Users, 
  Trash, 
  Edit,
  Eye,
  ArrowUpRight,
  MapPin,
  Clock,
  BarChart3,
  Image,
  FileText,
  Smile,
  CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for community initiatives
const mockInitiatives = [
  {
    id: '1',
    title: 'Youth Football Camp',
    type: 'youth',
    date: '2023-06-15T09:00:00',
    location: 'Spain Park Training Ground',
    status: 'upcoming',
    volunteers: 12,
    participants: 45,
    description: 'A free football camp for local youth aged 8-14. Coaching from our first team players and staff.',
    impact: 'Provides access to quality coaching for young people in the community.'
  },
  {
    id: '2',
    title: 'Annual Beach Clean',
    type: 'charity',
    date: '2023-05-20T10:00:00',
    location: 'Aberdeen Beach',
    status: 'upcoming',
    volunteers: 24,
    participants: 0,
    description: 'Join the Banks o\' Dee team in helping clean up Aberdeen Beach. All equipment provided.',
    impact: 'Environmental protection and community pride in local natural resources.'
  },
  {
    id: '3',
    title: 'Food Bank Collection',
    type: 'charity',
    date: '2023-05-06T08:00:00',
    location: 'Spain Park Stadium',
    status: 'completed',
    volunteers: 8,
    participants: 0,
    description: 'Match day food collection for local food banks. Fans encouraged to bring non-perishable items.',
    impact: '345kg of food donated to local food banks, supporting 120+ families.'
  },
  {
    id: '4',
    title: 'Schools Outreach Program',
    type: 'education',
    date: '2023-04-18T09:30:00',
    location: 'Various Aberdeen Schools',
    status: 'completed',
    volunteers: 6,
    participants: 210,
    description: 'Players and coaching staff visit local schools to promote both sport and education.',
    impact: 'Engaged with over 200 school children, promoting sport and healthy lifestyles.'
  },
  {
    id: '5',
    title: 'Walking Football for Over 60s',
    type: 'community',
    date: '2023-06-22T14:00:00',
    location: 'Spain Park Indoor Arena',
    status: 'upcoming',
    volunteers: 4,
    participants: 25,
    description: 'Weekly walking football sessions for seniors to promote fitness and social connections.',
    impact: 'Improving health and reducing isolation among elderly community members.'
  },
];

// Type badge styles
const typeStyles = {
  youth: 'bg-green-100 text-green-800',
  charity: 'bg-purple-100 text-purple-800',
  education: 'bg-blue-100 text-blue-800',
  community: 'bg-yellow-100 text-yellow-800',
};

// Status badge styles
const statusStyles = {
  upcoming: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
};

const CommunityInitiatives: React.FC = () => {
  const [initiatives, setInitiatives] = useState(mockInitiatives);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  
  // Filter initiatives based on search query and active tab
  const filteredInitiatives = initiatives.filter(initiative => {
    // Filter by search query
    const matchesSearch = 
      initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'upcoming') return matchesSearch && initiative.status === 'upcoming';
    if (activeTab === 'completed') return matchesSearch && initiative.status === 'completed';
    if (activeTab === initiative.type) return matchesSearch;
    
    return matchesSearch;
  });
  
  // Find the selected initiative for detailed view
  const initiativeDetails = initiatives.find(initiative => initiative.id === selectedInitiative);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {selectedInitiative ? (
        // Initiative details view
        <>
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600"
              onClick={() => setSelectedInitiative(null)}
            >
              Back to initiatives
            </Button>
            <Badge className={typeStyles[initiativeDetails?.type as keyof typeof typeStyles]}>
              {initiativeDetails?.type.charAt(0).toUpperCase() + initiativeDetails?.type.slice(1)}
            </Badge>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{initiativeDetails?.title}</h2>
            <div className="flex flex-wrap gap-3 mt-2">
              <Badge className={statusStyles[initiativeDetails?.status as keyof typeof statusStyles]}>
                {initiativeDetails?.status.charAt(0).toUpperCase() + initiativeDetails?.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {new Date(initiativeDetails?.date || '').toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                {new Date(initiativeDetails?.date || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1" />
                {initiativeDetails?.location}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{initiativeDetails?.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{initiativeDetails?.impact}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Media</CardTitle>
                </CardHeader>
                <CardContent>
                  {initiativeDetails?.status === 'completed' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                          <Image className="text-gray-400" size={24} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No photos available yet</p>
                      <Button variant="outline" className="mt-2">
                        Upload Photos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Volunteers</span>
                      <Badge variant="outline">{initiativeDetails?.volunteers}</Badge>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mt-1">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(100, (initiativeDetails?.volunteers || 0) * 5)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {initiativeDetails?.participants > 0 && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Participants</span>
                        <Badge variant="outline">{initiativeDetails?.participants}</Badge>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-1">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${Math.min(100, (initiativeDetails?.participants || 0) / 3)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full">
                    {initiativeDetails?.status === 'completed' ? 'View Attendance Records' : 'Manage Volunteers'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2" />
                      Event Plan
                    </div>
                    <ArrowUpRight size={14} />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 size={16} className="mr-2" />
                      Task List
                    </div>
                    <ArrowUpRight size={14} />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      Volunteer Schedule
                    </div>
                    <ArrowUpRight size={14} />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Edit size={16} className="mr-2" />
                    Edit Initiative
                  </Button>
                  {initiativeDetails?.status === 'upcoming' && (
                    <Button className="w-full" variant="outline">
                      <Calendar size={16} className="mr-2" />
                      Reschedule
                    </Button>
                  )}
                  <Button className="w-full text-red-600" variant="outline">
                    <Trash size={16} className="mr-2" />
                    Delete Initiative
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        // Initiatives list view
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Community Initiatives</h2>
              <p className="text-gray-600">Manage community and charity programs</p>
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
              <Select defaultValue="date">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>New Initiative</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="youth">Youth</TabsTrigger>
              <TabsTrigger value="charity">Charity</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInitiatives.map(initiative => (
                  <Card 
                    key={initiative.id} 
                    className="cursor-pointer hover:border-team-blue transition-colors"
                    onClick={() => setSelectedInitiative(initiative.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge className={typeStyles[initiative.type as keyof typeof typeStyles]}>
                          {initiative.type.charAt(0).toUpperCase() + initiative.type.slice(1)}
                        </Badge>
                        <Badge className={statusStyles[initiative.status as keyof typeof statusStyles]}>
                          {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{initiative.title}</CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap gap-4 mt-1">
                          <div className="flex items-center text-xs">
                            <Calendar size={12} className="mr-1" />
                            {new Date(initiative.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-xs">
                            <MapPin size={12} className="mr-1" />
                            {initiative.location}
                          </div>
                          {initiative.volunteers > 0 && (
                            <div className="flex items-center text-xs">
                              <Users size={12} className="mr-1" />
                              {initiative.volunteers} volunteers
                            </div>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {initiative.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 border-t flex justify-between">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredInitiatives.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Heart size={48} className="mx-auto mb-4 opacity-40" />
                  <p>No community initiatives found for your search criteria.</p>
                  <Button variant="outline" className="mt-4">
                    <PlusCircle size={16} className="mr-2" />
                    Create New Initiative
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Community Impact Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Initiatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Heart size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Volunteer Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">315</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Youth Engaged</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Smile size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">427</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Funds Raised</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3 size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">£6,245</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>This is a demonstration with sample content. In a future update, these will be stored in and retrieved from Supabase.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CommunityInitiatives;
