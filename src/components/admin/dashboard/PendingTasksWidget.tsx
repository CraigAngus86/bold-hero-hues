
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, this would come from an API
const tasks = [
  {
    id: '1',
    title: 'Review new fixture submission',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    status: 'pending'
  },
  {
    id: '2',
    title: 'Approve player registration form',
    priority: 'medium',
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
    status: 'pending'
  },
  {
    id: '3',
    title: 'Upload match photos',
    priority: 'low',
    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
    status: 'pending'
  },
  {
    id: '4',
    title: 'Update league table standings',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    status: 'pending'
  },
  {
    id: '5',
    title: 'Send newsletter to subscribers',
    priority: 'high',
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    status: 'pending'
  }
];

const formatDueDate = (date: Date) => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    return `Due in ${Math.ceil(diffHours)} hours`;
  } else {
    const days = Math.ceil(diffHours / 24);
    return `Due in ${days} ${days === 1 ? 'day' : 'days'}`;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const PendingTasksWidget = () => {
  const toggleTaskCompletion = (taskId: string) => {
    console.log('Task completed:', taskId);
    // In a real application, this would update the task's status in the database
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Pending Tasks</span>
          <Badge variant="outline" className="bg-gray-100">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <button 
                  className="mt-0.5 rounded-full border border-gray-300 p-1 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleTaskCompletion(task.id)}
                  aria-label="Mark as completed"
                >
                  {task.status === 'completed' ? (
                    <CircleCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium leading-none">{task.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500 gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 p-3 border-t">
          <button className="text-blue-500 font-medium text-sm w-full text-center hover:underline">
            View All Tasks
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTasksWidget;
