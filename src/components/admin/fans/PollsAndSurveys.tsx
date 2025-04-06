import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  CheckSquare,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ClipboardList,
  Eye,
  PenLine,
  ChevronDown,
  Clock,
  Search,
  Calendar as CalendarDisplay,
  PieChart as PieChartIcon,
  MoveVertical
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { DataTable } from '@/components/admin/common/DataTable';
import { Poll, PollQuestion, PollOption } from '@/types/fans';
import { fetchPolls, fetchPollDetails, createPoll, addPollQuestion, addPollOption } from '@/services/fansDbService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const statusStyles = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  scheduled: 'bg-purple-100 text-purple-800',
  ended: 'bg-blue-100 text-blue-800',
};

const dummyPolls = [
  {
    id: '1',
    title: 'Player of the Month - April',
    type: 'poll',
    status: 'ended',
    createdAt: '2023-05-01T10:00:00Z',
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-04-30T23:59:59Z',
    responses: 142,
    questions: [
      {
        id: '1',
        text: 'Select your player of the month for April',
        type: 'single_choice',
        options: [
          { id: '1', text: 'John Smith', votes: 42 },
          { id: '2', text: 'Michael Johnson', votes: 57 },
          { id: '3', text: 'Robert Wilson', votes: 31 },
          { id: '4', text: 'David Thompson', votes: 12 },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Match Day Experience Survey',
    type: 'survey',
    status: 'active',
    createdAt: '2023-05-05T14:30:00Z',
    startDate: '2023-05-01T00:00:00Z',
    endDate: '2023-05-31T23:59:59Z',
    responses: 48,
    questions: [
      {
        id: '1',
        text: 'How would you rate your overall match day experience?',
        type: 'rating'
      },
      {
        id: '2',
        text: 'Which amenities did you use?',
        type: 'multiple_choice',
        options: [
          { id: '1', text: 'Food kiosk', votes: 35 },
          { id: '2', text: 'Club shop', votes: 22 },
          { id: '3', text: 'Bar', votes: 40 },
          { id: '4', text: 'Toilet facilities', votes: 45 },
        ]
      },
      {
        id: '3',
        text: 'Do you have any suggestions for improvement?',
        type: 'text'
      }
    ]
  },
  {
    id: '3',
    title: 'Kit Design Vote 2023/24',
    type: 'poll',
    status: 'scheduled',
    createdAt: '2023-05-10T09:15:00Z',
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-06-15T23:59:59Z',
    responses: 0,
    questions: [
      {
        id: '1',
        text: 'Which kit design do you prefer for the 2023/24 season?',
        type: 'single_choice',
        options: [
          { id: '1', text: 'Design A - Blue striped', votes: 0 },
          { id: '2', text: 'Design B - Solid blue with gold trim', votes: 0 },
          { id: '3', text: 'Design C - White away kit with blue accent', votes: 0 },
        ]
      }
    ]
  }
];

const SortableQuestionItem = ({ id, question, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 mb-2 border rounded-md bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-move p-1">
            <MoveVertical size={16} />
          </div>
          <div>
            <p className="font-medium">{question.text}</p>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {question.type === 'single_choice' ? 'Single Choice' : 
                 question.type === 'multiple_choice' ? 'Multiple Choice' :
                 question.type === 'text' ? 'Text Input' : 'Rating'}
              </Badge>
              {question.required && (
                <Badge variant="secondary">Required</Badge>
              )}
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {(question.type === 'single_choice' || question.type === 'multiple_choice') && question.options && (
        <div className="pl-8 mt-2">
          {question.options.map((option, index) => (
            <div key={option.id || index} className="flex items-center gap-2 mt-1 text-sm">
              <div className="w-4 h-4 flex items-center justify-center border rounded-sm">
                {question.type === 'single_choice' ? '○' : '□'}
              </div>
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PollsAndSurveys = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [polls, setPolls] = useState(dummyPolls);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    type: 'poll',
    status: 'draft',
    startDate: null,
    endDate: null,
    is_featured: false,
    questions: []
  });
  
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single_choice',
    required: true,
    options: ['']
  });
  
  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };
  
  const updateOption = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };
  
  const removeOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };
  
  const addQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('Question text cannot be empty');
      return;
    }
    
    if ((newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice') && 
        (!newQuestion.options.length || !newQuestion.options[0].trim())) {
      toast.error('Please add at least one option for choice questions');
      return;
    }
    
    const questionToAdd = {
      id: `new-${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type,
      required: newQuestion.required,
      options: newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice'
        ? newQuestion.options.filter(opt => opt.trim()).map((text, index) => ({ 
            id: `new-option-${Date.now()}-${index}`, 
            text,
            votes: 0
          }))
        : []
    };
    
    setNewPoll({
      ...newPoll,
      questions: [...newPoll.questions, questionToAdd]
    });
    
    setNewQuestion({
      text: '',
      type: 'single_choice',
      required: true,
      options: ['']
    });
    
    toast.success('Question added');
  };
  
  const removeQuestion = (id) => {
    setNewPoll({
      ...newPoll,
      questions: newPoll.questions.filter(q => q.id !== id)
    });
    toast.success('Question removed');
  };
  
  const onDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setNewPoll(prevPoll => {
        const oldIndex = prevPoll.questions.findIndex(q => q.id === active.id);
        const newIndex = prevPoll.questions.findIndex(q => q.id === over.id);
        
        return {
          ...prevPoll,
          questions: arrayMove(prevPoll.questions, oldIndex, newIndex)
        };
      });
    }
  };
  
  const handleCreatePoll = async () => {
    if (!newPoll.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (newPoll.questions.length === 0) {
      toast.error('At least one question is required');
      return;
    }
    
    if (newPoll.status !== 'draft' && (!newPoll.startDate || !newPoll.endDate)) {
      toast.error('Start and end dates are required for scheduled or active polls');
      return;
    }
    
    toast.success(`${newPoll.type === 'poll' ? 'Poll' : 'Survey'} created successfully`);
    
    const fakePoll = {
      id: `new-${Date.now()}`,
      title: newPoll.title,
      type: newPoll.type,
      status: newPoll.status,
      createdAt: new Date().toISOString(),
      startDate: newPoll.startDate ? new Date(newPoll.startDate).toISOString() : null,
      endDate: newPoll.endDate ? new Date(newPoll.endDate).toISOString() : null,
      responses: 0,
      questions: newPoll.questions
    };
    
    setPolls([fakePoll, ...polls]);
    setCreateDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewPoll({
      title: '',
      description: '',
      type: 'poll',
      status: 'draft',
      startDate: null,
      endDate: null,
      is_featured: false,
      questions: []
    });
    setNewQuestion({
      text: '',
      type: 'single_choice',
      required: true,
      options: ['']
    });
  };
  
  const handleViewPoll = (poll) => {
    setCurrentPoll(poll);
    setViewDialogOpen(true);
  };
  
  const filteredPolls = polls.filter(poll => {
    if (activeTab === 'all') {
    } else if (activeTab === 'polls') {
      if (poll.type !== 'poll') return false;
    } else if (activeTab === 'surveys') {
      if (poll.type !== 'survey') return false;
    } else if (activeTab === 'active') {
      if (poll.status !== 'active') return false;
    } else if (activeTab === 'draft') {
      if (poll.status !== 'draft') return false;
    }
    
    if (searchQuery) {
      return poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const generateChartData = (question) => {
    if (!question.options) return null;
    
    const labels = question.options.map(opt => opt.text);
    const data = question.options.map(opt => opt.votes);
    
    if (question.type === 'single_choice') {
      return {
        labels,
        datasets: [
          {
            label: 'Votes',
            data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Responses',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
  };
  
  const columns = [
    { 
      key: 'title', 
      header: 'Title',
      cell: (poll) => (
        <div>
          <div className="font-medium">{poll.title}</div>
          <div className="flex items-center mt-1">
            <Badge variant={poll.type === 'poll' ? 'default' : 'secondary'} className="mr-2">
              {poll.type === 'poll' ? 'Poll' : 'Survey'}
            </Badge>
            <Badge variant="outline" className={statusStyles[poll.status]}>
              {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
            </Badge>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'dates',
      header: 'Schedule',
      cell: (poll) => (
        <div className="text-sm">
          {poll.startDate && poll.endDate ? (
            <>
              <div className="flex items-center text-gray-700">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {new Date(poll.startDate).toLocaleDateString()} to {new Date(poll.endDate).toLocaleDateString()}
              </div>
              <div className="mt-1 text-gray-500">
                Created: {new Date(poll.createdAt).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              Created: {new Date(poll.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'stats',
      header: 'Responses',
      cell: (poll) => (
        <div className="flex flex-col items-center">
          <div className="text-xl font-semibold">{poll.responses}</div>
          <div className="text-xs text-gray-500">
            {poll.questions.length} question{poll.questions.length !== 1 ? 's' : ''}
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (poll) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewPoll(poll)}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <PenLine size={16} />
          </Button>
          {poll.status !== 'ended' && (
            <Button variant="ghost" size="sm">
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Polls & Surveys</h2>
          <p className="text-gray-600">Create and manage polls and surveys for fans</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search polls..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Create New</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  Create New {newPoll.type === 'poll' ? 'Poll' : 'Survey'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="poll-title">Title</Label>
                      <Input
                        id="poll-title"
                        value={newPoll.title}
                        onChange={(e) => setNewPoll({...newPoll, title: e.target.value})}
                        className="mt-1"
                        placeholder="Enter title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="poll-type">Type</Label>
                      <Select
                        value={newPoll.type}
                        onValueChange={(value) => setNewPoll({...newPoll, type: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poll">Poll</SelectItem>
                          <SelectItem value="survey">Survey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="poll-description">Description (Optional)</Label>
                    <Input
                      id="poll-description"
                      value={newPoll.description}
                      onChange={(e) => setNewPoll({...newPoll, description: e.target.value})}
                      className="mt-1"
                      placeholder="Enter description..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="poll-status">Status</Label>
                      <Select
                        value={newPoll.status}
                        onValueChange={(value) => setNewPoll({...newPoll, status: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newPoll.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newPoll.startDate ? format(new Date(newPoll.startDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newPoll.startDate ? new Date(newPoll.startDate) : undefined}
                              onSelect={(date) => setNewPoll({...newPoll, startDate: date?.toISOString()})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newPoll.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newPoll.endDate ? format(new Date(newPoll.endDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newPoll.endDate ? new Date(newPoll.endDate) : undefined}
                              onSelect={(date) => setNewPoll({...newPoll, endDate: date?.toISOString()})}
                              initialFocus
                              disabled={(date) => {
                                return !newPoll.startDate ? false : date < new Date(newPoll.startDate);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newPoll.is_featured}
                      onCheckedChange={(checked) => setNewPoll({...newPoll, is_featured: checked})}
                    />
                    <Label htmlFor="featured">Feature this {newPoll.type === 'poll' ? 'poll' : 'survey'}</Label>
                  </div>
                </div>
                
                <div className="border-t my-4"></div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Questions ({newPoll.questions.length})
                  </h3>
                  
                  {newPoll.questions.length > 0 && (
                    <div className="mb-6">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext
                          items={newPoll.questions.map(q => q.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {newPoll.questions.map((question) => (
                            <SortableQuestionItem
                              key={question.id}
                              id={question.id}
                              question={question}
                              onDelete={removeQuestion}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                  
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Add New Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="question-text">Question Text</Label>
                          <Input
                            id="question-text"
                            value={newQuestion.text}
                            onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                            className="mt-1"
                            placeholder="Enter question text..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="question-type">Question Type</Label>
                            <Select
                              value={newQuestion.type}
                              onValueChange={(value) => setNewQuestion({
                                ...newQuestion, 
                                type: value,
                                options: value === 'single_choice' || value === 'multiple_choice' ? [''] : []
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single_choice">Single Choice</SelectItem>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="required"
                                checked={newQuestion.required}
                                onCheckedChange={(checked) => setNewQuestion({...newQuestion, required: checked})}
                              />
                              <Label htmlFor="required">Required question</Label>
                            </div>
                          </div>
                        </div>
                        
                        {(newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice') && (
                          <div>
                            <Label className="mb-2 block">Options</Label>
                            <div className="space-y-2">
                              {newQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1"
                                  />
                                  {index > 0 && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => removeOption(index)}
                                      type="button"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                                type="button"
                                className="mt-2"
                              >
                                <Plus size={14} className="mr-1" /> Add Option
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Button onClick={addQuestion} type="button" className="w-full">
                          Add Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePoll}>
                  Create {newPoll.type === 'poll' ? 'Poll' : 'Survey'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-2">
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredPolls}
                noDataMessage="No polls or surveys found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {currentPoll && (
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {currentPoll.title}
                <Badge variant={currentPoll.type === 'poll' ? 'default' : 'secondary'} className="ml-2">
                  {currentPoll.type === 'poll' ? 'Poll' : 'Survey'}
                </Badge>
                <Badge variant="outline" className={statusStyles[currentPoll.status]}>
                  {currentPoll.status.charAt(0).toUpperCase() + currentPoll.status.slice(1)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="py-2">
                <div className="flex flex-wrap gap-y-2 items-center text-sm text-gray-700 mb-4">
                  <div className="flex items-center mr-4">
                    <CalendarDisplay size={16} className="mr-1" />
                    <span>
                      {currentPoll.startDate && currentPoll.endDate 
                        ? `${new Date(currentPoll.startDate).toLocaleDateString()} to ${new Date(currentPoll.endDate).toLocaleDateString()}`
                        : 'No schedule set'}
                    </span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Clock size={16} className="mr-1" />
                    <span>Created: {new Date(currentPoll.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <ClipboardList size={16} className="mr-1" />
                    <span>{currentPoll.questions.length} question{currentPoll.questions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 mb-6 flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <PieChartIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">Total Responses</h3>
                    <p className="text-2xl font-semibold text-blue-900">{currentPoll.responses}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {currentPoll.questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Question {index + 1}: {question.text}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {question.type === 'single_choice' && (
                          <div className="h-64 flex justify-center">
                            <Pie data={generateChartData(question)} />
                          </div>
                        )}
                        
                        {question.type === 'multiple_choice' && (
                          <div className="h-64">
                            <Bar 
                              data={generateChartData(question)} 
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    ticks: {
                                      precision: 0
                                    }
                                  }
                                }
                              }} 
                            />
                          </div>
                        )}
                        
                        {question.type === 'text' && (
                          <div className="py-4 text-center text-gray-500">
                            <p>Text responses are available in the detailed report</p>
                          </div>
                        )}
                        
                        {question.type === 'rating' && (
                          <div className="py-4 text-center">
                            <div className="inline-block bg-gray-100 rounded-lg p-4">
                              <div className="text-3xl font-bold text-blue-600">4.3</div>
                              <div className="text-sm text-gray-500">Average Rating</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button>
                Export Results
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default PollsAndSurveys;
