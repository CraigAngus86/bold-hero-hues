
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, FileText, FileVideo, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const RecentUploads: React.FC = () => {
  // Sample data for recent uploads
  const recentUploads = [
    { id: 1, name: 'team_photo.jpg', type: 'image', size: '2.4 MB', uploaded: new Date(2023, 5, 15) },
    { id: 2, name: 'match_highlights.mp4', type: 'video', size: '18.7 MB', uploaded: new Date(2023, 5, 14) },
    { id: 3, name: 'sponsorship_agreement.pdf', type: 'document', size: '1.2 MB', uploaded: new Date(2023, 5, 13) },
    { id: 4, name: 'fixture_list.xlsx', type: 'document', size: '0.8 MB', uploaded: new Date(2023, 5, 12) },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-4 w-4 text-red-500" />;
      case 'document':
      default:
        return <FileText className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentUploads.map((file) => (
            <div key={file.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-2">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.size}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(file.uploaded, 'MMM d')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUploads;
