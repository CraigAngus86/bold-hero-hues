
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CustomTable from '@/components/ui/CustomTable';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  PlusCircle, 
  BarChart4, 
  Edit, 
  Trash, 
  Copy,
  ChevronRight,
  Calendar,
  CheckSquare,
  Eye,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for polls and surveys
const mockPolls = [
  {
    id: '1',
    title: 'Player of the Match vs Fraserburgh',
    type: 'poll',
    createdAt: '2023-05-10T14:30:00',
    startDate: '2023-05-10T15:00:00',
    endDate: '2023-05-12T15:00:00',
    status: 'active',
    responses: 342,
    questions: [
      {
        id: 'q1',
        text: 'Who was your Player of the Match?',
        options: [
          { id: 'o1', text: 'Mark Smith', votes: 124 },
          { id: 'o2', text: 'Jamie Robertson', votes: 86 },
          { id: 'o3', text: 'Lachlan Macleod', votes: 132 },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Season Ticket Holder Feedback',
    type: 'survey',
    createdAt: '2023-05-08T09:15:00',
    startDate: '2023-05-09T10:00:00',
    endDate: '2023-05-16T23:59:59',
    status: 'active',
    responses: 87,
    questions: [
      {
        id: 'q1',
        text: 'How would you rate your matchday experience?',
        options: [
          { id: 'o1', text: 'Excellent', votes: 42 },
          { id: 'o2', text: 'Good', votes: 31 },
          { id: 'o3', text: 'Average', votes: 11 },
          { id: 'o4', text: 'Poor', votes: 3 }
        ]
      },
      {
        id: 'q2',
        text: 'How satisfied are you with the catering options?',
        options: [
          { id: 'o1', text: 'Very satisfied', votes: 28 },
          { id: 'o2', text: 'Satisfied', votes: 39 },
          { id: 'o3', text: 'Dissatisfied', votes: 15 },
          { id: 'o4', text: 'Very dissatisfied', votes: 5 }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'New Kit Design Vote',
    type: 'poll',
    createdAt: '2023-05-02T11:45:00',
    startDate: '2023-05-03T09:00:00',
    endDate: '2023-05-09T23:59:59',
    status: 'ended',
    responses: 578,
    questions: [
      {
        id: 'q1',
        text: 'Which home kit design do you prefer?',
        options: [
          { id: 'o1', text: 'Design A - Traditional', votes: 243 },
          { id: 'o2', text: 'Design B - Modern', votes: 187 },
          { id: 'o3', text: 'Design C - Retro', votes: 148 }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Matchday Programme Feedback',
    type: 'survey',
    createdAt: '2023-04-28T10:30:00',
    startDate: '2023-04-30T12:00:00',
    endDate: '2023-05-07T23:59:59',
    status: 'ended',
    responses: 124,
    questions: [
      {
        id: 'q1',
        text: 'Do you purchase a matchday programme?',
        options: [
          { id: 'o1', text: 'Every match', votes: 34 },
          { id: 'o2', text: 'Occasionally', votes: 52 },
          { id: 'o3', text: 'Rarely', votes: 21 },
          { id: 'o4', text: 'Never', votes: 17 }
        ]
      }
    ]
  }
];

// Status badge styles
const statusStyles = {
  active: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
  draft: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-yellow-100 text-yellow-800',
};

// Type badge styles
const typeStyles = {
  poll: 'bg-purple-100 text-purple-800',
  survey: 'bg-indigo-100 text-indigo-800',
};

const PollsAndSurveys: React.FC = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  
  // Filter polls based on search query and active tab
  const filteredPolls = polls.filter(poll => {
    // Filter by search query
    const matchesSearch = 
      poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && poll.status === 'active';
    if (activeTab === 'ended') return matchesSearch && poll.status === 'ended';
    if (activeTab === 'draft') return matchesSearch && poll.status === 'draft';
    if (activeTab === 'polls') return matchesSearch && poll.type === 'poll';
    if (activeTab === 'surveys') return matchesSearch && poll.type === 'survey';
    
    return matchesSearch;
  });
  
  // Define table columns
  const columns = [
    { 
      key: 'title', 
      title: 'Title',
      render: (item: any) => (
        <div className="flex items-center">
          <span>{item.title}</span>
          {item.status === 'active' && (
            <Badge className="ml-2 bg-green-100 text-green-800">Live</Badge>
          )}
        </div>
      )
    },
    { 
      key: 'type', 
      title: 'Type',
      render: (item: any) => (
        <Badge className={typeStyles[item.type as keyof typeof typeStyles]}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Badge>
      )
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
      key: 'dateRange', 
      title: 'Date Range',
      render: (item: any) => (
        <span className="text-sm">
          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
        </span>
      )
    },
    { 
      key: 'responses', 
      title: 'Responses',
      render: (item: any) => (
        <span className="font-medium">{item.responses}</span>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (item: any) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-blue-600" 
            onClick={() => setSelectedPoll(item.id)}
          >
            <BarChart4 size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Copy size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
            <Trash size={16} />
          </Button>
        </div>
      )
    },
  ];
  
  // Find the selected poll for results view
  const pollDetails = polls.find(poll => poll.id === selectedPoll);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {selectedPoll ? (
        // Poll results view
        <>
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600"
              onClick={() => setSelectedPoll(null)}
            >
              <ChevronRight className="rotate-180 mr-1" size={16} />
              Back to list
            </Button>
            <Badge className={typeStyles[pollDetails?.type as keyof typeof typeStyles]}>
              {pollDetails?.type.charAt(0).toUpperCase() + pollDetails?.type.slice(1)}
            </Badge>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{pollDetails?.title}</h2>
            <div className="flex flex-wrap gap-3 mt-2">
              <Badge className={statusStyles[pollDetails?.status as keyof typeof statusStyles]}>
                {pollDetails?.status.charAt(0).toUpperCase() + pollDetails?.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {new Date(pollDetails?.startDate || '').toLocaleDateString()} - {new Date(pollDetails?.endDate || '').toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <CheckSquare size={14} className="mr-1" />
                {pollDetails?.responses} responses
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {pollDetails?.questions.map(question => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {question.options.map(option => {
                      // Calculate percentage for this option
                      const totalVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0);
                      const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option.text}</span>
                            <span className="text-gray-500">{option.votes} votes ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-team-blue h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline">Export Results</Button>
            <div className="space-x-2">
              <Button variant="outline">Edit</Button>
              <Button variant="outline" className="text-red-600">Delete</Button>
            </div>
          </div>
        </>
      ) : (
        // Polls and surveys list view
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Polls & Surveys</h2>
              <p className="text-gray-600">Manage fan polls and feedback surveys</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="latest">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="responses">Most responses</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Create New</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="polls">Polls</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <Card>
                <CardContent className="p-0">
                  <CustomTable
                    columns={columns}
                    data={filteredPolls}
                    noDataMessage="No polls or surveys found"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>This is a demonstration with sample polls and surveys. In a future update, these will be stored in and retrieved from Supabase.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PollsAndSurveys;
