
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertOctagon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ContentStatusItem {
  id: string;
  title: string;
  status: 'warning' | 'error' | 'info' | 'success';
  link: string;
  description: string;
}

interface StatusSummaryProps {
  items: ContentStatusItem[];
  title: string;
  viewAllLink?: string;
}

export function StatusSummary({ items, title, viewAllLink }: StatusSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  const getStatusIcon = (status: ContentStatusItem['status']) => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getStatusClass = (status: ContentStatusItem['status']) => {
    switch (status) {
      case 'warning':
        return "bg-amber-50 border-amber-200 text-amber-700";
      case 'error':
        return "bg-red-50 border-red-200 text-red-700";
      case 'info':
        return "bg-blue-50 border-blue-200 text-blue-700";
      case 'success':
        return "bg-green-50 border-green-200 text-green-700";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>Content requiring attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={cn("p-3 rounded-md border flex items-start justify-between", getStatusClass(item.status))}>
            <div className="flex gap-2 items-start">
              {getStatusIcon(item.status)}
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs">{item.description}</p>
              </div>
            </div>
            <Button asChild size="sm" variant="ghost" className="h-7">
              <Link to={item.link}>View</Link>
            </Button>
          </div>
        ))}
        
        {viewAllLink && (
          <Button asChild variant="link" size="sm" className="w-full mt-2">
            <Link to={viewAllLink}>View all items</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
