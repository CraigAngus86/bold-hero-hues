
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

const PendingTasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data loading
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Update match reports',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Review sponsor proposals',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        status: 'in-progress'
      },
      {
        id: '3',
        title: 'Approve team photos',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending'
      }
    ];
    
    setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 500);
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Low</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const markAsComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: 'completed' as const } : task
      )
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No pending tasks!
          </div>
        ) : (
          <div>
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  task.status === 'completed' ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span 
                      className={`text-sm font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  {task.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => markAsComplete(task.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div>Due: <span className={task.dueDate < new Date() ? 'text-red-500 font-medium' : ''}>
                    {formatDueDate(task.dueDate)}
                  </span></div>
                  <div>{getPriorityBadge(task.priority)}</div>
                </div>
              </div>
            ))}
            <div className="bg-gray-50 p-3 border-t">
              <button className="text-blue-500 font-medium text-sm w-full text-center hover:underline">
                View All Tasks
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasksWidget;
